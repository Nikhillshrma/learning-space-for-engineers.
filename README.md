# ENGIVERSE — The Arena for Engineers ⚡

A dark-mode, cyberpunk/glassmorphism hybrid web platform built for Gen Z engineering students. Personalized for **Nikhil Sharma**, packed with heavy motion design and interactive features.

## Project Goals
A single-page, all-in-one "battle station" for engineering students: notes, national mock-test rankings, an in-browser code lab, an AI teacher, and a Snapchat-style coding streak system — with a premium, animated, futuristic aesthetic.

## ✅ Currently Completed Features

1. **Animated background** — floating blurred neon orbs (CSS), drifting cyber grid, and a canvas-based particle field with glow.
2. **Personalized Hero** — "Welcome to the Arena, Nikhil Sharma" with animated gradient text, staggered load-in animations, live typing terminal line, ripple CTA buttons.
3. **Notes Vault** — 6 glassmorphic subject cards (per-card neon glow color via `--card-glow`), hover lift/scale/sweep effects, fake download feedback.
4. **The National Arena** — animated SVG percentile ring (94%) with synced count-up, shimmer progress bars, national leaderboard with a pulsing highlighted "You" row.
5. **Code Lab** — VS Code-style fake IDE (traffic-light dots, tab, syntax-highlighted Python) with a "Run Code" button that streams simulated console output line-by-line.
6. **Coding Snap Streaks** — 🔥 streak counter (nav pill + big panel), weekly day chips, "Send Code Snap" button with a 16-particle emoji burst, streak increment, and toast confirmation.
7. **AI Teacher (Prof. Byte)** — floating animated robot FAB with pulsing halo rings; opens a glassmorphic chat with typing indicator and a keyword-based simulated brain (recursion, pointers, DSA, Fourier, GATE, Python…).
8. **Micro-interactions everywhere** — JS ripple on all buttons, scroll-triggered staggered reveals (IntersectionObserver), spring-eased hovers, custom scrollbar, `prefers-reduced-motion` support.

## Functional Entry Points
- `index.html` — the entire app (single file: HTML + embedded CSS + embedded JS).
  - `#notes-vault`, `#national-arena`, `#code-lab`, `#snap-streak` — anchor-navigable sections.

## 🎨 Customization (all in `index.html`)
- **Colors**: edit the `:root` CSS custom properties at the top of the `<style>` block.
- **Percentile value**: `TARGET` constant in `animateArena()`.
- **Streak count**: `#nav-streak` / `#streak-num` markup.
- **AI replies**: `REPLIES` / `FALLBACK` arrays in the AI Teacher script section.

## Tech & Libraries
- Pure HTML5 / CSS3 / vanilla JS (no build step)
- Space Grotesk + JetBrains Mono (Google Fonts CDN)
- Font Awesome 6 (jsDelivr CDN)
- Flexbox/Grid, `backdrop-filter` glass, CSS custom properties, canvas API, IntersectionObserver, SVG stroke animation

## 🚧 Not Yet Implemented
- Real note file storage/downloads
- Real code execution (currently simulated)
- Real AI backend for the chat (keyword-based simulation)
- Persistent streak/rank data (all state resets on refresh)
- User accounts / dynamic personalization

## Recommended Next Steps
1. Persist streak & XP with the RESTful Table API so state survives refreshes.
2. Add a real mock-test flow (questions table + timer + scoring).
3. Hook the Code Lab up to a public code-execution API.
4. Make the leaderboard data-driven from a table.

## Data Models / Storage
None yet — fully client-side demo. Table API integration recommended for streaks/leaderboard.

## Deployment
To publish, use the **Publish tab** for one-click deployment.
