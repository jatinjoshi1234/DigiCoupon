import { Fetch } from "@/lib/api";
import { AuthUser, LoginRequest, LoginResponse } from "../type/auth";
import { ApiResponse } from "../type/api-response";
import { NextRequest, NextResponse } from "next/server";

export async function login(
  request: LoginRequest,
): Promise<ApiResponse<LoginResponse>> {
  return Fetch<ApiResponse<LoginResponse>>("auth/login", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function logout(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  const result = await response.json();

  if (!response.ok || !result.status) {
    throw new Error(result.message || "Logout failed.");
  }
}
