import {Injector} from '@angular/core';
import {ServiceInterface} from './service.interface';
import {ActivatedRoute} from '@angular/router';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';
import {SortEvent} from 'primeng/api';

import {BaseComponent} from './base.component';

import {AppComponent} from '../../app.component';
import {EventService, I18nProvider} from 'spase-ui';
import {SortModel, SortType} from './sort.model';

export abstract class BasePageComponent extends BaseComponent {
    public root: AppComponent;
    protected route: ActivatedRoute;
    protected eventService: EventService;
    public isDrilldown = false;

    loading = true;
    list = [];
    searchParams = {};
    advancedQueryParams = {};
    paging = {page: 0, size: 20, totalElements: 0, totalPages: 0};
    params: any;

    constructor(protected service: ServiceInterface, protected injector: Injector, public parent?: any) {
        super(injector);
        this.isDrilldown = parent ? true : false;

        this.subscriptions.push(this.eventService.on('factoryUpdate', res => {
            this.getList(this.searchParams);
        }));

    }

    onInit() {
        this.init();
        let searchParams = this.initSearchParams();
        if (!searchParams) {
            searchParams = {};
        }
        _.merge(searchParams, this.getSort().value);
        this.getList(searchParams);
    }

    init() {

    }

    onDestroy() {
    }

    reloadByLocalize() {
    }

    initSearchParams(): any {
        return {};
    }

    getSort(): SortModel {
        return new SortModel('code', SortType.ASC);
    }


    sort(event: SortEvent) {
        if (event.field != null) {
            this.getList({sortBy: event.field, sortDirection: event.order === 1 ? 'ASC' : 'DESC'});
        }
    }

    /**
     * 跳转到只读页面
     * @param id
     */
    showReadonly(id: string) {
        this.router.navigate([id, 'readonly'], {relativeTo: this.route});
    }

    getList(searchParams?: any, test?: any): Subscription {
        this.loading = true;

        const newParams = this.buildSearchParams(searchParams, test);

        return this.callListService(newParams).subscribe(res => {
                this.list = this.service.getListDataFormat(res.data);
                this.list = this.listCallBack(this.list);
                this.paging.totalElements = res.totalElements;
                this.loading = false;
                this.paging.totalPages = res.totalPages;
            },
            err => {
                this.list = [];
                this.loading = false;
            });
    }

    buildSearchParams(searchParams?: any, test?: any): any {
        _.merge(this.searchParams, searchParams);
        let newParams = {};
        _.merge(newParams, this.searchParams, this.advancedQueryParams,
            {page: this.paging.page, size: this.paging.size});

        if (newParams) Object.keys(newParams)
            .forEach(v => {
                if (newParams[v] !== false && !newParams[v]) delete newParams[v];
            });

        // dynamic params override by route call
        if (this.route.snapshot.data.overrideParams) {
            newParams = _.merge(newParams, this.route.snapshot.data.overrideParams(this));
        }
        // Delete null
        newParams = _.omitBy(newParams, (item) => _.isEmpty(_.toString(item)));

        newParams = this.formatSearchParams(newParams);

        return newParams;
    }

    formatSearchParams(searchParams: any) {
        return searchParams;
    }

    listCallBack(list) {
        return list;
    }

    callListService(newParams) {
        return this.service.getPage(newParams);
    }

    delete(id) {
        this.root.dialog.open(res => {
            this.loading = true;
            this.service.delete(id).subscribe(res => {
                    // _.remove(this.list, i=>i.id==id);
                    this.getList();
                    this.root.showSuccess(I18nProvider.get('successDelete'));
                    //  this.loading = false;
                    this.root.dialog.close();
                },
                err => {
                    this.loading = false;
                    this.root.dialog.close();
                });
        }, {headerName: 'confirm', confirmLabName: 'confirm', confirmMsg: 'deleteConfirmMsg', closeLabName: 'cancel'});
    }

    _paginate(event) {
        this.paging.size = event.rows;
        this.paging.page = event.page;
        this.getList();
    }

    viewDialog: any = {
        display: false, data: null,
        open() {
            this.display = true;
        },

        close() {
            this.display = false;
        },

    };

    closeView() {
        this.router.navigate([{outlets: {viewOutlet: null}}], {relativeTo: this.route});
        this.viewDialog.close();
    }

    openView(id) {
        this.router.navigate([{outlets: {viewOutlet: null}}], {relativeTo: this.route});
        this.router.navigate([{outlets: {viewOutlet: ['view', id]}}],
            {relativeTo: this.route, skipLocationChange: true});
        this.viewDialog.open();
    }

    formatViewData(data) {
        return data;
    }

    custom() {
    }

    exportCsv(columns, searchParams?: any, test?: any) {
        this.loading = true;
        let _searchParams = this.buildSearchParams(searchParams, test);
        _searchParams.page = 0;
        _searchParams.size = 200;
        return this.callListService(_searchParams).subscribe(res => {
                let body = this.buildCsv(res.data, columns);
                let uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(body.join('\n'));
                let downloadLink = document.createElement('a');
                downloadLink.href = uri;
                downloadLink.download = 'export.csv';
                try {
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                } finally {
                    document.body.removeChild(downloadLink);
                    this.loading = false;
                }
            },
            err => {
                this.list = [];
                this.loading = false;
            });

    }

    buildCsv(data, properties) {
        let result = [];
        let header = [];
        for (var pk in properties) {
            header.push(properties[pk]);
        }
        result.push(header.join(','));

        data.forEach(item => {
            let row = [];
            for (var pk in properties) {
                row.push(item[pk]);
            }
            result.push(row.join(','));
        });

        return result;
    }

}
