import {Base} from './base.model';

export class Page<T extends Base> {
    currentPage: number;
    data: T[];
    pageSize: number;
    totalElements: number;
    totalPages: number;

    constructor(currentPage: number, pageSize: number, totalElements: number, totalPages: number, data: T[]) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.data = data;
    }
}
