import MatchPlayer from "./MatchPlayer";
import HomeButton from "./HomeButton.jsx";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { slug } = params;

  // Fetch main JSON
  const res = await fetch(process.env.HUNT_JSON, { cache: "no-store" });
  const data = await res.json();

  const matches = data.matches || [];

  // Convert title to URL-friendly slug
  const toSlug = (t) =>
    String(t || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // Find match by slug, match_slug OR generated slug from title
  const match = matches.find(
    (m) =>
      m.slug === slug ||
      m.match_slug === slug ||
      toSlug(m.title) === slug
  );

  if (!match) return notFound();

  // Deep clone without leaking URLs
  const safeMatch = JSON.parse(JSON.stringify(match));

  // 🔥 CRITICAL FIX — ALWAYS SET A VALID SLUG
  safeMatch.slug =
    match.match_slug ||
    match.slug ||
    toSlug(match.title);

  // Guarantee STREAMING_CDN exists
  if (!match.STREAMING_CDN) match.STREAMING_CDN = {};
  if (!safeMatch.STREAMING_CDN) safeMatch.STREAMING_CDN = {};

  const keys = [
    "adfree_stream",
    "dai_stream",
    "Primary_Playback_URL",
    "dai_google_cdn",
    "sony_cdn",
    "cloudfront_cdn",
    "fancode_cdn"
  ];

  // Convert top-level URLs → boolean
  keys.forEach((k) => {
    if (
      match[k] &&
      typeof match[k] === "string" &&
      match[k].trim() !== "" &&
      match[k] !== "Unavailable"
    ) {
      safeMatch[k] = true;
    } else {
      safeMatch[k] = false;
    }
  });

  // Convert STREAMING_CDN URLs → boolean
  keys.forEach((k) => {
    if (
      match.STREAMING_CDN[k] &&
      typeof match.STREAMING_CDN[k] === "string" &&
      match.STREAMING_CDN[k].trim() !== "" &&
      match.STREAMING_CDN[k] !== "Unavailable"
    ) {
      safeMatch.STREAMING_CDN[k] = true;
    } else {
      safeMatch.STREAMING_CDN[k] = false;
    }
  });

  return (
    <>
      <HomeButton />
      <MatchPlayer serverMatch={safeMatch} />
    </>
  );
}
