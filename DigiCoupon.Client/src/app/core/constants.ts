import { enviroment } from '@/enviroments/enviroment';

export const CACHE_KEY = {
    token: 'auth_token'
};

export const PAGE = {
    login: '/auth/login',
    dashboard: '/'
};

export const BASE_URL = `${enviroment.apiUrl}/api`;

export const URL = {
    register: 'auth/register',
    login: 'auth/login',
    parentCategory: 'category/parent',
    category: 'Category',
    vendor: 'Vendor'
};

export const PAGE_URL = {
    category: '/pages/Category',
    vendor: '/pages/vendor',
    vendorDetails: '/pages/vendor/details'
};
