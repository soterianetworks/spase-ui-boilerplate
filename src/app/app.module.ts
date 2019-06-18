import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {OAuthModule} from 'angular-oauth2-oidc';

import {LayoutModule} from './layout/layout.module';

import {AppComponent} from './app.component';
import {AppRootRoutes} from './app.routes';

import {MessageService} from 'primeng/api';
import {SpaseModule} from './spase.module';
import {SpaseConfig} from 'spase-ui';
import {ShowcaseSpaseConfig} from './showcase-spase-config';
import {I18nCommonModule} from './common/i18n/i18n-common.module';
import {WelcomeModule} from './module/welcome/welcome.module';

@NgModule({
    imports: [
        // angular & prime ng
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        // ButtonBarModule,

        // http & oauth2
        HttpClientModule,
        OAuthModule,

        // layout
        LayoutModule,

        I18nCommonModule,

        // spase
        ...SpaseModule,

        // sample view root route
        RouterModule.forRoot(AppRootRoutes),

        // sample view app module
        WelcomeModule,
    ],
    declarations: [
        AppComponent,
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: SpaseConfig, useClass: ShowcaseSpaseConfig},
        MessageService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
