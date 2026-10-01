import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  console.log("🔥 PROXY ROUTE HIT");
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
    console.log("========== API PROXY ==========");
    console.log("Path:", path.join("/"));
    console.log("Cookie exists:", !!token);
    console.log("Token length:", token?.length);
    console.log("================================");

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
    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") || "application/json",
      },
    });
  } catch {
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
