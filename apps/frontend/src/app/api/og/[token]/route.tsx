import { ImageResponse } from "@vercel/og";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";
// Define the type for your params, indicating it's a Promise
type RouteParams = {
  params: Promise<{ token: string }>;
};

export async function GET(req: NextRequest, context: RouteParams) {
  const { token } = await context.params;

  // Example: fetch trust score or use fallback
  let trustScore = "N/A";
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/data/${token.toLowerCase()}.json`
    );
    const data = await res.json();
    console.log(data);
    trustScore = data.trustScore || "N/A";
    // return NextResponse.json({ message: `OG data for token: ${token}` });
  } catch (error) {
    trustScore = "N/A";
    console.error("Error in OG route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #000000ff, #1e293b)",
          color: "#fff",
          fontFamily: "sans-serif",
          padding: "40px",
        }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`}
          width="120"
          height="120"
          style={{ marginBottom: "30px" }}
        />
        <h1 style={{ fontSize: "80px", margin: "0", fontWeight: "bold" }}>{token.toUpperCase()}</h1>
        <p style={{ fontSize: "48px", margin: "20px 0", color: "#ffffffff" }}>
          Trust Score: {trustScore}/10
        </p>
        <p style={{ fontSize: "28px", opacity: 0.8 }}>Red Flag Scanner — MVP</p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
