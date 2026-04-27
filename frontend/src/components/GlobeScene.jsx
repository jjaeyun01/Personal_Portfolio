import { useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';

const SEOUL = { lat: 37.5665, lng: 126.9780 };
const MADISON = { lat: 43.0731, lng: -89.4012 };

// Great-circle camera path: Seoul → Pacific → Alaska region → Madison
// Longitude goes eastward: 127° → 160° → 178° → -120° → -89°
const CAMERA_FRAMES = [
  { t: 0.00, lat: 35.0, lng: 127.0, alt: 2.5 },
  { t: 0.22, lat: 52.0, lng: 155.0, alt: 3.5 },
  { t: 0.50, lat: 63.0, lng: 178.0, alt: 5.5 },
  { t: 0.78, lat: 52.0, lng: -120.0, alt: 3.5 },
  { t: 1.00, lat: 43.1, lng: -89.4, alt: 2.2 },
];

const PLANE_STEPS = 100;
const PLANE_STEP_MS = 30;

function lerp(a, b, t) { return a + (b - a) * t; }

// Handles longitude wraparound for shortest eastward path
function lerpAngle(a, b, t) {
  let diff = b - a;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return a + diff * t;
}

function smoothstep(t) { return t * t * (3 - 2 * t); }

function getCamera(progress) {
  const t = Math.max(0, Math.min(1, progress));
  for (let i = 0; i < CAMERA_FRAMES.length - 1; i++) {
    const f0 = CAMERA_FRAMES[i];
    const f1 = CAMERA_FRAMES[i + 1];
    if (t >= f0.t && t <= f1.t) {
      const s = smoothstep((t - f0.t) / (f1.t - f0.t));
      return {
        lat: lerp(f0.lat, f1.lat, s),
        lng: lerpAngle(f0.lng, f1.lng, s),
        altitude: lerp(f0.alt, f1.alt, s),
      };
    }
  }
  const last = CAMERA_FRAMES[CAMERA_FRAMES.length - 1];
  return { lat: last.lat, lng: last.lng, altitude: last.alt };
}

function slerp(a, b, t) {
  const r = Math.PI / 180, d = 180 / Math.PI;
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

function bearing(a, b) {
  const r = Math.PI / 180;
  const lat1 = a.lat * r, lat2 = b.lat * r;
  const dLng = (b.lng - a.lng) * r;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function makeMarker(emoji, label, color) {
  const el = document.createElement('div');
  el.style.cssText = 'display:flex;flex-direction:column;align-items:center;pointer-events:none;';
  el.innerHTML = `
    <span style="font-size:20px;line-height:1;filter:drop-shadow(0 0 5px ${color}cc);">${emoji}</span>
    <span style="color:${color};font-size:9px;font-weight:700;letter-spacing:0.07em;
      background:rgba(0,0,0,0.82);padding:2px 7px;border-radius:4px;margin-top:3px;
      white-space:nowrap;border:1px solid ${color}55;font-family:'Poppins',sans-serif;">${label}</span>
  `;
  return el;
}

function makePlane(deg = 0) {
  const el = document.createElement('div');
  el.style.cssText = `font-size:18px;line-height:1;pointer-events:none;
    filter:drop-shadow(0 0 6px #fff8);transform:rotate(${deg - 45}deg);`;
  el.textContent = '✈️';
  return el;
}

// Label shown beside the globe as the journey progresses
const JOURNEY_LABELS = [
  { t: 0.00, label: '🇰🇷 Seoul, South Korea' },
  { t: 0.30, label: '✈️ Crossing the Pacific...' },
  { t: 0.65, label: '🌎 Approaching North America' },
  { t: 0.88, label: '🎓 University of Wisconsin–Madison' },
];

function getJourneyLabel(progress) {
  let label = JOURNEY_LABELS[0].label;
  for (const item of JOURNEY_LABELS) {
    if (progress >= item.t) label = item.label;
  }
  return label;
}

function GlobeScene({ scrollProgress, senderPos, sendKey }) {
  const globeRef = useRef();
  const [isReady, setIsReady] = useState(false);
  const [htmlItems, setHtmlItems] = useState([
    { id: 'seoul', lat: SEOUL.lat, lng: SEOUL.lng, alt: 0.01 },
    { id: 'madison', lat: MADISON.lat, lng: MADISON.lng, alt: 0.01 },
  ]);
  const [arcs, setArcs] = useState([]);
  const [journeyLabel, setJourneyLabel] = useState(JOURNEY_LABELS[0].label);

  const elRefs = useRef({
    seoul: null,
    madison: null,
    sender: null,
    plane: null,
  });

  useEffect(() => {
    elRefs.current.seoul = makeMarker('🇰🇷', 'SEOUL', '#ff4757');
    elRefs.current.madison = makeMarker('🎓', 'UW–MADISON', '#6c63ff');
    elRefs.current.plane = makePlane(0);
  }, []);

  // Drive camera from scroll
  useEffect(() => {
    if (!isReady || !globeRef.current) return;
    const cam = getCamera(scrollProgress);
    globeRef.current.pointOfView(cam, 700);
  }, [isReady, scrollProgress]);

  // Show arc once user scrolls past the about section (~28% scroll)
  useEffect(() => {
    if (scrollProgress > 0.28) {
      setArcs([{
        startLat: SEOUL.lat, startLng: SEOUL.lng,
        endLat: MADISON.lat, endLng: MADISON.lng,
      }]);
    } else {
      setArcs([]);
    }
    setJourneyLabel(getJourneyLabel(scrollProgress));
  }, [scrollProgress]);

  // Update markers when sender position is known
  useEffect(() => {
    if (senderPos && !elRefs.current.sender) {
      elRefs.current.sender = makeMarker('📍', 'YOU', '#a78bfa');
    }
    const items = [
      { id: 'seoul', lat: SEOUL.lat, lng: SEOUL.lng, alt: 0.01 },
      { id: 'madison', lat: MADISON.lat, lng: MADISON.lng, alt: 0.01 },
    ];
    if (senderPos) {
      items.push({ id: 'sender', lat: senderPos.lat, lng: senderPos.lng, alt: 0.01 });
    }
    setHtmlItems(items);
  }, [senderPos]);

  // Plane animation triggered by email send
  useEffect(() => {
    if (!sendKey || !senderPos) return;

    const mid = slerp(senderPos, MADISON, 0.5);
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: mid.lat, lng: mid.lng, altitude: 2.5 }, 700);
    }

    setArcs([{
      startLat: senderPos.lat, startLng: senderPos.lng,
      endLat: MADISON.lat, endLng: MADISON.lng,
    }]);

    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step > PLANE_STEPS) {
        clearInterval(timer);
        setHtmlItems([
          { id: 'seoul', lat: SEOUL.lat, lng: SEOUL.lng, alt: 0.01 },
          { id: 'madison', lat: MADISON.lat, lng: MADISON.lng, alt: 0.01 },
          { id: 'sender', lat: senderPos.lat, lng: senderPos.lng, alt: 0.01 },
        ]);
        setTimeout(() => setArcs([{
          startLat: SEOUL.lat, startLng: SEOUL.lng,
          endLat: MADISON.lat, endLng: MADISON.lng,
        }]), 1200);
        return;
      }

      const t = step / PLANE_STEPS;
      const pos = slerp(senderPos, MADISON, t);
      const nextPos = slerp(senderPos, MADISON, Math.min(1, (step + 1) / PLANE_STEPS));
      const deg = bearing(pos, nextPos);
      elRefs.current.plane.style.transform = `rotate(${deg - 45}deg)`;

      setHtmlItems([
        { id: 'seoul', lat: SEOUL.lat, lng: SEOUL.lng, alt: 0.01 },
        { id: 'madison', lat: MADISON.lat, lng: MADISON.lng, alt: 0.01 },
        { id: 'sender', lat: senderPos.lat, lng: senderPos.lng, alt: 0.01 },
        { id: 'plane', lat: pos.lat, lng: pos.lng, alt: 0.35 * Math.sin(t * Math.PI) },
      ]);
    }, PLANE_STEP_MS);

    return () => clearInterval(timer);
  }, [sendKey]);

  const htmlElement = useCallback((d) => {
    if (d.id === 'seoul') return elRefs.current.seoul;
    if (d.id === 'madison') return elRefs.current.madison;
    if (d.id === 'sender') return elRefs.current.sender;
    if (d.id === 'plane') return elRefs.current.plane;
  }, []);

  // Rise animation: at scroll=0 globe center is at viewport bottom (half visible),
  // rises to vertically centered over the first 12% of scroll.
  // translateY = viewportH/2 → globe center at 50vh + 50vh = 100vh (bottom edge).
  const riseFraction = Math.min(1, scrollProgress / 0.12);
  const translateY = (1 - riseFraction) * (typeof window !== 'undefined' ? window.innerHeight * 0.5 : 280);

  const arcColor = useCallback(() => ['#6c63ff', '#a78bfa'], []);

  return (
    <div
      className="globe-scene-root"
      style={{ transform: `translateY(${translateY}px)` }}
    >
      <div className="globe-scene-wrapper">
        <Globe
          ref={globeRef}
          width={560}
          height={560}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          atmosphereColor="#6c63ff"
          atmosphereAltitude={0.22}
          onGlobeReady={() => setIsReady(true)}
          htmlElementsData={htmlItems}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude="alt"
          htmlElement={htmlElement}
          arcsData={arcs}
          arcColor={arcColor}
          arcDashLength={0.4}
          arcDashGap={0.15}
          arcDashAnimateTime={2500}
          arcStroke={1.6}
          arcAltitude={0.35}
          enablePointerInteraction={true}
        />
      </div>

      {/* Journey progress label */}
      <div
        className="globe-journey-label"
        style={{ opacity: scrollProgress > 0.04 ? 1 : 0 }}
      >
        {journeyLabel}
      </div>

      {/* Scroll hint shown at very top */}
      <div
        className="globe-scroll-hint"
        style={{ opacity: scrollProgress < 0.05 ? 1 - scrollProgress * 20 : 0 }}
      >
        scroll to explore the journey ↓
      </div>
    </div>
  );
}

export default GlobeScene;
