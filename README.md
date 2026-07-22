# Deviator — Kodeon 1v1 Coding Arena

A high-energy, gamified **1v1 coding battle arena** MVP with a dark cyberpunk / esports aesthetic. Duel an opponent in real time, race a 10-minute clock, run tests in an integrated Monaco editor, and climb the ranked leaderboard.

## Tech Stack

- **Next.js 14 (App Router)** + **TypeScript**
- **Tailwind CSS** with a custom neon design system (glassmorphism, glow shadows, animated gradients)
- **Shadcn-style UI primitives** built on Radix (tabs, dialog, select, button, badge, input, progress)
- **Monaco Editor** via `@monaco-editor/react` (vs-dark theme, tab completion, auto-closing brackets)
- **Framer Motion** for podium, modal, and micro-interactions
- **Lucide Icons**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

### 1v1 Arena (`/arena/[id]`)
- Animated 10-minute countdown timer that pulses red under 2 minutes
- Live match header: your test progress vs. a simulated opponent's progress
- Left panel tabs: **Problem** (markdown statement, constraints, examples), **Live Chat** (with sassy simulated replies), and **Opponent Status** (scripted real-time activity feed)
- Right panel workspace: language selector (JavaScript / Python / C++), editor theme toggle, reset button, Monaco editor, expandable terminal drawer with per-test pass/fail results and execution times
- **Run Tests** simulates progressive test passing once you edit the starter code; **Submit Solution** (or the clock hitting zero) triggers the result modal

### Match Result Modal
- **VICTORY** (emerald) / **DEFEAT** (crimson) banner with spring animation
- ELO delta (±25), completion time, and tests-passed summary
- Premium section: time/space complexity chips and the optimal solution — blurred with an "Unlock with Premium" CTA for free users, fully annotated for premium users

### Leaderboard (`/leaderboard`)
- Animated top-3 podium with gold/silver/bronze styling and a floating crown
- Searchable rankings table (ranks 4–100) with **Global / Weekly / Language** filters
- Sticky footer pinned to the bottom showing your own global standing

### Mock Data
No database required. `lib/mock-data.ts` ships three fully-specified problems — **Shortest Signal Path** (Algorithms), **XOR Cipher Heist** (Cryptography, with genuinely XOR-consistent test vectors), and **Operation Backdoor: Log Forensics** (CTF) — plus a deterministic, seeded 100-player leaderboard so server and client render identically.

## Project Structure

```
app/
  page.tsx               # Arena lobby / landing
  arena/[id]/page.tsx    # 1v1 match room
  leaderboard/page.tsx   # Rankings
  ctf/page.tsx           # CTF (coming soon)
components/
  Navbar.tsx
  MatchResultModal.tsx
  arena/                 # ArenaClient, ArenaHeader, ProblemPanel, CodeWorkspace
  ui/                    # Shadcn-style primitives
lib/
  mock-data.ts           # Problems, users, leaderboard, opponent script
  utils.ts               # cn(), clock formatting
types/
  index.ts               # Shared domain types
```
