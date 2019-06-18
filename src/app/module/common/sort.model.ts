export class SortModel {

    private readonly _value: {};

    constructor(sortBy: string, sortType: SortType) {
        this._value = {
            sortBy: sortBy,
            sortDirection: SortType[sortType],
        };
    }

    get value(): {} {
        return this._value;
    }
}

export enum SortType {
    ASC,
    DESC
}
