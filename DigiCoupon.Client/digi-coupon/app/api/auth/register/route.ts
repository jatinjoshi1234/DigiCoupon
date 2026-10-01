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

    const body = await request.json();

    const url = `${API_URL}/register`;

    console.log("REGISTER API URL:", url);
    console.log("REGISTER REQUEST:", body);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    console.log("REGISTER API RESPONSE:", result);

    if (!response.ok || !result.status) {
      return NextResponse.json(
        {
          status: false,
          message: result.message || "Registration failed.",
          data: null,
        },
        { status: response.status },
      );
    }

    return NextResponse.json({
      status: true,
      message: result.message || "Registration successful.",
      data: result.data ?? null,
    });
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
