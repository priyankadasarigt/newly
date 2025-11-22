import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // -----------------------------
    // 🔐 SECURITY CHECK #1 — HOST VALIDATION
    // -----------------------------
    const host = req.headers.get("host"); // e.g. vidya.myftp.biz
    const allowedHost = process.env.ALLOWED_HOST;

    if (!host || host !== allowedHost) {
      return NextResponse.json({ error: "Unauthorized Host" }, { status: 401 });
    }

    // -----------------------------
    // 🔐 SECURITY CHECK #2 — LEVEL 4 USER-AGENT VALIDATION
    // -----------------------------
    const ua = req.headers.get("user-agent") || "";

    // ❌ Block known scrapers & non-browser tools
    const badAgents = [
      "curl",
      "python",
      "wget",
      "httpclient",
      "java",
      "okhttp",
      "libwww",
      "aiohttp",
      "node",
      "axios",
      "postman",
      "insomnia",
      "go-http-client"
    ];

    if (badAgents.some(a => ua.toLowerCase().includes(a))) {
      return NextResponse.json({ error: "Unauthorized UA" }, { status: 401 });
    }

    // ✔ Strict REAL browser detection
    const isRealBrowser =
      ua.includes("Mozilla/5.0") && (
        // Chromium browsers: Chrome / Edge / Opera
        (ua.includes("Chrome/") && ua.includes("Safari/") && ua.includes("AppleWebKit")) ||
        // Safari on iOS / macOS
        (ua.includes("Safari/") && ua.includes("AppleWebKit") && !ua.includes("Chrome/")) ||
        // Firefox browsers
        (ua.includes("Firefox") && ua.includes("Gecko/"))
      );

    if (!isRealBrowser) {
      return NextResponse.json({ error: "Browser only strict" }, { status: 401 });
    }

    // -----------------------------
    // 🔐 END OF SECURITY CHECKS
    // -----------------------------

    const { searchParams } = new URL(req.url);

    const key = searchParams.get("key");
    const matchId = searchParams.get("match");

    if (!key || !matchId) {
      return NextResponse.json({ error: "Missing key or match ID" }, { status: 400 });
    }

    const res = await fetch(process.env.HUNT_JSON, { cache: "no-store" });
    const data = await res.json();

    const matches = Array.isArray(data.matches)
      ? data.matches
      : (Array.isArray(data) ? data : []);

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

    return NextResponse.json({ url });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
