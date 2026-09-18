import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Catalog',
                icon: 'pi pi-fw pi-briefcase',
                path: '/catalog',
                items: [
                    {
                        label: 'Products',
                        icon: 'pi pi-shopping-bag',
                        routerLink: ['/catelog/products']
                    },
                    {
                        label: 'Categories',
                        icon: 'pi pi-folder',
                        routerLink: ['/catelog/categories']
                    },
                    {
                        label: 'Brands',
                        icon: 'pi pi-folder',
                        routerLink: ['/catelog/brands']
                    }
                ]
            },
            {
                label: 'Vendor',
                icon: 'pi pi-box',
                path: '/vendor',
                items: [
                    {
                        path: '',
                        redirectTo: 'overview',
                        patchMatch: 'full'
                    },
                    {
                        label: 'Vendor',
                        icon: 'pi pi-shopping-bag',
                        routerLink: ['/vendor'],
                        activeRoutes: ['/vendor/overview', '/vendor/details']
                    },
                    {
                        label: 'Configuration',
                        icon: 'pi pi-folder',
                        routerLink: ['/vendor/configuration']
                    }
                ]
            }
        ];
    }
}
