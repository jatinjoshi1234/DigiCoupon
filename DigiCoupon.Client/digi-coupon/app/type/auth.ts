export interface LoginRequest {
  UserName: string;
  Password: string;
}

export interface RegisterRequest {
  Name: string;
  Mobile: string;
  Email: string;
  Password: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
}

export interface RestaurantProfile {
  id: number;
  name: string;
  email?: string;
  mobile?: string;
  address?: string;
  fssaiLicenseNo?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface AuthSessionData {
  user: UserProfile;
  restaurant: RestaurantProfile | null;
  isRestaurantCreated: boolean;
}

// Keep legacy interfaces for backwards compatibility
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  restaurantId?: number;
  restaurantBranchId?: number;
  role?: string;
}

export interface LoginResponse {
  authUser: AuthUser;
  token: string;
}
