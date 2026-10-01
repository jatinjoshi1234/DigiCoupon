import { ApiResponse } from "@/app/type/api-response";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function Fetch<T>(
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

  let result: ApiResponse<T>;

  try {
    if (response.status == 401) window.location.href = "/auth/login";
    result = await response.json();
    console.log("api result => ", response.status);
  } catch (error) {
    console.log("error => ", error);
    throw new Error("Invalid response from server.");
  }

  if (result.code == 401) {
    window.location.href = "/auth/login";
  }

  // if (!response.ok) {
  //   throw new Error(
  //     result?.message || `Request failed with status ${response.status}`,
  //   );
  // }

  if (!result.status) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result.data as T;
}
