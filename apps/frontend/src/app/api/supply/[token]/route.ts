// apps/frontend/src/app/api/supply/[token]/route.ts
import { NextResponse } from "next/server";
export const runtime = "edge";

const BASE = process.env.BACKEND_URL; // <- server-only

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const token = (await params).token.toLowerCase();
  if (!token)
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  if (!BASE)
    return NextResponse.json(
      { error: "Backend URL not configured" },
      { status: 500 }
    );

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000);

  try {
    const r = await fetch(`${BASE}/supply/${encodeURIComponent(token)}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: process.env.NODE_ENV === "production" ? 60 : 0 },
    });
    clearTimeout(id);
    if (!r.ok)
      return NextResponse.json(
        { error: `Upstream ${r.status}` },
        { status: 502 }
      );
    const json = await r.json();
    return NextResponse.json(json, {
      headers: {
        "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (e) {
    clearTimeout(id);
    const msg =
      e instanceof Error && e.name === "AbortError"
        ? "Upstream timeout"
        : "Upstream error";
    return NextResponse.json({ error: msg }, { status: 504 });
  }
}
