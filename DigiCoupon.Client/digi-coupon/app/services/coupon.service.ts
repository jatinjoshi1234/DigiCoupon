// services/customer.service.ts

import { Fetch, GetRequest } from "@/lib/api";
import {
  ApiResponse,
  PaginationRequest,
  PaginationResponse,
} from "../type/api-response";
import { Customer } from "./customer.service";
import { SelectList } from "../type/select-list";

export interface CouponRequest {
  id: number;
  customerId: number;
  couponType?: number;
  price: number;
  startDate: string;
  endDate: string;
}

const coupon = "/CustomerCoupon";

export async function getCoupon(customerId: number): Promise<CouponRequest[]> {
  const result = await Fetch(`${coupon}/all/${customerId}`);
  console.log("customer service => res => ", result);
  return result.data;
}

export async function getPagedData(
  payload: PaginationRequest,
): Promise<PaginationResponse<Customer>> {
  const result = await GetRequest<PaginationResponse<Customer>>(
    `${coupon}/paged_data`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  console.log("customer service => res => ", result);
  return result;
}

export async function getCouponById(id: number): Promise<CouponRequest> {
  const result = await Fetch(`${coupon}/${id}`);
  console.log("service result => ", result);
  return result.data;
}

export async function createCoupon(
  request: CouponRequest,
): Promise<ApiResponse> {
  return Fetch(coupon, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function updateCoupon(
  id: number,
  request: CouponRequest,
): Promise<ApiResponse> {
  return Fetch(`${coupon}/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export async function deleteCoupon(id: number): Promise<ApiResponse> {
  return Fetch(`${coupon}/${id}`, {
    method: "DELETE",
  });
}
