import {Injectable} from '@angular/core';

import {AppMenuRegistry} from './menu/app.menu.registry';

@Injectable()
export class LayoutBootService {
    init() {
        AppMenuRegistry.init();
    }
}
