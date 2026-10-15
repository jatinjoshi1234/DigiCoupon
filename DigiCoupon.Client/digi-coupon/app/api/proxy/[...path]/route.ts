import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
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

    const { path } = await params;

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

    const targetUrl = `${API_URL}/${path.join("/")}`;

    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Content-Type", "application/json");
    headers.delete("host");

    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text();

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const responseBody = await response.text();

    const nextResponse = new NextResponse(responseBody, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });

    // If the backend rejected our token (expired / invalid), clear auth cookies.
    // AuthContext will detect the cleared session on next refresh and redirect to /auth/login.
    if (response.status === 401) {
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 0,
      };
      nextResponse.cookies.set("digicoupon_token", "", cookieOptions);
      nextResponse.cookies.set("digicoupon_session", "", cookieOptions);
    }

    return nextResponse;
  } catch (error) {
    console.log("Proxy Error => ", error);
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

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
