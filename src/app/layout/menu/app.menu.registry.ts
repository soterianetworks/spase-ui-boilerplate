export class AppMenuRegistry {

    private static _menus: any[] = [];

    static registerMenu(category: string, index: number, menuItem: Menu) {
        if (this._menus.length === 0 || this._menus.findIndex(model => model.menuKey === menuItem.menuKey) === -1) {
            this._menus.push({...menuItem, sidebarKey: category, index: index});
        } else {
            console.error(`menu key '${menuItem.menuKey}' already exist`);
        }
    }

    static registerSubMenu(category: string, parent: string, subIndex: number, menuItem: Menu) {
        if (this._menus.length === 0 || this._menus.findIndex(model => model.menuKey === menuItem.menuKey) === -1) {
            this._menus.push({...menuItem, sidebarKey: category, parentKey: parent, index: subIndex});
        } else {
            console.error(`menu key '${menuItem.menuKey}' already exist`);
        }
    }

    static get menus(): any[] {
        return this._menus;
    }

    static init() {
        AppMenuRegistry.registerMenu('features', 100,
            new Menu('welcome', 'Welcome',
                'fa fa-fw fa-tachometer-alt-slow', ['/welcome']));
    }
}

export class Menu {
    index: number;
    parentKey: string;
    menuKey: string;
    label: string;
    icon: string;
    routerLink: string[];
    hasScope: string;
    items: Menu[];
    i18nProviderName: string;

    constructor(menuKey: string,
                label: string,
                icon: string,
                routerLink: string[],
                hasScope?: string,
                i18nProviderName?: string) {
        this.menuKey = menuKey;
        this.label = label;
        this.icon = icon;
        this.routerLink = routerLink;
        this.hasScope = hasScope;
        this.i18nProviderName = i18nProviderName;
    }
}


