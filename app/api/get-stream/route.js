import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const key = searchParams.get("key");      // ex: adfree_stream
    const matchId = searchParams.get("match"); // slug of match

    if (!key || !matchId) {
      return NextResponse.json({ error: "Missing key or match ID" }, { status: 400 });
    }

    // FETCH YOUR MAIN MATCH JSON (same as in page.js)
    const res = await fetch(process.env.HUNT_JSON, { cache: "no-store" });
    const data = await res.json();

    // Support both {matches:[...]} and plain arrays
    const matches = Array.isArray(data.matches) ? data.matches : (Array.isArray(data) ? data : []);

    // Normalize slug func (same as page.js)
    const toSlug = (t) =>
      String(t || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    // Find match
    const match = matches.find(
      (m) => m.slug === matchId || toSlug(m.title) === matchId
    );

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    // Get actual URL
    let url = match[key];

    // Also check STREAMING_CDN object
    if (!url && match.STREAMING_CDN && match.STREAMING_CDN[key]) {
      url = match.STREAMING_CDN[key];
    }

    if (!url) {
      return NextResponse.json({ error: "Stream not found" }, { status: 404 });
    }

    return NextResponse.json({ url });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
