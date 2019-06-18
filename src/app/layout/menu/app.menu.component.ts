import {Component, Injector, Input} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MenuItem} from 'primeng/primeng';

import {RouteUtils} from 'spase-ui';
import {BaseComponent} from '../../module/common/base.component';

import {AppMenuRegistry, Menu} from './app.menu.registry';

@Component({
    selector: 'app-menu', template: `
        <ul app-submenu [item]="model" isRoot="true" class="navigation-menu" visible="true"></ul>
    `,
})
export class AppMenuComponent extends BaseComponent {

    model: any[];

    @Input() sidebarKey: string;

    constructor(public injector: Injector) {
        super(injector);
    }

    onInit() {
        if (!this.sidebarKey || !AppMenuRegistry.menus || AppMenuRegistry.menus.length == 0) {
            return;
        }
        // TODO check parentKey not exist
        let menus = AppMenuRegistry.menus.filter(model => model.sidebarKey === this.sidebarKey);
        let rootMenus = menus.filter(menu => !menu.parentKey);
        if (!rootMenus || rootMenus.length == 0) {
            return;
        }

        this.model = this.buildMenuTree(rootMenus, menus);
    }

    private buildMenuTree(parentMenus: Menu[], menus: Menu[]): Menu[] {
        parentMenus.forEach(parentMenu => {
            let childMenus = menus.filter(menu => menu.parentKey === parentMenu.menuKey);
            if (childMenus && childMenus.length > 0) {
                parentMenu.items = this.buildMenuTree(childMenus, menus);
            }
        });
        return parentMenus.sort((m1, m2) => m1.index - m2.index);
    }

}

@Component({
    /* tslint:disable:component-selector */
    selector: '[app-submenu]', /* tslint:enable:component-selector */
    template: `
        <ng-template ngFor let-child let-i="index" [ngForOf]="(isRoot ? item : item.items)">
            <li [ngClass]="{'active-menuitem': isActive(i)}"
                [class]="child.badgeStyleClass"
                *ngIf="child.visible === false ? false : true">
                <a [href]="child.url||'#'" (click)="itemClick($event,child,i)" *ngIf="!child.routerLink"
                   [attr.tabindex]="!visible ? '-1' : null" [attr.target]="child.target"
                   (mouseenter)="hover=true" (mouseleave)="hover=false">
                    <i [ngClass]="child.icon"></i>
                    <span>{{child.label | localize:lang:child.i18nProviderName}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="fa fa-fw fa-angle-down ui-menuitem-toggler" *ngIf="child.items"></i>
                </a>

                <a (click)="itemClick($event,child,i)" *ngIf="child.routerLink"
                   [routerLink]="child.routerLink" routerLinkActive="active-menuitem-routerlink"
                   [routerLinkActiveOptions]="{exact: false}" [attr.tabindex]="!visible ? '-1' : null"
                   [attr.target]="child.target"
                   (mouseenter)="hover=true" (mouseleave)="hover=false">
                    <i [ngClass]="child.icon"></i>
                    <span>{{child.label | localize:lang:child.i18nProviderName}}</span>
                    <span class="menuitem-badge" *ngIf="child.badge">{{child.badge}}</span>
                    <i class="fa fa-fw fa-angle-down ui-menuitem-toggler" *ngIf="child.items"></i>
                </a>
                <ul app-submenu [item]="child" *ngIf="child.items" [@children]="isActive(i) ?
                'visible' : 'hidden'" [visible]="isActive(i)"></ul>
            </li>
        </ng-template>
    `, animations: [
        trigger('children', [
            state('hidden', style({
                height: '0px',
            })), state('visible', style({
                height: '*',
            })), transition('visible => hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
            transition('hidden => visible', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')),
        ]),
    ],
})
export class AppSubMenuComponent extends BaseComponent {

    @Input() item: AppMenuItem;

    @Input() isRoot: boolean;

    @Input() visible: boolean;

    activeIndex: number;

    hover: boolean;

    constructor(public injector: Injector) {
        super(injector);
    }

    itemClick(event: Event, item: AppMenuItem, index: number) {
        // avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        // activate current item and deactivate active sibling if any
        this.activeIndex = (this.activeIndex === index) ? null : index;

        // execute command
        if (item.command) {
            const routeLink: string[] = RouteUtils.getFullLinkByParent(this.route.snapshot);
            if (item.routerLink.toString() == routeLink.toString()) {
                return;
            }
            item.command({originalEvent: event, item: item});
        }

        // prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            event.preventDefault();
        }

        // hide menu
        if (!item.items && (this.root.overlay || !this.root.isDesktop())) {
            this.root.sidebarActive = false;
        }
    }

    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    unsubscribe(item: any) {
        if (item.eventEmitter) {
            item.eventEmitter.unsubscribe();
        }

        if (item.items) {
            for (const childItem of item.items) {
                this.unsubscribe(childItem);
            }
        }
    }
}

export class AppMenuItem implements MenuItem {
    label?: string;
    icon?: string;
    command?: (event?: any) => void;
    url?: string;
    routerLink?: any;
    queryParams?: {
        [k: string]: any;
    };
    items?: AppMenuItem[] | AppMenuItem[][];
    expanded?: boolean;
    disabled?: boolean;
    visible?: boolean;
    target?: string;
    routerLinkActiveOptions?: any;
    separator?: boolean;
    badge?: string;
    badgeStyleClass?: string;
    style?: any;
    styleClass?: string;
    title?: string;
    id?: string;
    hasPerm: string;
}
