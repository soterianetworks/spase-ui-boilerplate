import {Component, Injector} from '@angular/core';

import {environment} from '../../../environments/environment';
import {BaseComponent} from '../../module/common/base.component';

@Component({
    selector: 'app-logo',
    templateUrl: './app.logo.component.html',
    styleUrls: ['./app.logo.component.css'],
})
export class AppLogoComponent extends BaseComponent {
    constructor(protected injector: Injector) {
        super(injector);
    }

    getLogoStyle() {
        let logoFileName = 'soteria.png';
        return {'background-image': 'url(../../../assets/images/logo/' + logoFileName + ')'};
    }
}
