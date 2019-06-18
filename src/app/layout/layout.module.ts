import {APP_INITIALIZER, NgModule} from '@angular/core';
import {ExitComponent} from './exit/exit.component';
import {AppMenuComponent, AppSubMenuComponent} from './menu/app.menu.component';
import {AppSideBarComponent} from './sidebar/app.sidebar.component';
import {AppSideBarTabContentComponent} from './sidebar/app.sidebartabcontent.component';
import {AppTopBarComponent} from './topbar/app.topbar.component';
import {LayoutBootService} from './layout-boot.service';
import {AppLogoComponent} from './logo/app.logo.component';
import {SpaseModule} from '../spase.module';

@NgModule({
    imports: [
        ...SpaseModule,
    ],
    declarations: [
        ExitComponent,
        AppMenuComponent,
        AppSubMenuComponent,
        AppSideBarComponent,
        AppSideBarTabContentComponent,
        AppTopBarComponent,
        AppLogoComponent,
    ],
    exports: [
        AppSideBarComponent,
        AppTopBarComponent,
        AppLogoComponent,
    ],
    providers: [
        LayoutBootService,
        {
            provide: APP_INITIALIZER,
            useFactory: (bootService: LayoutBootService) => (() => bootService.init()),
            deps: [LayoutBootService],
            multi: true,
        },
    ],
})
export class LayoutModule {
}
