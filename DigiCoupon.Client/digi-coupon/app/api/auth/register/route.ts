import { NextRequest, NextResponse } from "next/server";
import { AuthSessionData, UserProfile } from "@/app/type/auth";

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
    const url = `${API_URL}/auth/register`;

    console.log("REGISTER API URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      return NextResponse.json(
        {
          status: false,
          message: result.message || "Registration failed.",
          data: null,
        },
        { status: response.status || 400 },
      );
    }

    // Auto-login new user so they can immediately proceed to Add Restaurant
    let token = result.data?.accessToken || result.data?.AccessToken || "";
    let userId = 0;

    if (!token && body.Password) {
      try {
        const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            UserName: body.Email || body.Mobile,
            Password: body.Password,
          }),
        });

        const loginResult = await loginRes.json();
        if (loginRes.ok && loginResult.status && loginResult.data?.accessToken) {
          token = loginResult.data.accessToken;
        }
      } catch (loginErr) {
        console.warn("Auto-login after register warning:", loginErr);
      }
    }

    const payload = token ? parseJwt(token) : {};
    const sub =
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      payload.nameid ||
      payload.sub ||
      0;
    userId = Number(sub) || 0;

    const user: UserProfile = {
      id: userId,
      name:
        body.Name ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        "",
      email:
        body.Email ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
        "",
      mobile: body.Mobile || "",
    };

    const sessionData: AuthSessionData = {
      user,
      restaurant: null,
      isRestaurantCreated: false,
    };

    const nextResponse = NextResponse.json({
      status: true,
      message: result.message || "User registered successfully.",
      data: sessionData,
    });

    if (token) {
      nextResponse.cookies.set("digicoupon_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      nextResponse.cookies.set(
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
    }

    return nextResponse;
  } catch (error) {
    console.error("REGISTER API ERROR:", error);
    return NextResponse.json(
      {
        status: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to connect to server.",
        data: null,
      },
      { status: 500 },
    );
  }
}
