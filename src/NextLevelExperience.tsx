import { useEffect, useRef } from 'react';

const steps = [
  ['01', 'IDENTIFY', 'Start with the actual machine, component or production problem.'],
  ['02', 'SPECIFY', 'Narrow the part or service using engineering-first filters and context.'],
  ['03', 'COMPARE', 'Review practical alternatives before committing to an enquiry.'],
  ['04', 'ENQUIRE', 'Send one clean request with the details your team needs.'],
];

export default function NextLevelExperience() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) return;

    const magnetic = Array.from(root.querySelectorAll<HTMLElement>('[data-magnetic]'));
    const onMove = (event: PointerEvent) => {
      for (const element of magnetic) {
        const rect = element.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy);
        const max = 150;
        if (distance < max) {
          const strength = (1 - distance / max) * 0.16;
          element.style.setProperty('--mx', `${dx * strength}px`);
          element.style.setProperty('--my', `${dy * strength}px`);
        } else {
          element.style.setProperty('--mx', '0px');
          element.style.setProperty('--my', '0px');
        }
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.18 });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={rootRef} className="nextlevel-experience" aria-label="Interactive industrial workflow">
      <div className="nextlevel-noise" aria-hidden="true" />
      <div className="nextlevel-beam" aria-hidden="true" />

      <header className="nextlevel-heading" data-reveal>
        <div>
          <span className="section-code">08 / ENGINEERING WORKFLOW</span>
          <h2>From problem<br /><em>to precision.</em></h2>
        </div>
        <p>
          A more useful kind of premium: the interface behaves like an engineering instrument.
          Each step responds to the user, surfaces context, and moves the visitor closer to a real enquiry.
        </p>
      </header>

      <div className="nextlevel-process" data-reveal>
        {steps.map(([number, title, copy], index) => (
          <article key={number} className={`nextlevel-step step-${index + 1}`}>
            <span className="nextlevel-step-no">{number}</span>
            <div className="nextlevel-step-line" aria-hidden="true" />
            <div className="nextlevel-step-copy">
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
            <a data-magnetic className="nextlevel-step-link" href={index === 1 ? '#shop' : index === 3 ? 'mailto:ujjwalelectricalengineers@gmail.com' : '#services'}>
              <span>OPEN</span><b>↗</b>
            </a>
          </article>
        ))}
      </div>

      <div className="nextlevel-showcase" data-reveal>
        <div className="nextlevel-showcase-art">
          <div className="nextlevel-orbit orbit-a" />
          <div className="nextlevel-orbit orbit-b" />
          <div className="nextlevel-core">UE</div>
          <div className="nextlevel-readout readout-a"><span>PRECISION</span><b>±0.01</b></div>
          <div className="nextlevel-readout readout-b"><span>RESPONSE</span><b>DIRECT</b></div>
          <div className="nextlevel-readout readout-c"><span>FLOW</span><b>CONNECTED</b></div>
        </div>
        <div className="nextlevel-showcase-copy">
          <span className="section-code">INTERACTIVE CONTROL SURFACE</span>
          <h3>One connected industrial journey.</h3>
          <p>
            Search the catalogue. Inspect a part. Compare options. Save it. Add it to your cart. Send the enquiry.
            The interface is designed to keep the visitor moving toward a useful outcome.
          </p>
          <div className="nextlevel-actions">
            <a data-magnetic className="nextlevel-primary" href="#shop">EXPLORE PARTS <b>→</b></a>
            <a data-magnetic className="nextlevel-secondary" href="#services">VIEW SERVICES</a>
          </div>
        </div>
      </div>

      <div className="nextlevel-footer-rail" aria-hidden="true">
        <span>BEARINGS</span><i>•</i><span>BT / ISO</span><i>•</i><span>ER COLLETS</span><i>•</i><span>CNC / VMC</span><i>•</i><span>ENGINEERING SUPPORT</span><i>•</i>
      </div>
    </section>
  );
}
