import { useEffect, useState } from 'react';

const overview = 'UJJWAL ELECTRICAL AND MECHANICAL ENGINEERS ENTERPRISE provides practical industrial engineering support across CNC and VMC maintenance, mechanical systems, electrical engineering, plant installation and precision tooling. We also support component selection for bearings and machine accessories, helping industrial teams identify suitable solutions and move from technical requirements to clear enquiries.';

export default function CapabilityReader() {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(overview);
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <section className="capability-reader glass-panel" aria-label="Company capabilities and read aloud">
      <div>
        <span className="section-code">ACCESSIBILITY / QUICK OVERVIEW</span>
        <h3>Industrial capability, clearly explained.</h3>
        <p>{overview}</p>
      </div>
      <button type="button" className="capability-reader-button" onClick={toggleSpeech} aria-pressed={speaking}>
        {speaking ? 'STOP READING' : 'READ ALOUD'} <b>↗</b>
      </button>
    </section>
  );
}
