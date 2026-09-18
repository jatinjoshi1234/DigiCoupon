import { URL } from '@/app/core/constants';
import { ApiResponse, PaginationRequest } from '@/app/core/models/api-response-model';
import { ApiService } from '@/app/core/services/api/api-service';
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface VendorConfigure {
    id: string | any;
    name: string;
    type: number;
}

export interface VendorDto {
    id: string;
    businessName: string;
    gstNumber: string;
    panNumber: string;
    tinNumber: string;
    vendorName: string;
    businessEmail: string;
    businessPhone: string;
    website: string;
    logo: string;
    banner: string;
    description: string;
    status: string;
    cinNumber: string;
    tanNumber: string;
    fssaiNumber: string;
    licenseNumber: string;
    vendorType: string;
    type: string;
    category: string;
    buisnessCategory: string;
    bankAccountNo: string;
    ifsc: string;
    accountHolder: string;
    termCondition: string;
    file: string;
    identityPic: string;
    approvalDate: string;
    address: VendorAddress;
}

export interface VendorAddress {
    id: string;
    addressType: string;
    country: string;
    state: string;
    city: string;
    area: string;
    pincode: string;
    addressLine1: string;
    addressLine2: string;
    isDefault: boolean;
}

export interface PageData {
    data: VendorDto[];
    totalRecords: number;
}

@Injectable({
    providedIn: 'root'
})
export class VenderService {
    apiService = inject(ApiService);
    url = URL.vendor;
    configUrl: string = `${URL.vendor}/config`;

    get(page: PaginationRequest) {
        const params = new HttpParams({
            fromObject: page as any
        });
        return this.apiService.get<PageData>(this.url, { params });
    }

    getById(id: string) {
        return this.apiService.get<ApiResponse>(`${this.url}/${id}`);
    }

    post(data: any) {
        return this.apiService.post(this.url, data);
    }
    delete(id: any) {
        return this.apiService.delete(`${this.url}/${id}`);
    }

    updateVendorImage(data: any) {
        return this.apiService.put(`${this.url}/image`, data);
    }

    postVendorConfig(data: any) {
        return this.apiService.post(this.configUrl, data);
    }

    deleteVendorConfig(id: any) {
        return this.apiService.delete(`${this.configUrl}/${id}`);
    }

    putVendorConfig(id: any, data: any) {
        return this.apiService.put(`${this.configUrl}/${id}`, data);
    }

    getVendorConfig() {
        return this.apiService.get<ApiResponse>(`${this.configUrl}`);
    }

    searchVendorType(search: string, type: number) {
        const url = search !== undefined && search !== '' ? `${this.url}/search-config/${search}/${type}` : `${this.url}/search-config/${type}`;
        return this.apiService.get<ApiResponse>(url);
    }

    // mapUser(data: any): Category {
    //     return {
    //         name: data.text,
    //         code: data.id
    //     };
    // }
}
