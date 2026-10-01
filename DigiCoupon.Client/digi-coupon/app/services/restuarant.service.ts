import { Fetch } from "@/lib/api";
import { ApiResponse } from "../type/api-response";

export interface Customer {
  id: number;
  FirstName: string;
  LastName: string;
  NickName: string;
  Mobile: string;
  MemberCode: string;
  PublicToken: string;
}
export async function createRestuarant(
  body: any,
): Promise<ApiResponse<number>> {
  return Fetch<ApiResponse<number>>("/restuarant", body);
}
