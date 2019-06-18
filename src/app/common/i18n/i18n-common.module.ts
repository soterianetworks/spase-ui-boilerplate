import {APP_INITIALIZER, NgModule} from '@angular/core';
import {I18nCommonService} from './i18n-common.service';
import {I18nCommonBootService} from './i18n-common-boot.service';

@NgModule({
    exports: [],
    providers: [
        I18nCommonService,
        I18nCommonBootService,
        {
            provide: APP_INITIALIZER,
            useFactory: (service: I18nCommonService) => (() => service.init()),
            deps: [I18nCommonBootService],
            multi: true,
        },
    ],
})
export class I18nCommonModule {
}
