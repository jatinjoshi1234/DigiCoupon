import { URL } from '@/app/core/constants';
import { ApiResponse, PaginationRequest } from '@/app/core/models/api-response-model';
import { ApiService } from '@/app/core/services/api/api-service';
import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Category } from './categories';
import { HttpParams } from '@angular/common/http';

export interface CategoriesDto {
    id: string | any;
    parentId: string | any;
    name: string;
    slug: string;
    parentName: string;
}

export interface PageData {
    data: CategoriesDto[];
    totalRecords: number;
}

export interface ParentCategory {
    id: string;
    text: string;
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    apiService = inject(ApiService);
    url = URL.category;
    getParentCategory() {
        return this.apiService.get<ParentCategory[]>(URL.parentCategory);
    }

    get(page: PaginationRequest) {
        const params = new HttpParams({
            fromObject: page as any
        });
        return this.apiService.get<PageData>(this.url, { params });
    }

    post(data: any) {
        return this.apiService.post(this.url, data);
    }

    delete(id: any) {
        return this.apiService.delete(`${this.url}/${id}`);
    }

    mapUser(data: any): Category {
        return {
            name: data.text,
            code: data.id
        };
    }
}
