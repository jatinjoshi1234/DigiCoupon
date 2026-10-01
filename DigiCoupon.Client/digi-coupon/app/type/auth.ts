export interface LoginRequest {
  UserName: string;
  Password: string;
}

export interface LoginResponse {
  authUser: AuthUser;
  token: string;
}
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  restaurantId?: number;
  restaurantBranchId?: number;
  role?: string;
}
