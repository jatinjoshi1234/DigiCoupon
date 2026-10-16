// services/customer.service.ts

import { Fetch, GetRequest } from "@/lib/api";
import {
  ApiResponse,
  PaginationRequest,
  PaginationResponse,
} from "../type/api-response";
import { SelectList } from "../type/select-list";

export interface CustomerRequest {
  id: number;
  restaurantId: number;
  restaurantBranchId?: number;
  memberCode?: string;
  firstName: string;
  lastName: string;
  nickName: string;
  mobile: string;
}

export interface Customer {
  customerId: number;
  name: string;
  nickName?: string | null;
  mobile: string;
  isActive: boolean;
  passId?: number;
  total: number;
  passType: number;
  totalPass: number;
  couponNo?: number;
  publicToken: string;
  usage: number;
  remaining: number;
  FromDate: string;
  ToDate: string;
  Price: string;
}

const customer = "/customer";

export async function getCustomers(restuarantId: number): Promise<SelectList[]> {
  const result = await Fetch(`${customer}/all/${restuarantId}`);
  console.log("customer service => res => ", result);
  return result.data;
}

export async function getPagedData(
  payload: PaginationRequest,
): Promise<PaginationResponse<Customer>> {
  const result = await GetRequest<PaginationResponse<Customer>>(
    `${customer}/paged_data`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return result;
}

export async function getCustomerById(id: number): Promise<CustomerRequest> {
  const result = await Fetch(`${customer}/${id}`, {
    method: "GET",
    body: undefined,
  });
  console.log("service result => ", result);
  return result.data;
}

export async function getReportData(id: number): Promise<any> {
  const result = await Fetch(`${customer}/statictics/${id}`);
  return result.data;
}

export async function createCustomer(
  request: CustomerRequest,
): Promise<ApiResponse> {
  return Fetch(customer, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function updateCustomer(
  id: number,
  request: CustomerRequest,
): Promise<ApiResponse> {
  return Fetch(`${customer}/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export async function deleteCustomer(id: number): Promise<ApiResponse> {
  return Fetch(`${customer}/${id}`, {
    method: "DELETE",
  });
}
