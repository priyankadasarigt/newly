'use client';
import { useState, useEffect } from 'react';

export default function ClientOnlyImage({ encoded, alt, className }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (encoded) {
      try {
        setUrl(atob(encoded));   // 🔥 Decode only in browser
      } catch (e) {
        console.error("Invalid Base64", e);
      }
    }
  }, [encoded]);

  if (!url) return <div style={{height:220, background:'#111'}} />;

  return <img src={url} alt={alt} className={className} />;
}
