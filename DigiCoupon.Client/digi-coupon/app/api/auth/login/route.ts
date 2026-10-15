import { NextRequest, NextResponse } from "next/server";
import { AuthSessionData, RestaurantProfile, UserProfile } from "@/app/type/auth";

function parseJwt(token: string): Record<string, any> {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return {};
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

export async function POST(request: NextRequest) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    if (!API_URL) {
      return NextResponse.json(
        {
          status: false,
          message: "API URL is not configured.",
          data: null,
        },
        { status: 500 },
      );
    }

    const body = await request.json();
    const url = `${API_URL}/auth/login`;
    console.log("LOGIN API URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      return NextResponse.json(
        {
          status: false,
          message: result.message || "Login failed.",
          data: null,
        },
        { status: response.status },
      );
    }

    const token = result.data?.accessToken || result.data?.AccessToken || "";
    const payload = parseJwt(token);

    const sub =
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      payload.nameid ||
      payload.sub ||
      result.data?.user?.id ||
      result.data?.User?.Id ||
      0;

    const rawUser = result.data?.user || result.data?.User || {};
    const rawRest = result.data?.restuarant || result.data?.Restuarant || null;

    const user: UserProfile = {
      id: Number(sub) || 0,
      name: rawUser.name ||
        rawUser.Name ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        "",
      email: rawUser.email ||
        rawUser.Email ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
        "",
      mobile: rawUser.mobile || rawUser.Mobile || "",
      firstName: "",
      lastName: "",
    };

    let restaurant: RestaurantProfile | null = null;
    if (rawRest) {
      if (typeof rawRest === "object") {
        restaurant = {
          id: Number(rawRest.id ?? rawRest.Id ?? 0),
          name: String(rawRest.name ?? rawRest.Name ?? "").trim(),
          email: rawRest.email ?? rawRest.Email,
          mobile: rawRest.mobile ?? rawRest.Mobile,
          address: rawRest.address ?? rawRest.Address,
          fssaiLicenseNo: rawRest.fssaiLicenseNo ?? rawRest.FssaiLicenseNo,
        };
      } else if (typeof rawRest === "number" || !isNaN(Number(rawRest))) {
        restaurant = {
          id: Number(rawRest),
          name: "",
        };
      }
    }

    // If restaurant has an ID but its name is missing or matches the numeric ID, fetch full restaurant info
    if (
      token &&
      restaurant &&
      restaurant.id > 0 &&
      (!restaurant.name ||
        restaurant.name === String(restaurant.id) ||
        !isNaN(Number(restaurant.name)))
    ) {
      try {
        const restRes = await fetch(`${API_URL}/restuarant/${restaurant.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (restRes.ok) {
          const restJson = await restRes.json();
          if (restJson.status && restJson.data) {
            const fetchedName = String(
              restJson.data.name ?? restJson.data.Name ?? "",
            ).trim();
            if (fetchedName && isNaN(Number(fetchedName))) {
              restaurant.name = fetchedName;
            }
            restaurant.email =
              restJson.data.email ?? restJson.data.Email ?? restaurant.email;
            restaurant.mobile =
              restJson.data.mobile ?? restJson.data.Mobile ?? restaurant.mobile;
            restaurant.address =
              restJson.data.address ??
              restJson.data.Address ??
              restaurant.address;
            restaurant.fssaiLicenseNo =
              restJson.data.fssaiLicenseNo ??
              restJson.data.FssaiLicenseNo ??
              restaurant.fssaiLicenseNo;
          }
        }
      } catch (err) {
        console.error("Failed to fetch detailed restaurant name:", err);
      }
    }

    const isRestaurantCreated = Boolean(
      result.data?.isRestuarantCreated ??
      result.data?.IsRestuarantCreated ??
      (restaurant !== null && restaurant.id > 0),
    );

    const sessionData: AuthSessionData = {
      user,
      restaurant,
      isRestaurantCreated,
    };

    const nextResponse = NextResponse.json({
      status: true,
      message: result.message || "User login successfully.",
      data: sessionData,
    });

    // Set secure HTTP-only cookies
    nextResponse.cookies.set("digicoupon_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    nextResponse.cookies.set("digicoupon_session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return nextResponse;
  } catch (error) {
    console.error("LOGIN API ERROR:", error);
    return NextResponse.json(
      {
        status: false,
        message: "Unable to connect to server.",
        data: null,
      },
      { status: 500 },
    );
  }
}
