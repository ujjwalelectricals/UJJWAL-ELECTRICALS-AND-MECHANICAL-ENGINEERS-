import { useEffect, useRef, useState } from 'react';

 type Stat = { value: number; suffix: string; label: string };

const stats: Stat[] = [
  { value: 6, suffix: '+', label: 'CORE SERVICES' },
  { value: 5, suffix: '', label: 'MACHINE BRANDS' },
  { value: 27, suffix: '+', label: 'CATALOG CATEGORIES' },
  { value: 24, suffix: '/7', label: 'ENQUIRY READY' },
];

const cards = [
  { code: '01', title: 'Industrial intelligence', copy: 'Useful tools, precise catalogue search and practical engineering context—presented as one connected workflow.' },
  { code: '02', title: 'Precision commerce', copy: 'Find a bearing or tooling family, compare options, build a cart and send a clean enquiry without friction.' },
  { code: '03', title: 'Machine-first service', copy: 'CNC, VMC, electrical and mechanical support organized around how industrial teams actually work.' },
  { code: '04', title: 'Built for motion', copy: 'Interactive visual cues and subtle depth make the experience feel engineered, not decorated.' },
];

function useCountUp(trigger: boolean) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const frame = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setShown(Math.round(progress * 100));
      if (progress < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [trigger]);
  return shown;
}

export default function TwentyFirstExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const count = useCountUp(statsVisible);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    let x = 50;
    let y = 30;
    const update = () => {
      root.style.setProperty('--pointer-x', `${x}%`);
      root.style.setProperty('--pointer-y', `${y}%`);
      raf = 0;
    };
    const onMove = (event: PointerEvent) => {
      x = (event.clientX / window.innerWidth) * 100;
      y = (event.clientY / window.innerHeight) * 100;
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const target = statsRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStatsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={rootRef} className="twentyfirst-experience" aria-label="Interactive engineering highlights">
      <div className="twentyfirst-orb" aria-hidden="true" />
      <div className="twentyfirst-grid" aria-hidden="true" />
      <div className="twentyfirst-progress" aria-hidden="true"><span /></div>
      <div className="twentyfirst-head">
        <div>
          <span className="section-code">07 / INTERACTIVE SYSTEM</span>
          <h2>Engineering, <em>with depth.</em></h2>
        </div>
        <p>Inspired by the interaction-first spirit of modern component libraries: purposeful motion, spotlight surfaces, bento layouts and crisp micro-interactions—adapted to an industrial engineering brand.</p>
      </div>
      <div className="twentyfirst-bento">
        {cards.map((card, index) => (
          <article key={card.code} className={`twentyfirst-card card-${index + 1}`}>
            <span>{card.code}</span>
            <div className="twentyfirst-card-glow" aria-hidden="true" />
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
            <a href={index === 1 ? '#shop' : index === 2 ? '#services' : '#home'}>Explore <b>↗</b></a>
          </article>
        ))}
      </div>
      <div ref={statsRef} className="twentyfirst-stats" aria-label="Company highlights">
        {stats.map((stat) => (
          <div key={stat.label} className="twentyfirst-stat">
            <strong>{statsVisible ? Math.round((stat.value * count) / 100) : 0}{stat.suffix}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
      <div className="twentyfirst-marquee" aria-hidden="true">
        <div className="twentyfirst-marquee-track">
          <span>PRECISION</span><i>•</i><span>CNC / VMC</span><i>•</i><span>BEARINGS</span><i>•</i><span>TOOLING</span><i>•</i><span>ENGINEERING</span><i>•</i>
          <span>PRECISION</span><i>•</i><span>CNC / VMC</span><i>•</i><span>BEARINGS</span><i>•</i><span>TOOLING</span><i>•</i><span>ENGINEERING</span><i>•</i>
        </div>
      </div>
      <div className="twentyfirst-cta">
        <div>
          <span className="section-code">READY WHEN YOU ARE</span>
          <h3>Bring the next machine problem.</h3>
          <p>Find a component, review the service scope, or start an enquiry in one motion.</p>
        </div>
        <div className="twentyfirst-cta-actions">
          <a className="twentyfirst-shimmer" href="#shop">Open the shop <b>→</b></a>
          <a className="twentyfirst-ghost" href="#services">View services</a>
        </div>
      </div>
    </section>
  );
}
