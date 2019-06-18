import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRouteSnapshot} from '@angular/router/src/router_state';
import {ServiceInterface} from './service.interface';
import {Resolve} from '@angular/router/src/interfaces';
import {Injector} from '@angular/core';
import {Base} from './base.model';

import {Page} from './page.model';

import {environment} from '../../../environments/environment';

import {PermissionService, EnhancedHttpClient} from 'spase-ui';

export abstract class BaseService<T extends Base> implements ServiceInterface, Resolve<T> {
    http: EnhancedHttpClient;
    permSvc: PermissionService;

    get fullPath() {
        return environment.GATEWAY_PATH + this.path;
    }

    abstract get path();

    constructor(protected injector: Injector) {
        this.http = injector.get(EnhancedHttpClient);
        this.permSvc = injector.get(PermissionService);
    }

    module(moduleName: string) {
        return new Proxy(this, {
            get(target, key, proxy) {
                if (key !== 'fullPath') {
                    return Reflect.get(target, key, proxy);
                }
                return environment.GATEWAY_PATH + '/' + moduleName + '/_' + target.path;
            },
        });
    }

    getPage(params?: any): Observable<Page<T>> {
        return this.http.getObject(this.fullPath, params).pipe(map(res => {
            return new Page(res['number'], res['size'], res['totalElements'], res['totalPages'],
                this.instances(res['content']));
        }));
    }

    get(id): Observable<T> {
        if (id === 'new') {
            return of(this.instance({}));
        }
        return this.http.get(this.fullPath + id).pipe(map(res => this.instance(res)));
    }

    getList(params?: any): Observable<T[]> {
        return this.http.get(this.fullPath, params).pipe(map(res => this.instances(res)));
    }

    getListDataFormat(result: any): any {
        return result;
    }

    create(object: T): Observable<T> {
        return this.http.post(this.fullPath, object).pipe(map(res => this.instance(res)));
    }

    update(object: T): Observable<T> {
        return this.http.put(this.fullPath + object.id, object).pipe(map(res => this.instance(res)));
    }

    delete(id) {
        return this.http.delete(this.fullPath + id);
    }


    getDefault() {
        return null;
    }

    getChildren(id: string, params?: any): Observable<Page<T>> {
        return null;
    }

    instance(o): T {
        console.error('base.service:instance must be overwritten!');
        return null;
    }

    instances(arr): T[] {
        return arr.map(i => this.instance(i));
    }

    getType() {
        return this.instance({}).constructor.name;
    }

    resolve(snapshot: ActivatedRouteSnapshot): Observable<T> {
        try {
            return this.get(snapshot.params['id']);
        } catch (e) {
        }
    }
}
