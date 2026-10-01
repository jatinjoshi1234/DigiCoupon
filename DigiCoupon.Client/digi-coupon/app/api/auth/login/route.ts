import { NextRequest, NextResponse } from "next/server";

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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;
    console.log("url login route file => ", url);
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

    const nextResponse = NextResponse.json({
      status: true,
      message: result.message,
      data: result.data,
    });
    console.log(
      "response before set cookies ",
      result.data.isRestuarantCreated,
    );
    nextResponse.cookies.set("digicoupon_token", result.data.accessToken, {
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
