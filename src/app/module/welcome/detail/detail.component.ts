import {Component, Injector} from '@angular/core';

import {BaseComponent} from '../../common/base.component';

@Component({
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css'],
})
export class WelcomeComponent extends BaseComponent {
    constructor(protected injector: Injector) {
        super(injector);
    }
}

