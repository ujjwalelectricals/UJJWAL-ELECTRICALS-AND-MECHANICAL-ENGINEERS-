import { useEffect, useMemo, useRef, useState } from 'react';

const PREF_KEY = 'ueme-site-preferences-v1';
const FAV_KEY = 'ueme-favourites-v1';

type Theme = 'light' | 'dark';
type Lang = 'EN' | 'HI';

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

function savePrefs(theme: Theme, lang: Lang) {
  try { localStorage.setItem(PREF_KEY, JSON.stringify({ theme, lang })); } catch { /* private browsing */ }
}

function readPrefs(): { theme: Theme; lang: Lang } {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    const value = raw ? JSON.parse(raw) : {};
    return { theme: value.theme === 'dark' ? 'dark' : 'light', lang: value.lang === 'HI' ? 'HI' : 'EN' };
  } catch {
    return { theme: 'light', lang: 'EN' };
  }
}

export default function ExperienceLayer() {
  const initial = useMemo(readPrefs, []);
  const [theme, setTheme] = useState<Theme>(initial.theme);
  const [lang, setLang] = useState<Lang>(initial.lang);
  const [progress, setProgress] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang === 'HI' ? 'hi' : 'en';
    savePrefs(theme, lang);
  }, [theme, lang]);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setProgress(Math.min(100, Math.max(0, (window.scrollY / max) * 100)));
      document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
    };
    const onMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onMove);
    };
  }, [progress]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      sections.forEach((section) => {
        const speed = Number(section.dataset.parallax || '0.08');
        const rect = section.getBoundingClientRect();
        section.style.setProperty('--parallax-y', `${(rect.top + y) * speed * -0.12}px`);
      });
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  const speakPage = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const main = document.getElementById('main-content');
    const text = main?.innerText?.replace(/\s+/g, ' ').slice(0, 7000) || '';
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'HI' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.02;
    window.speechSynthesis.speak(utterance);
  };

  const startVoice = () => {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike; webkitSpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'HI' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (!transcript) return;
      window.location.hash = `shop`;
      window.setTimeout(() => {
        const input = document.querySelector<HTMLInputElement>('[aria-label="Search industrial products"], [aria-label="Search the catalog"]');
        if (input) {
          input.focus();
          const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
          setter?.call(input, transcript);
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, 120);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const answer = (input: string) => {
    const q = input.toLowerCase();
    if (q.includes('bearing')) return lang === 'HI' ? 'आप Shop में BALL BEARINGS फ़िल्टर चुन सकते हैं और bearing को cart में जोड़ सकते हैं।' : 'Open Shop and choose BALL BEARINGS. You can inspect products and add them to your cart.';
    if (q.includes('service') || q.includes('cnc')) return lang === 'HI' ? 'Services page पर CNC service, industrial electrical, mechanical और plant support उपलब्ध है।' : 'The Services page covers CNC service, industrial electrical, mechanical engineering and plant support.';
    if (q.includes('contact') || q.includes('email')) return lang === 'HI' ? 'आप ujjwalelectricalengineers@gmail.com पर संपर्क कर सकते हैं।' : 'You can contact UJJWAL ELECTRICAL AND MECHANICAL ENGINEERS ENTERPRISE at ujjwalelectricalengineers@gmail.com.';
    if (q.includes('cart')) return lang === 'HI' ? 'Shop में products जोड़ें और CART से quantity बदलें या enquiry भेजें।' : 'Add products in Shop, then use CART to change quantities or send an enquiry.';
    return lang === 'HI' ? 'मैं आपको Home, Services, Shop, Bearings और Contact में मदद कर सकता हूँ।' : 'I can help with Home, Services, Shop, Bearings, Cart and Contact.';
  };

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((messages) => [...messages, `You: ${text}`, `UJJWAL: ${answer(text)}`]);
    setChatInput('');
  };

  return (
    <>
      <div className="scroll-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <div className="cursor-orb" aria-hidden="true" />
      <div className="experience-controls" aria-label="Site controls">
        <button type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle light and dark mode">
          {theme === 'light' ? '◐ DARK' : '○ LIGHT'}
        </button>
        <button type="button" onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')} aria-label="Switch language">{lang === 'EN' ? 'हिंदी' : 'EN'}</button>
        <button type="button" onClick={listening ? stopVoice : startVoice} aria-label="Voice search">{listening ? '● LISTENING' : 'VOICE'}</button>
        <button type="button" onClick={speakPage} aria-label="Read page aloud">READ</button>
      </div>
      <button className="chat-fab" type="button" onClick={() => setChatOpen((value) => !value)} aria-expanded={chatOpen} aria-label="Open support assistant">{chatOpen ? '×' : 'AI'}</button>
      {chatOpen && (
        <section className="site-chat" aria-label="Ujjwal support assistant">
          <header><div><span>UJJWAL ASSIST</span><strong>How can we help?</strong></div><button type="button" onClick={() => setChatOpen(false)} aria-label="Close">×</button></header>
          <div className="site-chat-log">{chatMessages.length ? chatMessages.map((message, index) => <p key={`${message}-${index}`}>{message}</p>) : <p>Ask about bearings, CNC services, the cart, or contact details.</p>}</div>
          <div className="site-chat-input"><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') sendChat(); }} placeholder="Ask something…" aria-label="Ask the support assistant"/><button type="button" onClick={sendChat}>SEND</button></div>
        </section>
      )}
    </>
  );
}
