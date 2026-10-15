import { Fetch } from "@/lib/api";
import { ApiResponse } from "../type/api-response";
import { RestaurantProfile, UserProfile } from "../type/auth";

// ── Request shapes ────────────────────────────────────────────────────────────

export interface UpdateUserRequest {
  name: string;
  email: string;
  mobile: string;
}

export interface UpdateRestaurantRequest {
  id: number;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  fssaiLicenseNo?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

// ── API helpers ───────────────────────────────────────────────────────────────

/**
 * GET /api/auth/me  — returns current user profile + restaurant
 */
export async function getMyProfile(): Promise<{
  user: UserProfile;
  isRestaurantCreated: boolean;
  restuarant: RestaurantProfile | null;
}> {
  const result = await Fetch("/auth/me");
  return result.data;
}

/**
 * PUT /api/auth/me  — update logged-in user's own details
 */
export async function updateUserProfile(
  request: UpdateUserRequest,
): Promise<ApiResponse> {
  return Fetch("/auth/me", {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

/**
 * PUT /api/restuarant/{id}  — update restaurant details
 */
export async function updateRestaurantProfile(
  id: number,
  request: UpdateRestaurantRequest,
): Promise<ApiResponse> {
  return Fetch(`/restuarant/${id}`, {
    method: "PUT",
    body: JSON.stringify(request),
  });
}

/**
 * GET /api/restuarant/my-restaurant  — get current user's restaurant
 */
export async function getMyRestaurant(): Promise<RestaurantProfile | null> {
  const result = await Fetch("/restuarant/my-restaurant");
  return result.data ?? null;
}
