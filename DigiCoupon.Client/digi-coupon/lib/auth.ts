// Safe authentication helper utilities without localStorage
import { AuthSessionData, AuthUser, RestaurantProfile, UserProfile } from "../app/type/auth";

export async function fetchCurrentSession(): Promise<AuthSessionData | null> {
  try {
    const res = await fetch("/api/auth/session", {
      method: "GET",
      headers: { "Cache-Control": "no-cache" },
    });
    if (!res.ok) return null;
    const result = await res.json();
    return result.status ? result.data : null;
  } catch {
    return null;
  }
}
