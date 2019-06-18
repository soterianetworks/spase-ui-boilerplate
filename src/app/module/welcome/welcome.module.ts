import {APP_INITIALIZER, NgModule} from '@angular/core';

import {SpaseModule} from '../../spase.module';

import {WelcomeI18nService} from './i18n/welcome-i18n.service';
import {WelcomeRoutingModule} from './welcome-routing.module';
import {WelcomeBootService} from './welcome-boot.service';
import {WelcomeComponent} from './detail/detail.component';

@NgModule({
    imports: [
        ...SpaseModule,

        WelcomeRoutingModule,
    ],
    declarations: [
        WelcomeComponent,
    ],
    providers: [
        WelcomeI18nService,
        WelcomeBootService,
        {
            provide: APP_INITIALIZER,
            useFactory: (service: WelcomeBootService) => (() => service.init()),
            deps: [WelcomeBootService],
            multi: true,
        },
    ],
})
export class WelcomeModule {
}
