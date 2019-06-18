import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {WelcomeComponent} from './detail/detail.component';

export const spRoutes: any = [
    {
        path: 'welcome',
        component: WelcomeComponent,
        data: {breadcrumbs: [{value: 'Welcome', i18n: 'welcome'}]},
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(spRoutes),
    ],
    exports: [
        RouterModule,
    ],
})
export class WelcomeRoutingModule {
}
