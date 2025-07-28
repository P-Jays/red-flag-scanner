import { ImageResponse } from "@vercel/og";
import { NextRequest } from 'next/server';

export const runtime = "edge";

export async function GET(req: NextRequest, context: { params: { token: string } }) {
  const token = context.params.token.toUpperCase();

  // Example: Fetch trust score from your JSON
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/data/${token.toLowerCase()}.json`);
  const data = await res.json();
  const trustScore = data.trustScore || "N/A";

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
          background: "#000",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`}
          width="100"
          height="100"
          style={{ marginBottom: "20px" }}
        />
        <h1 style={{ fontSize: "64px", margin: "0" }}>{token}</h1>
        <p style={{ fontSize: "40px", margin: "10px 0" }}>
          Trust Score: {trustScore}/10
        </p>
        <p style={{ fontSize: "28px", opacity: 0.7 }}>Red Flag Scanner — MVP</p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
