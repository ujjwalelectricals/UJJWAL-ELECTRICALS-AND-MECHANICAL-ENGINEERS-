import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { trackEvent } from './analytics';
import './styles.css';
import './animations.css';
import './showcase.css';

const WHATSAPP='919971276078';
const enquiryMessage='Hello Ujjwal Electrical and Mechanical Engineers Enterprise, I would like to discuss an industrial requirement.';

function trackInteraction(actionable: HTMLElement): void {
  const href = actionable instanceof HTMLAnchorElement ? actionable.getAttribute('href') || '' : '';
  const label = (actionable.textContent || '').trim().toLowerCase();
  if (/^tel:/i.test(href)) trackEvent('phone_click', {surface: 'site'});
  if (/^mailto:/i.test(href)) trackEvent('email_click', {surface: 'site'});
  if (/wa\.me\//i.test(href) || label.includes('whatsapp')) trackEvent('whatsapp_click', {surface: 'site'});
  if (label.includes('enquir')) trackEvent('enquiry_click', {surface: 'site'});
}

document.addEventListener('click',(event)=>{
  const target=event.target;
  if(!(target instanceof Element)) return;
  const actionable=target.closest('a,button');
  if(!(actionable instanceof HTMLElement)) return;
  trackInteraction(actionable);
  const label=(actionable.textContent||'').trim().toLowerCase();
  if(!label.includes('enquir')) return;
  event.preventDefault();
  event.stopPropagation();
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(enquiryMessage)}`,'_blank','noopener,noreferrer');
},true);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
