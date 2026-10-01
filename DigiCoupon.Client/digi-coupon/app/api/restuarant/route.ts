import { NextRequest, NextResponse } from "next/server";

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
    console.log("restuarant route => token =", token);
    console.log("restuarant route => url = ", url);
    console.log("RESTAURANT route ", body);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    console.log("response => ", result);
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

    return NextResponse.json({
      status: true,
      message: result.message || "Restaurant created successfully.",
      data: result.data ?? null,
    });
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
