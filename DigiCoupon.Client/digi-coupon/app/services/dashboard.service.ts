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
  recentRedemptions: RecentRedemption[];
}

export interface RecentRedemption {
  customer: string;
  mobile: string;
  couponNumber: string;
  redemptionOn: string;
}

export async function getDashboard(): Promise<DashboardData> {
  const result = await Fetch<DashboardData>("/home/9/2026-09-30");
  console.log("getDashboard service => result => ", result);
  return result;
}
