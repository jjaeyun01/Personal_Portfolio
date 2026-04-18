import { useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';

const MADISON = { lat: 43.0731, lng: -89.4012 };
const STEPS = 100;
const STEP_MS = 30; // 100 × 30ms = 3 seconds

// Spherical interpolation between two lat/lng points
function slerp(a, b, t) {
  const r = Math.PI / 180;
  const d = 180 / Math.PI;
  const lat1 = a.lat * r, lng1 = a.lng * r;
  const lat2 = b.lat * r, lng2 = b.lng * r;
  const x1 = Math.cos(lat1) * Math.cos(lng1), y1 = Math.cos(lat1) * Math.sin(lng1), z1 = Math.sin(lat1);
  const x2 = Math.cos(lat2) * Math.cos(lng2), y2 = Math.cos(lat2) * Math.sin(lng2), z2 = Math.sin(lat2);
  const dot = Math.min(1, Math.max(-1, x1 * x2 + y1 * y2 + z1 * z2));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return { ...a };
  const s = Math.sin(omega);
  const s1 = Math.sin((1 - t) * omega) / s;
  const s2 = Math.sin(t * omega) / s;
  const x = s1 * x1 + s2 * x2, y = s1 * y1 + s2 * y2, z = s1 * z1 + s2 * z2;
  return {
    lat: d * Math.atan2(z, Math.sqrt(x * x + y * y)),
    lng: d * Math.atan2(y, x),
  };
}

// Bearing from point a to point b (degrees clockwise from north)
function bearing(a, b) {
  const r = Math.PI / 180;
  const lat1 = a.lat * r, lat2 = b.lat * r;
  const dLng = (b.lng - a.lng) * r;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function createMarkerEl(emoji, label, color) {
  const el = document.createElement('div');
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;pointer-events:none;';
  el.innerHTML = `
    <span style="font-size:24px;line-height:1;filter:drop-shadow(0 0 4px ${color}88);">${emoji}</span>
    <span style="color:${color};font-size:10px;font-weight:700;letter-spacing:0.05em;
      background:rgba(0,0,0,0.75);padding:2px 7px;border-radius:4px;margin-top:4px;
      white-space:nowrap;border:1px solid ${color}44;">${label}</span>
  `;
  return el;
}

function createPlaneEl(deg = 0) {
  const el = document.createElement('div');
  el.style.cssText = `font-size:22px;line-height:1;pointer-events:none;
    filter:drop-shadow(0 0 6px #ffffff88);transform:rotate(${deg - 45}deg);`;
  el.textContent = '✈️';
  return el;
}

function Earth({ senderPos, sendKey }) {
  const globeRef = useRef();
  const [isReady, setIsReady] = useState(false);
  const [arcs, setArcs] = useState([]);
  const [htmlItems, setHtmlItems] = useState([]);

  // Stable DOM element refs — created once, reused
  const elRefs = useRef({ madison: null, sender: null, plane: null });

  useEffect(() => {
    elRefs.current.madison = createMarkerEl('🎓', 'UW MADISON', '#6c63ff');
    elRefs.current.plane = createPlaneEl(0);
  }, []);

  // Rebuild sender element when senderPos changes
  useEffect(() => {
    elRefs.current.sender = senderPos
      ? createMarkerEl('📍', 'YOU', '#a78bfa')
      : null;

    setHtmlItems([
      { id: 'madison', lat: MADISON.lat, lng: MADISON.lng, alt: 0.01 },
      ...(senderPos ? [{ id: 'sender', lat: senderPos.lat, lng: senderPos.lng, alt: 0.01 }] : []),
    ]);
  }, [senderPos]);

  // Orient globe
  useEffect(() => {
    if (!isReady || !globeRef.current) return;
    if (senderPos) {
      const mid = slerp(senderPos, MADISON, 0.5);
      globeRef.current.pointOfView({ lat: mid.lat, lng: mid.lng, altitude: 2.2 }, 1500);
    } else {
      globeRef.current.pointOfView({ lat: MADISON.lat, lng: MADISON.lng, altitude: 2.0 }, 800);
    }
  }, [isReady, senderPos]);

  // Plane animation on email send
  useEffect(() => {
    if (!sendKey || !senderPos) return;

    // Re-orient so both endpoints are visible
    if (globeRef.current) {
      const mid = slerp(senderPos, MADISON, 0.5);
      globeRef.current.pointOfView({ lat: mid.lat, lng: mid.lng, altitude: 2.2 }, 600);
    }

    setArcs([{
      startLat: senderPos.lat, startLng: senderPos.lng,
      endLat: MADISON.lat, endLng: MADISON.lng,
    }]);

    let step = 0;
    const timer = setInterval(() => {
      step++;

      if (step > STEPS) {
        clearInterval(timer);
        // Remove plane, clear arc after a moment
        setHtmlItems([
          { id: 'madison', lat: MADISON.lat, lng: MADISON.lng, alt: 0.01 },
          { id: 'sender', lat: senderPos.lat, lng: senderPos.lng, alt: 0.01 },
        ]);
        setTimeout(() => setArcs([]), 1200);
        return;
      }

      const t = step / STEPS;
      const pos = slerp(senderPos, MADISON, t);
      const nextPos = slerp(senderPos, MADISON, Math.min(1, (step + 1) / STEPS));
      const deg = bearing(pos, nextPos);
      elRefs.current.plane.style.transform = `rotate(${deg - 45}deg)`;

      // Arc-matched altitude: peaks at midpoint
      const alt = 0.35 * Math.sin(t * Math.PI);

      setHtmlItems([
        { id: 'madison', lat: MADISON.lat, lng: MADISON.lng, alt: 0.01 },
        { id: 'sender', lat: senderPos.lat, lng: senderPos.lng, alt: 0.01 },
        { id: 'plane', lat: pos.lat, lng: pos.lng, alt },
      ]);
    }, STEP_MS);

    return () => clearInterval(timer);
  }, [sendKey]);

  const htmlElement = useCallback((d) => {
    if (d.id === 'madison') return elRefs.current.madison;
    if (d.id === 'sender') return elRefs.current.sender;
    if (d.id === 'plane') return elRefs.current.plane;
  }, []);

  return (
    <Globe
      ref={globeRef}
      width={520}
      height={520}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      atmosphereColor="#6c63ff"
      atmosphereAltitude={0.18}
      onGlobeReady={() => setIsReady(true)}
      htmlElementsData={htmlItems}
      htmlLat="lat"
      htmlLng="lng"
      htmlAltitude="alt"
      htmlElement={htmlElement}
      arcsData={arcs}
      arcColor={() => ['#6c63ff', '#e0d7ff']}
      arcDashLength={0.35}
      arcDashGap={0.15}
      arcDashAnimateTime={2000}
      arcStroke={1.8}
      arcAltitude={0.35}
    />
  );
}

export default Earth;
