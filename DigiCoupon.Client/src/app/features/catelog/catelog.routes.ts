import { Routes } from '@angular/router';
import { Categories } from '../catelog/categories/categories';
import { Products } from './products/products';

export default [
    { path: 'categories', component: Categories },
    { path: 'Brands', component: Categories },
    { path: 'products', component: Products },
    { path: 'Units', component: Products }
] as Routes;
