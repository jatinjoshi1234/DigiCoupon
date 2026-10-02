// services/customer.service.ts

import { Fetch } from "@/lib/api";

export interface CustomerRequest {
  id: number;
  restaurantId: number;
  firstName: string;
  lastName: string;
  nickName: string;
  mobile: string;
}

interface ActivePass {
  id: number;
  totalUsage: number;
  usedUsage: number;
  remainingUsage: number;
}

export interface Customer {
  customerId: number;
  name: string;
  nickName?: string | null;
  mobile: string;
  isActive: boolean;
  passId?: number;
  total: number;
  usage: number;
  remaining: number;
}

const customer = "/customer";

export async function getCustomers(restuarantId: number): Promise<Customer[]> {
  return Fetch<Customer[]>(`${customer}/all/${restuarantId}`);
}

export async function createCustomer(request: Customer) {
  return Fetch<Customer>(customer, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function updateCustomer(id: number, request: Customer) {
  return Fetch<Customer>(`${customer}/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

export async function deleteCustomer(id: number) {
  return Fetch<boolean>(`${customer}/${id}`, {
    method: "DELETE",
  });
}
