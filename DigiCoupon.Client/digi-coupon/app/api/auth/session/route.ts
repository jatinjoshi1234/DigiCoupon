import { NextRequest, NextResponse } from "next/server";
import { AuthSessionData } from "@/app/type/auth";

/** Decode JWT payload without verifying signature (used only to read the exp claim server-side). */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/** Returns true if the JWT token is expired. */
function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return true; // treat unreadable token as expired
  // exp is in seconds; Date.now() is in milliseconds
  return Date.now() >= payload.exp * 1000;
}

/** Clears auth cookies on the given response. */
function clearAuthCookies(response: NextResponse): void {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0, // delete immediately
  };
  response.cookies.set("digicoupon_token", "", cookieOptions);
  response.cookies.set("digicoupon_session", "", cookieOptions);
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("digicoupon_token")?.value;

    // No token cookie → not authenticated
    if (!token) {
      return NextResponse.json({
        status: false,
        message: "Not authenticated.",
        data: null,
      });
    }

    // Token exists but is expired → clear cookies and reject
    if (isTokenExpired(token)) {
      const response = NextResponse.json({
        status: false,
        message: "Session expired. Please log in again.",
        data: null,
      });
      clearAuthCookies(response);
      return response;
    }

    const sessionCookie = request.cookies.get("digicoupon_session")?.value;
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    if (sessionCookie) {
      try {
        const sessionData: AuthSessionData = JSON.parse(sessionCookie);

        // If restaurant is missing or has invalid id <= 0, recover from my-restaurant endpoint
        if (
          API_URL &&
          token &&
          (!sessionData.restaurant || Number(sessionData.restaurant.id) <= 0)
        ) {
          try {
            const myRestRes = await fetch(`${API_URL}/restuarant/my-restaurant`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            // If backend also returns 401 (token rejected) → clear cookies
            if (myRestRes.status === 401) {
              const response = NextResponse.json({
                status: false,
                message: "Session expired. Please log in again.",
                data: null,
              });
              clearAuthCookies(response);
              return response;
            }

            if (myRestRes.ok) {
              const myRestJson = await myRestRes.json();
              if (myRestJson.status && myRestJson.data && Number(myRestJson.data.id) > 0) {
                sessionData.restaurant = {
                  id: Number(myRestJson.data.id),
                  name: String(myRestJson.data.name ?? "").trim(),
                  email: myRestJson.data.email,
                  mobile: myRestJson.data.mobile,
                  address: myRestJson.data.address,
                  fssaiLicenseNo: myRestJson.data.fssaiLicenseNo,
                };
                sessionData.isRestaurantCreated = true;
              }
            }
          } catch (err) {
            console.error("Session restaurant recovery error:", err);
          }
        }

        // If restaurant has an ID but name is missing or matches the numeric ID, fetch full restaurant info
        if (
          API_URL &&
          token &&
          sessionData.restaurant &&
          sessionData.restaurant.id > 0 &&
          (!sessionData.restaurant.name ||
            sessionData.restaurant.name === String(sessionData.restaurant.id) ||
            !isNaN(Number(sessionData.restaurant.name)))
        ) {
          try {
            const restRes = await fetch(
              `${API_URL}/restuarant/${sessionData.restaurant.id}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            // Token rejected by backend
            if (restRes.status === 401) {
              const response = NextResponse.json({
                status: false,
                message: "Session expired. Please log in again.",
                data: null,
              });
              clearAuthCookies(response);
              return response;
            }

            if (restRes.ok) {
              const restJson = await restRes.json();
              if (restJson.status && restJson.data) {
                const fetchedName = String(
                  restJson.data.name ?? restJson.data.Name ?? "",
                ).trim();
                if (fetchedName && isNaN(Number(fetchedName))) {
                  sessionData.restaurant.name = fetchedName;
                }
              }
            }
          } catch (fetchErr) {
            console.error("Session restaurant lookup error:", fetchErr);
          }
        }

        const response = NextResponse.json({
          status: true,
          message: "Session loaded.",
          data: sessionData,
        });

        // Re-save session cookie in case restaurant name was updated
        response.cookies.set(
          "digicoupon_session",
          JSON.stringify(sessionData),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          },
        );

        return response;
      } catch {
        // Fallback to null if parse fails
      }
    }

    return NextResponse.json({
      status: false,
      message: "Session not found.",
      data: null,
    });
  } catch (error) {
    console.error("GET SESSION ERROR:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Unable to retrieve session.",
        data: null,
      },
      { status: 500 },
    );
  }
}
