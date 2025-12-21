'use client';
import React, { useEffect, useState } from 'react';

export default function MatchPlayer({ serverMatch }) {
  const [streams, setStreams] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);

  const [showSony, setShowSony] = useState(false);
  const [sonyUrl, setSonyUrl] = useState('');

  // Build available stream buttons (using booleans only)
  useEffect(() => {
    if (!serverMatch) return;

    const keys = [
      'adfree_stream',
      'dai_stream',
      'Primary_Playback_URL',
      'dai_google_cdn',
      'sony_cdn'
    ];

    const s = [];

    keys.forEach(k => {
      if (serverMatch[k] === true || serverMatch?.STREAMING_CDN?.[k] === true) {
        s.push(k);  // push only the key, NOT the URL
      }
    });

    setStreams(s);
  }, [serverMatch]);

  function label(k) {
    const map = {
      adfree_stream: 'Ad Free',
      dai_stream: 'Dai Stream',
      Primary_Playback_URL: 'Primary',
      dai_google_cdn: 'G CDN',
      sony_cdn: 'Sony (Requires App)'
    };
    return map[k] || k;
  }

  // FIX: Force reload JWPlayer script cleanly
  function loadJW(url) {
    setShowPlayer(true);

    // remove broken cached jwplayer
    delete window.jwplayer;
    delete window.jwpsrv;

    // remove previous script if exists
    const old = document.querySelector("script[data-jw]");
    if (old) old.remove();

    const s = document.createElement("script");
    s.src = "//ssl.p.jwpcdn.com/player/v/8.26.5/jwplayer.js";
    s.setAttribute("data-jw", "1");

    s.onload = () => {
      try { jwplayer.key = "XSuP4qMl+9tK17QNb+4+th2Pm9AWgMO/cYH8CI0HGGr7bdjo"; } catch (e) {}
      setupJW(url);
    };

    document.body.appendChild(s);
  }

  function setupJW(url) {
    try {
      const container = document.getElementById("player");
      container.innerHTML = "";

      const playerDiv = document.createElement("div");
      playerDiv.id = "jwplayer-container";
      playerDiv.style.width = "100%";
      playerDiv.style.height = "100%";
      container.appendChild(playerDiv);

      const p = jwplayer("jwplayer-container");
      p.setup({
        file: url,
        type: "hls",
        androidhls: true,
        primary: "html5",
        preload: "auto",
        autostart: true,
        width: "100%",
        height: "100%"
      });
    } catch (e) {
      console.error("JW Setup Error →", e);
    }
  }

  // On click → fetch secure URL then load JW
  async function onClick(k) {
    const matchId = serverMatch.slug;

    try {
      const res = await fetch(
        `/api/get-stream?match=${encodeURIComponent(matchId)}&key=${encodeURIComponent(k)}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      if (!data || !data.url) {
        console.error("API missing url:", data);
        return;
      }

      // Sony popup
      if (k === "sony_cdn") {
        setSonyUrl(data.url);
        setShowSony(true);
        return;
      }

      // Load JW normally
      loadJW(data.url);

      // Scroll to player
      setTimeout(() => {
        const el = document.getElementById("player");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);

    } catch (e) {
      console.error("secureLoad failed:", e);
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>

      {/* TITLE */}
      <h1
        style={{
          background: "#ffeb3b",
          color: "#000",
          padding: "6px 10px",
          borderRadius: 4,
          textAlign: "center",
          fontSize: "22px",
          display: "inline-block",
          marginTop: "10px"
        }}
      >
        {serverMatch.title}
      </h1>

      <p style={{ color: "#e6e6e6" }}>{serverMatch.tournament}</p>
      <p style={{ color: "#cfcfcf" }}>{serverMatch.startTime}</p>

      {/* STREAM BUTTONS */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: 18
        }}
      >
        {streams.length === 0 && <div style={{ color: "#cfcfcf" }}>No streams available yet</div>}

        {streams.map((k, i) => (
          <button
            key={i}
            onClick={() => onClick(k)}
            className={`stream-btn ${k}`}
          >
            {label(k)}
          </button>
        ))}
      </div>

      {/* HIDDEN PLAYER UNTIL CLICK */}
      <div
        id="player"
        style={{
          width: "100%",
          maxWidth: 860,
          margin: "20px auto 3px auto",
          borderRadius: 10,
          overflow: "hidden",
          background: "#000",
          height: showPlayer ? "420px" : "0px",
          opacity: showPlayer ? 1 : 0,
          transition: "height .35s ease, opacity .35s ease"
        }}
      ></div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", marginTop: -10 }}>
        <div
          className="join-box"
          style={{
            padding: "15px 30px",
            fontSize: "26px",
            fontWeight: "bold",
            borderRadius: "10px",
            border: "2px solid #FFFFFF",
            display: "inline-block",
            background: "linear-gradient(90deg, #FFD700, #FF6347, #4CAF50)",
            color: "#E0FFFF",
            textAlign: "center"
          }}
        >
          Join{" "}
          <a
            href="https://telegram.me/HuntTV"
            style={{
              color: "#000",
              fontWeight: "bold",
              textDecoration: "none"
            }}
          >
            @HuntTV
          </a>{" "}
          For Upcoming LIVES
        </div>
      </div>

      {/* SONY POPUP */}
      {showSony && (
        <>
          <div
            onClick={() => setShowSony(false)}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 9998
            }}
          />

          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              backgroundColor: "#111",
              color: "#fff",
              padding: 20,
              borderRadius: 12,
              zIndex: 9999,
              width: "90%",
              maxWidth: 520
            }}
          >
            <button
              onClick={() => setShowSony(false)}
              style={{
                position: "absolute",
                right: 12,
                top: 8,
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 22
              }}
            >
              ×
            </button>

            <h3 style={{ marginBottom: 10 }}>Use App to Watch</h3>

<button
  onClick={() => {
    window.location.replace(
      `intent:${sonyUrl}#Intent;package=com.genuine.leone;end`
    );
  }}
  style={{
    display: "inline-block",
    padding: "10px 18px",
    background: "#d63384",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    cursor: "pointer"
  }}
>
  CLICK HERE For Mobile / Android TV
</button>


            <p style={{ marginTop: 12, color: "#ccc" }}>
              <b>To Watch in PC copy and paste in AuthoIPTV</b>
            </p>

            <div
              style={{
                marginTop: 10,
                background: "#2e2e2e",
                padding: 10,
                borderRadius: 8,
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "75%"
                }}
              >
                {sonyUrl}
              </span>

              <button
                onClick={() => navigator.clipboard.writeText(sonyUrl)}
                style={{
                  background: "#d63384",
                  color: "#fff",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: 6
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </>
      )}

      {/* CSS */}
      <style jsx global>{`
        .stream-btn {
          padding: 10px 20px;
          font-size: 15px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          transition: 0.25s ease;
          color: #fff;
        }
        .stream-btn:hover {
          transform: scale(1.07);
          opacity: 0.9;
        }

        .adfree_stream { background:#28a745; }
        .dai_stream { background:#007bff; }
        .Primary_Playback_URL { background:#6f42c1; }
        .dai_google_cdn { background:#fd7e14; }
        .sony_cdn { background:#dc3545; }
      `}</style>
    </div>
  );
}
