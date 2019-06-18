import {ExitComponent} from './layout/exit/exit.component';

export let AppRootRoutes: any = [
    {path: '', redirectTo: 'welcome', pathMatch: 'full'},
    {path: 'exit', component: ExitComponent},
];
