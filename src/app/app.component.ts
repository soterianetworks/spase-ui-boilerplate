import {Component, Injector, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    GuardsCheckEnd,
    NavigationEnd,
    NavigationError,
    NavigationStart,
    Router,
} from '@angular/router';
import {MenuItem} from 'primeng/components/common/menuitem';
import {MessageService} from 'primeng/primeng';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';

import {
    AppBootService,
    ScopeService,
    PermissionService,
    EventService,
    I18nProvider,
    Breadcrumb,
} from 'spase-ui';

enum MenuOrientation { STATIC, OVERLAY }

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {

    showPage = false;

    user: any;

    activeTabIndex = -1;

    sidebarActive = false;

    loading = false;

    layoutMode: MenuOrientation = MenuOrientation.STATIC;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    rotateMenuButton: boolean;

    sidebarClick: boolean;

    topbarItemClick: boolean;

    menuButtonClick: boolean;

    activeTopbarItem: any;

    documentClickListener: Function;

    breadcrumbItems: MenuItem[] = [];

    theme = 'green';

    protected subscriptions: Array<Subscription> = [];

    lang = '';

    constructor(public initSvc: AppBootService, public renderer: Renderer2,
                private permSvc: PermissionService, private scopeService: ScopeService,
                public injector: Injector, private route: ActivatedRoute, protected router: Router,
                public eventService: EventService, private messageService: MessageService) {

        if (this.initSvc.redirectInProgress) {
            return;
        }
        if (this.initSvc.loggedIn) {

            this.showPage = true;

            if (this.initSvc.user) {
                this.user = this.initSvc.user;
                this.permSvc.createObject(this.user.permissions);
                this.scopeService.createObject(this.user.roles);
            } else {
                this.router.navigate(['/error-page'], {
                    queryParams: {
                        errorMessage: this.initSvc.errorMessage,
                    },
                });
                return;
            }
        }

        this.subscriptions.push(this.eventService.on('localize', res => {
            this.createBreadcrumb();
            this.lang = I18nProvider.selected;
        }));
        this.initEventHandler();

        this.subscriptions.push(this.eventService.on('showSuccess', res => {
            this.showSuccess(res);
        }));

        this.subscriptions.push(this.eventService.on('showError', res => {
            this.showError(res);
        }));

        this.subscriptions.push(this.eventService.on('showInfo', res => {
            this.showInfo(res);
        }));

        this.subscriptions.push(this.eventService.on('showPage', res => {
            this.showPage = true;
        }));

    }

    navigateToErrorPage() {
        this.router.navigate(['/error-page']);
        return;
    }

    initEventHandler() {
        this.router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                this.loading = true;
            } else if (event instanceof NavigationEnd) {
                this.createBreadcrumb();
                this.loading = false;
            } else if (event instanceof GuardsCheckEnd && !event.shouldActivate) {
                this.loading = false;
                this.showError('access-denied');
            } else if (event instanceof NavigationError) {
                this.loading = false;
                // Http request throwing error, no processing
                const isHttpError = event.error.type && event.error.type == 'HTTP';
                if (isHttpError) {
                    return;
                }
                this.showError(event.error.message ? event.error.message : event.error);
            }
        });
    }

    buildBreadcrumb(route?: ActivatedRouteSnapshot, parentRoutePath?: string): MenuItem[] {
        const items: MenuItem[] = [];
        if (!route) {
            route = this.route.snapshot;
        }

        let routePath = '';

        // Handling auxiliary routes
        let endBrackets = '';
        if (parentRoutePath && route.parent && route.parent.outlet !== 'primary') {
            const parentRouteStrArr = parentRoutePath.split('');
            const evens = _.remove(parentRouteStrArr, function (n) {
                return n === ')';
            });

            endBrackets = evens.join('');
            parentRoutePath = parentRouteStrArr.join('');
        }
        if (route.routeConfig && route.routeConfig.path) {
            if (route.outlet !== 'primary') {
                routePath = `${parentRoutePath}/(${route.outlet}:${route.routeConfig.path})${endBrackets}`;
            } else {
                routePath = `${parentRoutePath}/${route.routeConfig.path}`;
            }
            if (!_.isEmpty(route.paramMap.keys)) {
                route.paramMap.keys.forEach(key => {
                    routePath = routePath.replace(':' + key, route.params[key]);
                });
            }
            if (route.data.breadcrumbs) {
                route.data.breadcrumbs.forEach(item => {
                    let url = '';
                    if (!item.link || route.outlet !== 'primary') {
                        url = `#${routePath}`;
                    } else {
                        const link = item.linkByResolve ?
                            `${item.link}/${_.get(route.data, item.linkByResolve)}` : item.link;
                        url = `#${parentRoutePath}/${link}`;
                    }
                    if (item.value) {
                        items.push({label: I18nProvider.get(item.value, item.i18n), url: url});
                    } else if (item.path) {
                        const isCreate = _.isEmpty(_.get(route.data, item.path)) && route.params.id === 'new';
                        if (isCreate) {
                            items.push({label: I18nProvider.get('new'), url: url});
                        } else {
                            const valueByPath = _.get(route.data, item.path);
                            items.push({
                                label: item.i18n ? I18nProvider.get(valueByPath, item.i18n) : valueByPath,
                                url: url,
                            });
                        }
                    }
                });
            }
        }
        if (route.firstChild) {
            items.push(...this.buildBreadcrumb(route.firstChild, routePath));
        }
        return items;
    }

    createBreadcrumb() {
        this.breadcrumbItems = this.buildBreadcrumb();
    }

    changeUser(userName) {
    }

    showSuccess(msg?: string) {
        this.pushMsg('success', I18nProvider.get('success'), msg || I18nProvider.get('successSave'));
    }

    showError(msg) {
        this.pushMsg('error', I18nProvider.get('error'), I18nProvider.get(msg));
    }

    showInfo(msg) {
        this.pushMsg('info', I18nProvider.get('info'), I18nProvider.get(msg));
    }

    pushMsg(severity, summary, detail) {
        const msg = {
            key: 'msgs',
            severity: severity,
            summary: summary,
            detail: detail,
            id: new Date().getTime().toString(),
            life: 5000,
        };
        this.messageService.add(msg);

    }

    dialog: any = {
        display: false, onSuccess: null, onClose: null,
        config: {
            confirmLabName: 'yes',
            closeLabName: 'no',
            confirmMsg: 'confirmMsg',
            headerName: 'confirm',
        },
        open(onSuccess: any, config, onClose?: any) {
            this.onSuccess = onSuccess;
            this.onClose = onClose;
            this.display = true;
            if (config) {
                if (_.isString(config.confirmLabName)) {
                    this.config.confirmLabName = config.confirmLabName;
                }
                if (_.isString(config.closeLabName)) {
                    this.config.closeLabName = config.closeLabName;
                }
                if (_.isString(config.confirmMsg)) {
                    this.config.confirmMsg = config.confirmMsg;
                }
                if (_.isString(config.headerName)) {
                    this.config.headerName = config.headerName;
                }
            }
        },

        close() {
            if (this.onClose) {
                this.onClose();
            }
            this.display = false;
        },

        confirm() {
            if (this.onSuccess) {
                this.onSuccess();
            }
            this.display = false;
        },
    };

    ngOnInit() {
        this.breadcrumbItems = Breadcrumb.create(this.route.snapshot);

        this.documentClickListener = this.renderer.listen('body', 'click', (event) => {

            if (!this.topbarItemClick) {
                this.activeTopbarItem = null;
                this.topbarMenuActive = false;
            }

            if (!this.menuButtonClick && !this.sidebarClick && (this.overlay || !this.isDesktop())) {
                this.sidebarActive = false;
            }

            this.topbarItemClick = false;
            this.sidebarClick = false;
            this.menuButtonClick = false;
        });
    }

    onTabClick(event: Event, index: number) {
        if (this.activeTabIndex === index) {
            this.sidebarActive = !this.sidebarActive;
        } else {
            this.activeTabIndex = index;
            this.sidebarActive = true;
        }

        event.preventDefault();
    }

    getRole() {
        const url = window.location.href;
        const index = url.indexOf('role=');
        return index > -1 ? url.substr(index + 5) : 'operator';
    }

    closeSidebar(event: Event) {
        this.sidebarActive = false;
        event.preventDefault();
    }

    onSidebarClick(event: Event) {
        this.sidebarClick = true;
    }

    onTopbarMenuButtonClick(event: Event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        event.preventDefault();
    }

    onMenuButtonClick(event: Event, index: number) {
        this.menuButtonClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;
        this.sidebarActive = !this.sidebarActive;

        if (this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        } else {
            if (this.isDesktop()) {
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            } else {
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
            }
        }

        if (this.activeTabIndex < 0) {
            this.activeTabIndex = 0;
        }

        event.preventDefault();
    }

    onTopbarItemClick(event: Event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }

    onTopbarSearchItemClick(event: Event) {
        this.topbarItemClick = true;

        event.preventDefault();
    }

    get overlay(): boolean {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
        this.subscriptions.forEach(i => {
            if (i) {
                i.unsubscribe();
            }
        });

    }

}
