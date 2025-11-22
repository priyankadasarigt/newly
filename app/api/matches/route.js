import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.HUNT_JSON;
  if (!url) return NextResponse.json({ matches: [] });
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ matches: [] });
  }
}
