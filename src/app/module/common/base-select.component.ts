import {EventEmitter, Injector, Input, Output} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

import {BaseComponent} from './base.component';

import {I18nProvider, StyleParams, SmartSelectComponent} from 'spase-ui';

export abstract class BaseSelectComponent extends BaseComponent implements ControlValueAccessor {
    @Input() moduleName: string;
    @Input() viewSelectKey: string;
    @Input() viewDisplayKey: string;
    @Input() viewIsMultiple = false;
    @Input() viewInitialLabel: string;
    @Input() styleParams: StyleParams;
    @Input() disabled: boolean;
    @Input() defaultLabel: string;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    public value: any;

    i18nProvider = I18nProvider;

    smartSelect: SmartSelectComponent;

    protected constructor(protected injector: Injector) {
        super(injector);
        if (!this.viewSelectKey) {
            this.viewSelectKey = this.getDefaultSelectKey();
        }
        if (!this.viewDisplayKey) {
            this.viewDisplayKey = this.getDefaultDisplayKey();
        }
    }

    abstract getDefaultSelectKey(): string;

    abstract getDefaultDisplayKey(): string;

    public onModelChange: Function = () => {
    };

    public onModelTouched: Function = () => {
    };

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean): void {
        this.disabled = val;
    }

    setSmartSelect(value) {
        this.smartSelect = value;
    }

    // 对外暴露的方法 start
    public clearDataSource() {
        this.smartSelect.dataSource = null;
        this.smartSelect.isLoaded = false;

        this.smartSelect.updateLabel();
    }

    public clearModel() {
        this.smartSelect.value = null;
        this.smartSelect.currentSelectedOption = null;
        this.smartSelect.selectedOptionList = [];

        this.smartSelect.updateLabel();
    }

    public hidePanel() {
        this.smartSelect.hide();
    }

    public updateInputLabel(label: string) {
        this.smartSelect.valuesAsString = label;
    }

    // 对外暴露的方法 end
}
