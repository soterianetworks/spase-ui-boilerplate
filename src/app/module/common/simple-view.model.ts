export class SimpleViewModel {
    private _id: string;
    private _name: string;
    private _code: string;
    private _source: string;

    constructor(id: string, name: string, code: string, source: string) {
        this._id = id;
        this._name = name;
        this._code = code;
        this._source = source;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get source(): string {
        return this._source;
    }

    set source(value: string) {
        this._source = value;
    }
}
