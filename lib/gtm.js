"use server";

export async function getMatches() {
  const url = process.env.HUNT_JSON;
  if (!url) return [];

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    return data;
  } catch (e) {
    return [];
  }
}
