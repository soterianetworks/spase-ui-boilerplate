import {Injector, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import * as _ from 'lodash';
import {BaseComponent} from './base.component';
import {Base} from './base.model';
import {ServiceInterface} from './service.interface';

import {I18nProvider} from 'spase-ui';

export abstract class BaseDetailsComponent<T extends Base> extends BaseComponent {
    protected user: any;
    public object: T;
    public type: string;

    public id: string;

    isCreate = false;
    isEdit = false;
    // 是否为只读页面
    isAccessByView = false;

    public readonly = false;

    public showMenu = true;

    public showDetail = false;

    public showRouteOutlet = false;

    @ViewChild('theForm') theForm: NgForm;

    protected route: ActivatedRoute;

    protected constructor(protected service: ServiceInterface, protected injector: Injector) {
        super(injector);
    }

    onInit() {
        if (_.isEmpty(this.route.snapshot.children)) {
            this.showDetail = true;
        } else {
            this.showRouteOutlet = true;
        }
        this.id = this.route.snapshot.data['id'];
        this.isAccessByView = this.route.snapshot.data['isAccessByView'];

        this.isEdit = this.id && this.id !== 'new';
        this.isCreate = !this.isEdit;
        this.user = {};

        if (this.isEdit) {
            if (!this.route.snapshot.data['object']) {
                this.service.get(this.id).subscribe(res => {
                    this.object = res;
                    this.route.snapshot.data['object'] = this.object;
                    this.type = this.object.constructor.name.toLowerCase();
                    this.init();
                });
            } else {
                this.object = this.route.snapshot.data['object'];
                this.type = this.object.constructor.name.toLowerCase();
                this.init();
            }
        } else {
            this.init();
        }

        if (this.readonly) {
            setTimeout(() => {
                this.theForm.form.disable();
            }, 1);
        }

        this.subscriptions.push(this.route.url.subscribe(() => {
            if (_.isEmpty(this.route.children)) {
                this.showDetail = true;
            }
        }));
    }

    init() {
    }

    delete() {
        this.root.dialog.open(res => {
            this.root.loading = true;
            this.service.delete(this.object.id).subscribe(() => {
                this.root.loading = false;
                this.root.dialog.close();
                this.root.showSuccess(I18nProvider.get('successDelete'));
                this.router.navigate(['../'], {relativeTo: this.route});
            }, err => {
                console.error(err);
                this.root.loading = false;
                this.root.dialog.close();
            });
        }, {
            headerName: 'confirm',
            confirmLabName: 'confirm',
            confirmMsg: 'deleteConfirmMsg',
            closeLabName: 'cancel',
        });
    }

    save(func?: any) {
        if (this.theForm.form.invalid) {
            return;
        }
        this.root.loading = true;
        this.getServiceCall(this.object).subscribe(res => {
            this.isEdit = true;
            this.isCreate = false;

            this.route.snapshot.data['object'] = this.service.instance(res);
            this.object = this.service.instance(res);
            this.root.showSuccess();

            this.navigateToUpdatedUrl(res.id);

            this.root.loading = false;
            this.root.createBreadcrumb();

            this.theForm.form.markAsPristine();

            // TODO change observable
            if (func) {
                func.call(this, this.object);
            }
        }, err => {
            this.root.loading = false;
        });
    }

    getServiceCall(obj) {
        return this.isCreate ? this.service.create(obj) : this.service.update(obj);
    }

    navigateToUpdatedUrl(id: string) {
        this.router.navigate(this.getUpdatedUrl(id));
    }

    getUpdatedUrl(id: string): string[] {
        const urls: string[] = [];
        this.route.snapshot.pathFromRoot.forEach(path => {
            path.url.forEach(url => {
                if (url.path === 'new') {
                    urls.push(id);
                } else {
                    urls.push(url.path);
                }
            });
        });
        return urls;
    }

    back() {
        if (this.isAccessByView) {
            window.history.go(-1);
        } else {
            this.router.navigate(['../'], {relativeTo: this.route});
        }
    }

    onDestroy() {

    }
}
