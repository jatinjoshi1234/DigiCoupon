import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BASE_URL } from '../../constants';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../models/api-response-model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    http = inject(HttpClient);

    baseUrl = BASE_URL;

    post(endpoints: string, body: any): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.baseUrl}/${endpoints}`, body);
    }

    get<T>(endpoints: string, options?: { params: HttpParams | Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>; headers?: HttpHeaders }): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/${endpoints}`, options);
    }

    put(endpoints: string, body: any): Observable<ApiResponse> {
        return this.http.put<ApiResponse>(`${this.baseUrl}/${endpoints}`, body);
    }

    delete(endpoints: string): Observable<ApiResponse> {
        return this.http.delete<ApiResponse>(`${this.baseUrl}/${endpoints}`);
    }
}
