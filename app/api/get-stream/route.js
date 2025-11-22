import { NextResponse } from "next/server";
import { getMatches } from "@/lib/gtm";

export async function GET(req) {
  try {
    const host = req.headers.get("host");
    const allowedHost = process.env.ALLOWED_HOST;

    if (!host || host !== allowedHost) {
      return NextResponse.json({ error: "Unauthorized Host" }, { status: 401 });
    }

    const ua = req.headers.get("user-agent") || "";

    const badAgents = [
      "curl","python","wget","httpclient","java","okhttp","libwww","aiohttp",
      "node","axios","postman","insomnia","go-http-client"
    ];

    if (badAgents.some(a => ua.toLowerCase().includes(a))) {
      return NextResponse.json({ error: "Unauthorized UA" }, { status: 401 });
    }

    const isRealBrowser =
      ua.includes("Mozilla/5.0") && (
        (ua.includes("Chrome/") && ua.includes("Safari/") && ua.includes("AppleWebKit")) ||
        (ua.includes("Safari/") && ua.includes("AppleWebKit") && !ua.includes("Chrome/")) ||
        (ua.includes("Firefox") && ua.includes("Gecko/"))
      );

    if (!isRealBrowser) {
      return NextResponse.json({ error: "Browser only strict" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const key = searchParams.get("key");
    const matchId = searchParams.get("match");

    if (!key || !matchId) {
      return NextResponse.json({ error: "Missing key or match ID" }, { status: 400 });
    }

    // SECURE FETCH
    const matches = await getMatches();

    const toSlug = (t) =>
      String(t || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const match = matches.find(
      (m) =>
        m.slug === matchId ||
        toSlug(m.title) === matchId
    );

    if (!match) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }

    let url = match[key];

    if (!url && match.STREAMING_CDN && match.STREAMING_CDN[key]) {
      url = match.STREAMING_CDN[key];
    }

    if (!url) {
      return NextResponse.json({ error: "Stream not found" }, { status: 404 });
    }

    // 🔥 FINAL FIX: DO NOT EXPOSE REAL URL
    return NextResponse.redirect(url);

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
