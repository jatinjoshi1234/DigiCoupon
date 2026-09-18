import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/features/dashboard/dashboard';
import { Landing } from './app/features/landing/landing';
import { Notfound } from './app/features/notfound/notfound';
import { authGuard } from './app/core/guard/auth-guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                component: Dashboard,
                canActivate: [authGuard]
            },
            {
                path: 'catelog',
                canActivate: [authGuard],
                loadChildren: () => import('./app/features/catelog/catelog.routes')
            },
            {
                path: 'vendor',
                canActivate: [authGuard],
                loadChildren: () => import('./app/features/vendor/vendor.routes')
            }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/features/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
