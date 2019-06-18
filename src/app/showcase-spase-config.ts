import {SpaseConfig} from 'spase-ui';
import {environment} from '../environments/environment';

export class ShowcaseSpaseConfig extends SpaseConfig {

    getCipHost(): string {
        return environment.CIP_HOST;
    }

    getClientId(): string {
        return environment.CLIENT_ID;
    }

    getLang(): string {
        return 'zh_CN';
    }

    getScope(): string {
        return environment.SCOPE;
    }

    getI18nBasePath(): string {
        return '';
    }
}
