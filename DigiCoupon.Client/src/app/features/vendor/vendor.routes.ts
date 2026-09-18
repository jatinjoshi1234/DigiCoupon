import { Routes } from '@angular/router';
import { Configuration } from './configuration/configuration';
import { Overview } from './overview/overview';
import { VendorRegistration } from './vendor-registration/vendor-registration';

export default [
    { path: '', component: Overview },
    { path: 'details', component: VendorRegistration },
    { path: 'details/:id', component: VendorRegistration },
    { path: 'configuration', component: Configuration }
] as Routes;
