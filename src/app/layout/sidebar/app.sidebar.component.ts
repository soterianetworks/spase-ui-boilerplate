import {Component, Injector} from '@angular/core';
import {AppComponent} from '../../app.component';
import {BaseComponent} from '../../module/common/base.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
    styleUrls: ['./app.sidebar.component.css'],
})
export class AppSideBarComponent extends BaseComponent {

    app: AppComponent;

    sidebarModel: SidebarModel = new SidebarModel();

    constructor(public injector: Injector) {
        super(injector);
        this.app = this.root;
        this.app.activeTabIndex = 0;
        this.app.sidebarActive = true;
    }

    onInit() {
        this.sidebarModel.push('features', 'features', 'fa fa-list');
    }

    onTabMouseOver(sidebar: SidebarItem) {
        sidebar.mouseOver = true;
    }

    onTabMouseOut(sidebar: SidebarItem) {
        sidebar.mouseOver = false;
    }

}

export class SidebarModel {
    private _items: SidebarItem[] = [];

    push(key: string, title: string, iconClass: string) {
        if (this._items.length == 0 || this._items.findIndex(item => item.key == key) === -1) {
            this._items.push(new SidebarItem(key, title, iconClass));
        } else {
            console.error(`sidebar key '${key}' already exist`);
        }
    }

    get items(): SidebarItem[] {
        return this._items;
    }
}

class SidebarItem {
    key: string;
    title: string;
    iconClass: string;
    mouseOver: boolean;

    constructor(key: string, title: string, iconClass: string) {
        this.key = key;
        this.title = title;
        this.iconClass = iconClass;
    }
}
