import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.HUNT_JSON;
  if (!url) return NextResponse.json({ matches: [] });

  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    const arr = Array.isArray(json) ? json : json.matches || [];

    // HIDE IMAGE URL using Base64
    const safe = arr.map(m => {
      const real =
        m?.image ||
        m?.image_cdn?.APP ||
        m?.image_cdn?.PLAYBACK ||
        m?.image_cdn?.BG_IMAGE ||
        "";

      return {
        ...m,
        encoded: Buffer.from(real).toString("base64"), // <--- encoded URL
      };
    });

    return NextResponse.json(safe);
  } catch (e) {
    return NextResponse.json({ matches: [] });
  }
}
