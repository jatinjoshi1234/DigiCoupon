import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login/login';
import { Error } from './error';
import { Register } from './register/register';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'register', component: Register },
    { path: 'login', component: Login }
] as Routes;
