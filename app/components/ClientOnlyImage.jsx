'use client';
import { useState, useEffect } from 'react';

export default function ClientOnlyImage({ src, alt, className }) {
  const [loaded, setLoaded] = useState(null);
  useEffect(() => { setLoaded(src); }, [src]);
  if (!loaded) return <div style={{height:220, background:'#111'}} />;
  return <img src={loaded} alt={alt} className={className} />;
}
