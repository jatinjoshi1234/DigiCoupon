import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CacheService } from '../services/cache-service';
import { CACHE_KEY, PAGE } from '../constants';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const cacheService = inject(CacheService);
    const token: any = cacheService.get(CACHE_KEY.token);
    return token ? true : router.createUrlTree([PAGE.login]);
};
