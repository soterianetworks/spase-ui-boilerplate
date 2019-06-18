import {Injectable} from '@angular/core';

import {WelcomeI18nService} from './i18n/welcome-i18n.service';

@Injectable()
export class WelcomeBootService {
    constructor(protected i18nService: WelcomeI18nService) {
    }

    init() {
        this.registerI18n();
    }

    private registerI18n(): void {
        this.i18nService.init();
    }
}
