import {Injector, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {AppComponent} from '../../app.component';
import {Subscription} from 'rxjs';
import {EventService, I18nProvider} from 'spase-ui';

import {PermissionService} from 'spase-ui';

export abstract class BaseComponent implements OnDestroy, OnInit {
    protected router: Router;
    protected route: ActivatedRoute;
    protected location: Location;
    protected eventService: EventService;
    public permSvc: PermissionService;
    public root: AppComponent;

    protected subscriptions: Array<Subscription> = [];
    public lang = '';

    protected constructor(protected injector: Injector) {
        this.route = this.injector.get(ActivatedRoute);
        this.router = this.injector.get(Router);
        this.root = this.injector.get(AppComponent);
        this.location = this.injector.get(Location);
        this.eventService = this.injector.get(EventService);
        this.permSvc = this.injector.get(PermissionService);

        this.localize();

        // i18nListeners.forEach( listener )
    }

    localize() {
        this.subscriptions.push(this.eventService.on('localize', res => {
            this.lang = I18nProvider.selected;
            this.reloadByLocalize();
        }));
    }

    ngOnInit() {
        this.onInit();
    }


    ngOnDestroy() {
        this.subscriptions.forEach(i => {
            if (i) {
                i.unsubscribe();
            }
        });
        this.onDestroy();
    }


    inject(a, b) {
        return this.injector.get(a, b);
    }

    onDestroy() {
    }

    onInit() {
    }

    init() {
    }

    reloadByLocalize() {
    }

}

