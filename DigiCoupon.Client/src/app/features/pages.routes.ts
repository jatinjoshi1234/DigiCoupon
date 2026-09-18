import { Routes } from '@angular/router';
import { Categories } from './catelog/categories/categories';
import { VendorRegistration } from './vendor/vendor-registration/vendor-registration';
import { Overview } from './vendor/overview/overview';
import { Configuration } from './vendor/configuration/configuration';

export default [
    { path: 'vendor', component: Overview },
    { path: 'vendor/details', component: VendorRegistration },
    { path: 'vendor/details/:id', component: VendorRegistration },
    { path: 'vendor/configuration', component: Configuration }
] as Routes;
