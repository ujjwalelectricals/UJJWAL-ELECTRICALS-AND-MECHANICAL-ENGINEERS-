# UJJWAL ELECTRICAL AND MECHANICAL ENGINEERS ENTERPRISE

A premium, performance-minded industrial engineering and machine-shop website for **UJJWAL ELECTRICAL AND MECHANICAL ENGINEERS ENTERPRISE**, based in Siddharth Vihar, Ghaziabad, India.

## Website description

The website combines three experiences in one fast, responsive interface:

- **Home** — a high-impact company introduction with industrial storytelling, interactive engineering visuals, machine-support focus and direct calls to action.
- **Services** — CNC/VMC service and maintenance, industrial electrical engineering, mechanical engineering, plant installation, spindle/tooling support and breakdown response, presented with interactive 3D machine context.
- **Shop** — a machine-shop catalog for ball bearings and CNC/VMC tooling, with live search, category filters, sorting, product galleries, collections/favorites, persistent cart, quantity controls and enquiry-based checkout.

The visual system is intentionally premium and industrial: restrained typography, high-contrast hierarchy, glass panels, bento-style layouts, responsive 3D scenes, motion cues, dynamic progress feedback and smooth micro-interactions.

## Experience features

- Light theme by default with persistent **dark mode** toggle.
- Responsive layout for desktop, tablet and mobile.
- Smart cursor tracking on pointer devices.
- Scroll progress indicator.
- Parallax visual movement and kinetic heading interactions.
- Optional browser voice search for the shop.
- Browser text-to-speech page reader.
- Lightweight on-site support assistant for common questions.
- Product search and filtering.
- Persistent cart and saved collection using browser storage.
- Accessible navigation, keyboard focus states and reduced-motion support.
- Lazy-loaded 3D scenes and adaptive mobile rendering.

## 3D engineering layer

The site uses React Three Fiber and Three.js for interactive industrial scenes. The rendering layer uses PBR-style materials, multiple purpose-driven lights, soft shadows on larger geometry, adaptive device pixel ratio, mobile quality reduction and hidden-tab pausing behavior.

The goal is not to maximize visual effects at the expense of usability; the goal is to make the engineering content feel physical while preserving responsiveness.

## Company

**UJJWAL ELECTRICAL AND MECHANICAL ENGINEERS ENTERPRISE**  
Sector-9, H.No. 2313, Block-51, Siddharth Vihar, Ghaziabad - 201009, India

GSTIN: `09CWDPD3387A1ZS`  
IEC: `CWDPD3387A`

Phone: `+91 99712 76078` · `+91 99102 28978`  
Email: `ujjwalelectricalengineers@gmail.com`

## Development

This project is built with **React + TypeScript + Vite + Three.js / React Three Fiber**.

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

## Deployment

The repository is configured for GitHub Pages through GitHub Actions. The deployment workflow runs TypeScript validation before the production build and deployment.

## Important production notes

This repository uses static GitHub Pages hosting. Server-side form submission, real payment processing, customer accounts and production analytics require a backend/service to be configured separately. The current shop therefore uses enquiry-based checkout and local browser persistence instead of pretending there is a live payment or inventory backend.
