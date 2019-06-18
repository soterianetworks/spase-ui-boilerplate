import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import * as _ from 'lodash';
import {ProfileService, I18nProvider} from 'spase-ui';
import {AppComponent} from '../../app.component';
import {EventService} from 'spase-ui';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.css'],
})
export class AppTopBarComponent implements OnDestroy, OnInit {
    showProfileMenu = false;

    lang: string;

    message = {
        unreadCounter: 0,
        unreadMessages: [],
    };

    notify: number = 0;

    router: Router;
    profileService: ProfileService;
    root: AppComponent;
    eventService: EventService;

    protected subscriptions: Array<Subscription> = [];

    constructor(protected injector: Injector, protected authnService: OAuthService) {
        this.router = this.injector.get(Router);
        this.root = this.injector.get(AppComponent);
        this.profileService = injector.get(ProfileService);
        this.eventService = this.injector.get(EventService);
    }

    ngOnInit() {
        this.checkCurrentBenity();
        this.messageListener();
        this.lang = sessionStorage.getItem('localizeLang');
    }

    ngOnDestroy() {
        this.subscriptions.forEach(i => {
            if (i) {
                i.unsubscribe();
            }
        });
    }

    private messageListener(): void {
        this.eventService.on('message-init', data => {
            if (data && data.unread && data.messages) {
                this.message.unreadCounter = data.unread;
                if (data.messages.length > 5) {
                    this.message.unreadMessages = this.message.unreadMessages.slice(0, 5);
                } else {
                    this.message.unreadMessages = data.messages;
                }
            }
        });

        this.eventService.on('message-in', data => {
            if (data && data.unread) {
                this.message.unreadCounter = data.unread;

                if (this.message.unreadMessages.length == 5) {
                    this.message.unreadMessages.pop();
                }

                this.message.unreadMessages.unshift(data.message);
            }
        });

        this.eventService.on('message-read', data => {
            if (data) {
                this.message.unreadMessages = _.reject(this.message.unreadMessages, {id: data.id});
                this.message.unreadCounter--;
            }
        });
    }

    exchangeCurrentBenity(benity) {
        if (benity.isCurrentBenity) {
            return;
        }
        this.root.dialog.open(res => {
            this.profileService.exchangeCurrentBenity(benity.id).subscribe(res => {
                this.root.user = res;
                this.checkCurrentBenity();
                this.root.dialog.close();
                this.router.navigate(['/messages']);
            }, err => {
                this.root.dialog.close();
            });
        }, {
            headerName: 'confirm',
            confirmMsg: I18nProvider.get('exchangeCurrentBenityConfirmMsg') + '「' + I18nProvider.get(
                benity.name) + '」' + I18nProvider.get('homeJumpPrompt'),
            confirmLabName: 'confirm',
            closeLabName: 'cancel',
        });
    }

    updateNotify() {
        this.notify = 0;
    }

    onLogout() {
        // this.authnService.logOut(false);
        sessionStorage.removeItem('access_token_stored_at');
        sessionStorage.removeItem('access_token');
        window.location.href = environment.CIP_HOST;
    }

    toMessage() {
        this.router.navigate(['/messages']);
    }

    private checkCurrentBenity() {
        if (this.root.user && this.root.user.benities) {
            this.root.user.benities.forEach(res => res.isCurrentBenity = res.id === this.root.user.currentBenity.id);
        }
    }

    toggleLang(event) {
        if (this.lang == 'en_US') {
            this.lang = 'zh_CN';
        } else if (this.lang == 'zh_CN') {
            this.lang = 'en_US';
        } else {
            this.lang = 'zh_CN';
        }
        sessionStorage.setItem('localizeLang', this.lang);
        I18nProvider.locale(this.lang);
        this.eventService.broadcast('localize');
        event.preventDefault();
    }
}
