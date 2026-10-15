export interface ApiResponse {
  code: number;
  status: boolean;
  message: string;
  data: any;
}

export interface PaginationRequest {
  Page: number;
  PageSize: number;
  Search?: string;
  Data: number;
}

export interface PaginationResponse<T> {
  items: Array<T>;
  page: number;
  pageSize: number;
  totalRecords: number;
}
