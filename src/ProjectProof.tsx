import './project-proof.css';

const proofSlots = [
  ['WORKSHOP / SITE', 'Real installation or workshop photograph'],
  ['SERVICE / MAINTENANCE', 'Real maintenance, inspection or repair photograph'],
  ['TOOLING / COMPONENTS', 'Real bearings, holders or machine-shop component photograph'],
] as const;

export default function ProjectProof() {
  return <section className="project-proof-section" aria-labelledby="project-proof-title">
    <div className="project-proof-head">
      <div>
        <span className="section-code">05 / PROJECT PROOF</span>
        <h2 id="project-proof-title">Show the <em>work.</em></h2>
      </div>
      <p>Only original UJJWAL photography or material that UJJWAL has permission to publish should appear here. No stock project claims, invented results or borrowed supplier imagery.</p>
    </div>
    <div className="project-proof-grid">
      {proofSlots.map(([label, copy]) => <article className="project-proof-card" key={label}>
        <div className="project-proof-placeholder" aria-hidden="true"><span>PHOTO PENDING</span></div>
        <div><small>{label}</small><h3>{copy}</h3><p>Replace this slot with a verified UJJWAL image and a short factual caption.</p></div>
      </article>)}
    </div>
    <a className="project-proof-cta" href="mailto:ujjwalelectricalengineers@gmail.com?subject=UJJWAL%20Project%20Photography">ADD VERIFIED PROJECT PHOTOS →</a>
  </section>;
}
