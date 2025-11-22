"use server";

export async function getMatches() {
  const url = process.env.HUNT_JSON;
  if (!url) return [];

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();

    // FORCE array output
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.matches)) return data.matches;

    return [];
  } catch (e) {
    return [];
  }
}
