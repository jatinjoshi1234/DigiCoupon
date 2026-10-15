// services/customer.service.ts

import { Fetch, GetRequest } from "@/lib/api";
import {
  ApiResponse,
  PaginationRequest,
  PaginationResponse,
} from "../type/api-response";

export interface RedemptionRequest {
  id: number;
  customerCouponId: number;
  quantity: number;
  redemptionDate: string;
}

const redemptions = "/CouponRedemption";

export async function getRedemption(
  couponId: number,
): Promise<RedemptionRequest[]> {
  const result = await Fetch(`${redemptions}/all/${couponId}`);
  console.log("customer service => res => ", result);
  return result.data;
}

export async function getPagedData(
  payload: PaginationRequest,
): Promise<PaginationResponse<RedemptionRequest>> {
  const result = await GetRequest<PaginationResponse<RedemptionRequest>>(
    `${redemptions}/paged_data`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  console.log("customer service => res => ", result);
  return result;
}

export async function getRedemptionById(
  id: number,
): Promise<RedemptionRequest> {
  const result = await Fetch(`${redemptions}/${id}`);
  console.log("service result => ", result);
  return result.data;
}

export async function createRedemption(
  request: RedemptionRequest,
): Promise<ApiResponse> {
  return Fetch(redemptions, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function updateRedemption(
  id: number,
  request: RedemptionRequest,
): Promise<ApiResponse> {
  return Fetch(`${redemptions}/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export async function deleteRedemption(id: number): Promise<ApiResponse> {
  return Fetch(`${redemptions}/${id}`, {
    method: "DELETE",
  });
}
