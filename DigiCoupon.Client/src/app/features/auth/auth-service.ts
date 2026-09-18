import { CACHE_KEY, PAGE, URL } from '@/app/core/constants';
import { ApiResponse } from '@/app/core/models/api-response-model';
import { ApiService } from '@/app/core/services/api/api-service';
import { CacheService } from '@/app/core/services/cache-service';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, firstValueFrom, map, Observable, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    //toastService = inject(MessageService);
    apiService = inject(ApiService);
    storage = inject(CacheService);
    router = inject(Router);
    currentUser = signal<any>({});
    register(data: any) {
        return this.apiService.post(URL.register, data);
        //subscribe({
        // next: (res) => {
        //     if (res.status) {
        //         this.toastService.add({
        //             severity: 'success',
        //             detail: 'User Registration',
        //             summary: 'User Registerd successfully.'
        //         });
        //     }
        //     return res;
        // },
        // error: (error) => {
        //     this.toastService.add({
        //         severity: 'error',
        //         detail: 'error',
        //         summary: 'Something went wrong. please try again!'
        //     });
        // }
        //});
    }

    login(data: any) {
        console.log('login post data => ', data);
        return this.apiService.post(URL.login, data).pipe(
            tap((res: ApiResponse) => {
                if (res.status) {
                    this.storage.set(CACHE_KEY.token, res.data);
                    return res;
                }
                return res;
            })
        );
    }

    getUser() {
        const token = this.storage.get(CACHE_KEY.token);
        if (token) {
            let user = JSON.parse(atob(token.split('.')[1]));
            const currUser = {
                email: user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                name: user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                id: user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
            };
            this.currentUser.set(currUser);
        }
        return undefined;
    }
}
