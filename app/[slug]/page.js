import MatchPlayer from "./MatchPlayer";
import HomeButton from "./HomeButton.jsx";
import { notFound } from "next/navigation";
import { getMatches } from "@/lib/gtm";

export default async function Page({ params }) {
  const { slug } = params;

  // SECURE FETCH — NO ENV LEAK
  const matches = await getMatches();

  const toSlug = (t) =>
    String(t || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const match = matches.find(
    (m) =>
      m.slug === slug ||
      m.match_slug === slug ||
      toSlug(m.title) === slug
  );

  if (!match) return notFound();

  const safeMatch = JSON.parse(JSON.stringify(match));

  safeMatch.slug =
    match.match_slug ||
    match.slug ||
    toSlug(match.title);

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
