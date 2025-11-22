import { NextResponse } from "next/server";

// Safe Base64 encode for all runtimes (Vercel/Edge/Node)
function encodeBase64(str) {
  try {
    // Browser-like encode
    return btoa(str);
  } catch (e) {
    // Node fallback
    return Buffer.from(str, "utf-8").toString("base64");
  }
}

export async function GET() {
  const url = process.env.HUNT_JSON;
  if (!url) return NextResponse.json({ matches: [] });

  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    const arr = Array.isArray(json) ? json : json.matches || [];

    const safe = arr.map(m => {
      const real =
        m?.image ||
        m?.image_cdn?.APP ||
        m?.image_cdn?.PLAYBACK ||
        m?.image_cdn?.BG_IMAGE ||
        "";

      return {
        ...m,
        encoded: encodeBase64(real),  // 🔥 Correct encoding logic
      };
    });

    return NextResponse.json(safe);
  } catch (e) {
    return NextResponse.json({ matches: [] });
  }
}
