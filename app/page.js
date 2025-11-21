import ClientOnlyImage from "./components/ClientOnlyImage.jsx";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function fetchMatches() {
  const url = process.env.HUNT_JSON;
  if (!url) return [];

  try {
    const res = await fetch(url, { cache: 'no-store' });
    const json = await res.json();
    if (Array.isArray(json)) return json;
    if (Array.isArray(json.matches)) return json.matches;
    return [];
  } catch (e) {
    return [];
  }
}

function slugify(t) {
  return String(t||'')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)/g,'');
}

export default async function Page() {
  let matches = await fetchMatches();

  // LIVE FIRST
  matches.sort((a, b) => {
    const A = String(a.status || "").toUpperCase() === "LIVE";
    const B = String(b.status || "").toUpperCase() === "LIVE";
    return A === B ? 0 : A ? -1 : 1;
  });

  return (
    <main>

      {/* NEW BIG HEADER */}
      <div className="hunt-header">
        <h1 className="hunt-glow-text">Join @HuntTV</h1>
      </div>

      {/* NEW SMALL TITLE */}
      <h4 className="section-title">Fancode Live Matches</h4>

      <section className="grid">
        {matches.map((m, idx)=> {

          const isLive = String((m.status||'')).toUpperCase() === 'LIVE';

          const img =
            m.image ||
            (m.image_cdn &&
              (m.image_cdn.APP ||
               m.image_cdn.PLAYBACK ||
               m.image_cdn.BG_IMAGE)) ||
            '';

          const slug = m.slug || slugify(m.title);

          return (
            <Link key={idx} href={`/${slug}`} style={{textDecoration:'none'}}>
              <article className={'card ' + (isLive ? 'live-glow' : '')}>

                {isLive && <div className="live-badge">LIVE</div>}

                {img ? (
                  <ClientOnlyImage src={img} alt={m.title} className="thumb" />
                ) : (
                  <div style={{height:220, background:'#111'}} />
                )}

                <div className="body">
                  <h2>{m.title}</h2>
                  <p style={{color:'#bdbdbd'}}>
                    {m.tournament} • {m.language || ''}
                  </p>
                  <p style={{color:'#9aa0a6', marginTop:8}}>
                    Start: {m.startTime || 'TBD'}
                  </p>
                </div>

              </article>
            </Link>
          )
        })}
      </section>

      <div style={{textAlign:'center'}}>
        <div className="join-box">
          Join <a href="https://telegram.me/HuntTV" style={{color:'#000',textDecoration:'underline'}}>@HuntTV</a> For Upcoming LIVES
        </div>
      </div>

    </main>
  );
}
