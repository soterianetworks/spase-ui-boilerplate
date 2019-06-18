import {Observable} from 'rxjs';
import {Page} from './page.model';

export interface ServiceInterface {

    getPage(param?: any): Observable<Page<any>>;

    getList(param?: any): Observable<any[]>;

    get(id: String): Observable<any>;

    getDefault(): Observable<any>;

    create(object: any): Observable<any>;

    update(object: any): Observable<any>;

    delete(id: String);

    instance(o): any;

    getChildren(id: string, params?: any): Observable<Page<any>>;

    getListDataFormat(result: any): any;
}
