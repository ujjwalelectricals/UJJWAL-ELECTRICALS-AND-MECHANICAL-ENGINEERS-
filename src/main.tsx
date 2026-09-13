import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import './animations.css';
import './showcase.css';

const WHATSAPP='919971276078';
const enquiryMessage='Hello Ujjwal Electrical and Mechanical Engineers Enterprise, I would like to discuss an industrial requirement.';

document.addEventListener('click',(event)=>{
  const target=event.target;
  if(!(target instanceof Element)) return;
  const actionable=target.closest('a,button');
  if(!(actionable instanceof HTMLElement)) return;
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
