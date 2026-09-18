import { inject, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    set(key: string, obj: any) {
        localStorage.setItem(key, obj);
    }

    get(key: string) {
        return localStorage.getItem(key);
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    clear(key: string) {
        localStorage.clear();
    }
}
