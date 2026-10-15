import { Fetch } from "@/lib/api";
import { ApiResponse } from "../type/api-response";

export interface DashboardData {
  ownerName: string;
  restaurantId: number;
  restaurantName: string;
  totalCustomers: number;
  activePasses: number;
  totalRedemptions: number;
  todayRedemptions: number;
  expiringPasses: number;
  recentRedemptionsJson: string;
  recentRedemption: RecentRedemption[];
}

export interface RecentRedemption {
  customer: string;
  fromDate: string;
  toDate: string;
  couponNumber: string;
  redemptionOn: string;
}

export async function getDashboard(
  restaurantId?: number
): Promise<ApiResponse> {
  const targetId = restaurantId && restaurantId > 0 ? restaurantId : 0;
  const result = await Fetch(`/home/${targetId}`);
  return result;
}
