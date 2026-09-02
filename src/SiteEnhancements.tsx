import { FormEvent, useMemo, useState } from 'react';

const EMAIL = 'ujjwalelectricalengineers@gmail.com';
const PHONE = '+91 99712 76078';
const PHONE_2 = '+91 99102 28978';

export default function SiteEnhancements() {
  const [sent, setSent] = useState(false);
  const year = useMemo(() => new Date().getFullYear(), []);

  const submitEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const message = String(form.get('message') || '').trim();
    if (!name || !email || !message) return;
    const subject = `Website enquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <>
      <section className="premium-proof-band" aria-label="Ujjwal engineering highlights">
        <div><span>01</span><strong>CNC / VMC</strong><small>Service · tooling · support</small></div>
        <div><span>02</span><strong>BEARINGS</strong><small>Multi-brand industrial selection</small></div>
        <div><span>03</span><strong>ENGINEERING</strong><small>Electrical · mechanical · plant</small></div>
        <div><span>04</span><strong>ENQUIRY</strong><small>One clear list · direct contact</small></div>
      </section>

      <section className="premium-story-grid">
        <div className="story-copy">
          <span className="section-code">07 / ENGINEERING STANDARD</span>
          <h2>Built around the <em>real machine.</em></h2>
          <p>Every part, service and recommendation should answer a practical question: what keeps the machine accurate, available and dependable?</p>
          <div className="story-points">
            <article><b>01</b><h3>Inspect</h3><p>Understand the operating condition before changing anything.</p></article>
            <article><b>02</b><h3>Specify</h3><p>Choose the right size, interface, bearing or tooling geometry.</p></article>
            <article><b>03</b><h3>Execute</h3><p>Complete the work cleanly and verify the result.</p></article>
          </div>
        </div>
        <div className="story-diagram" aria-hidden="true">
          <div className="diagram-core">UE</div>
          <div className="diagram-ring r1"/><div className="diagram-ring r2"/><div className="diagram-ring r3"/>
          <span className="diagram-label dl1">PRECISION</span>
          <span className="diagram-label dl2">RELIABILITY</span>
          <span className="diagram-label dl3">RESPONSE</span>
        </div>
      </section>

      <section className="premium-contact-block" id="premium-contact">
        <div className="contact-intro">
          <span className="section-code">08 / START A CONVERSATION</span>
          <h2>Have a machine, <em>part or problem?</em></h2>
          <p>Send the requirement. We will reply directly and confirm availability, pricing and the best next step.</p>
          <div className="contact-links">
            <a href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a>
            <a href={`tel:${PHONE_2.replace(/\s/g, '')}`}>{PHONE_2}</a>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
        </div>
        <form className="premium-contact-form" onSubmit={submitEnquiry}>
          <label>Name<input name="name" required autoComplete="name" placeholder="Your name" /></label>
          <label>Email<input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label>
          <label>Phone<input name="phone" type="tel" autoComplete="tel" placeholder="Optional" /></label>
          <label className="full">Requirement<textarea name="message" required rows={5} placeholder="Tell us what you need…" /></label>
          <button type="submit">SEND ENQUIRY <span>↗</span></button>
          {sent && <p className="form-success" role="status">Your email app should open with the enquiry prepared.</p>}
        </form>
      </section>

      <section className="premium-legal-strip">
        <div><span>© {year} UJJWAL ELECTRICAL AND MECHANICAL ENGINEERS ENTERPRISE</span><small>Sector-9 · Siddharth Vihar · Ghaziabad · India</small></div>
        <nav aria-label="Legal"><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/sitemap.xml">Sitemap</a></nav>
      </section>
    </>
  );
}
