import {Injectable} from '@angular/core';
import {I18nCommonService} from './i18n-common.service';

@Injectable()
export class I18nCommonBootService {
    constructor(protected i18nService: I18nCommonService) {
    }

    init() {
        this.registerI18n();
    }

    private registerI18n(): void {
        this.i18nService.init();
    }
}
