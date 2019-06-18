import {Injectable} from '@angular/core';
import {I18nBaseProvider} from 'spase-ui';

declare var require: any;

@Injectable()
export class WelcomeI18nService extends I18nBaseProvider {

    getProviderName(): string {
        return 'welcome';
    }

    getEnUs(): any {
        return require('./i18n_en_US.json');
    }

    getZhCn(): any {
        return require('./i18n_zh_CN.json');
    }

}
