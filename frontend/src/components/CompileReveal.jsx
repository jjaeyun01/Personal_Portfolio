import { useState, useEffect, useRef } from 'react';

/**
 * Shows code lines typing out rapidly, then flashes and cross-fades
 * to the clean text view. Animation triggers once on viewport entry.
 */
export default function CompileReveal({ codeLines, textView, lineDelay = 55, onCompile }) {
  const [started, setStarted] = useState(false);
  const [count, setCount]     = useState(0);
  const [phase, setPhase]     = useState('code'); // 'code' | 'flash' | 'text'
  const ref = useRef();

  // Trigger once when section enters viewport
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Reveal lines one by one
  useEffect(() => {
    if (!started || phase !== 'code') return;
    if (count >= codeLines.length) {
      const t = setTimeout(() => setPhase('flash'), 420);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount(c => c + 1), lineDelay);
    return () => clearTimeout(t);
  }, [started, count, phase, codeLines.length, lineDelay]);

  // Flash → text
  useEffect(() => {
    if (phase !== 'flash') return;
    const t = setTimeout(() => { setPhase('text'); onCompile?.(); }, 300);
    return () => clearTimeout(t);
  }, [phase, onCompile]);

  return (
    <div ref={ref} className="compile-reveal">
      {phase !== 'text' && (
        <pre className={`code-block${phase === 'flash' ? ' code-flash' : ''}`}>
          {codeLines.slice(0, count).map((line, i) => (
            <span key={i} className="code-line">
              <span className="line-no">{i + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: line.h }} />
            </span>
          ))}
          {count < codeLines.length && phase === 'code' && (
            <span className="cursor" style={{ marginLeft: 4 }} />
          )}
        </pre>
      )}

      {phase === 'text' && (
        <div className="compiled-view">
          {textView}
        </div>
      )}
    </div>
  );
}
