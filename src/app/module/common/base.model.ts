export class Base {
    id: string;
    name: string;

    createdBy: string;
    createdByUser: string;
    createdDate: string;
    lastModifiedBy: string;
    lastModifiedByUser: string;
    lastModifiedDate: string;
    versionNumber: string;
    sourceApp: string;
    private _source: string;

    constructor(obj?: any) {
        if (obj) {
            Object.assign(this, obj);
        }
        if (obj && !obj.id) {
            this.init();
        } else {
            this.initFromEdit();
        }
    }

    init() {
    }

    initFromEdit() {
    }

    static newInstance<T extends Base>(obj?: any) {
        return new this(obj) as T;
    }

    static fromObject<T extends Base>(values: Object = {}) {
        const newObj = new this() as T;
        return Object.assign(newObj, values);
    }

    static fromArray(array) {
        return array.map(i => Base.fromObject(i));
    }

    static instance<T extends Base>(values): T {
        return this.fromObject(values);
    }

    static instances<T extends Base>(array): T[] {
        return this.fromArray(array);
    }

    get displayName() {
        return this.name;
    }

    get source(): string {
        return this._source ? this._source.toUpperCase() : null;
    }

    set source(value: string) {
        this._source = value;
    }
}
