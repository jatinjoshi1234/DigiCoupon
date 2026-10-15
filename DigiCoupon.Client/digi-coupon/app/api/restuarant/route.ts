import { NextRequest, NextResponse } from "next/server";
import { AuthSessionData, RestaurantProfile } from "@/app/type/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
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

    const token = request.cookies.get("digicoupon_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          status: false,
          message: "Unauthorized.",
          data: null,
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    const url = `${API_URL}/restuarant`;
    console.log("RESTAURANT POST API URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    console.log("RESTAURANT CREATE RESULT:", result);

    if (!response.ok || !result.status) {
      return NextResponse.json(
        {
          status: false,
          message: result.message || "Restaurant creation failed.",
          data: null,
        },
        { status: response.status },
      );
    }

    let restId = 0;
    if (typeof result.data === "number") {
      restId = result.data;
    } else if (result.data && typeof result.data === "object") {
      restId = Number(result.data.id ?? result.data.Id ?? 0);
    }

    // Fallback: If restId is still 0, query backend for current user's restaurant
    if (!restId) {
      try {
        const myRestRes = await fetch(`${API_URL}/restuarant/my-restaurant`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (myRestRes.ok) {
          const myRestJson = await myRestRes.json();
          if (myRestJson.status && myRestJson.data?.id) {
            restId = Number(myRestJson.data.id);
          }
        }
      } catch (fallbackErr) {
        console.warn("Failed to fetch my-restaurant fallback:", fallbackErr);
      }
    }

    const createdRest: RestaurantProfile = {
      id: restId,
      name: result.data?.name ?? result.data?.Name ?? body.Name,
      email: result.data?.email ?? result.data?.Email ?? body.Email,
      mobile: result.data?.mobile ?? result.data?.Mobile ?? body.Mobile,
      address: result.data?.address ?? result.data?.Address ?? body.Address,
      fssaiLicenseNo:
        result.data?.fssaiLicenseNo ??
        result.data?.FssaiLicenseNo ??
        body.FssaiLicenseNo,
    };

    let sessionData: AuthSessionData | null = null;
    const sessionCookie = request.cookies.get("digicoupon_session")?.value;
    if (sessionCookie) {
      try {
        sessionData = JSON.parse(sessionCookie);
      } catch {
        // ignore parse error
      }
    }

    if (sessionData) {
      sessionData.restaurant = createdRest;
      sessionData.isRestaurantCreated = true;
    } else {
      sessionData = {
        user: {
          id: 0,
          name: "",
          email: "",
          mobile: "",
        },
        restaurant: createdRest,
        isRestaurantCreated: true,
      };
    }

    const nextResponse = NextResponse.json({
      status: true,
      message: result.message || "Restaurant created successfully.",
      data: createdRest,
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

    return nextResponse;
  } catch (error) {
    console.error("RESTAURANT API ERROR:", error);

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
