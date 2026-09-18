export interface ApiResponse {
    status: boolean;
    message: string;
    data: any;
}

export interface PaginationRequest {
    PageNumber: number;
    PageSize: number;
    Search: string;
    OrderBy: string;
    SortOrder: string;
}
