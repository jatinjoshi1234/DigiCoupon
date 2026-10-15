import { ApiResponse } from "@/app/type/api-response";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function Fetch(
  endPoint: string,
  options?: RequestInit,
): Promise<ApiResponse> {
  const response = await fetch(`/api/proxy${endPoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  let result: ApiResponse;

  try {
    result = await response.json();
  } catch (error) {
    console.log("error => ", error);
    throw new Error("Invalid response from server.");
  }

  return result;
}

export async function GetRequest<T>(
  endPoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/proxy${endPoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  let result: ApiResponse;

  try {
    result = await response.json();
  } catch (error) {
    console.log("error => ", error);
    throw new Error("Invalid response from server.");
  }

  return result.data as T;
}
