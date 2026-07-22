# Deviator — Kodeon 1v1 Coding Arena

A high-energy, gamified **1v1 coding battle arena** MVP with a dark cyberpunk / esports aesthetic. Duel an opponent in real time, race a 10-minute clock, run tests in an integrated Monaco editor, climb the ranked leaderboard, and unlock Premium with a $50 SOL crypto payment (simulated).

## Tech Stack

- **Next.js 16 (App Router)** + **TypeScript**
- **Tailwind CSS** with a custom neon design system (glassmorphism, glow shadows, animated gradients)
- **Shadcn-style UI primitives** built on Radix (tabs, dialog, select, button, badge, input, progress)
- **Monaco Editor** via `@monaco-editor/react` (vs-dark theme, tab completion, auto-closing brackets)
- **Framer Motion** for podium, modal, and micro-interactions
- **Lucide Icons**

## 🚀 How to Run (Step-by-Step Tutorial)

Works on **Windows, macOS, and Linux** — the commands are the same everywhere; OS-specific notes are marked below.

### Prerequisites

- **Node.js 20.9+** (Node 22 recommended) — check with `node --version`
  - **Windows:** download the LTS installer from [nodejs.org](https://nodejs.org) (or run `winget install OpenJS.NodeJS.LTS` in PowerShell)
  - **macOS:** `brew install node` or the installer from [nodejs.org](https://nodejs.org)
  - **Linux:** use your package manager or [nvm](https://github.com/nvm-sh/nvm)
- **npm** (bundled with Node.js) — check with `npm --version`
- **Git** — check with `git --version`
  - **Windows:** install [Git for Windows](https://git-scm.com/download/win) (or `winget install Git.Git`)

### 1. Clone the repository from GitHub

Open a terminal (**Windows:** PowerShell or CMD · **macOS/Linux:** any shell) and run:

```bash
git clone https://github.com/asuriii4/Deviator.git
cd Deviator
```

### 2. Install dependencies

```bash
npm install
```

This pulls in Next.js, Monaco Editor, Framer Motion, Radix UI, Tailwind, and everything else in `package.json`.

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app hot-reloads as you edit files.

> **Windows shortcut:** instead of steps 2–3 you can simply **double-click `start-windows.bat`** in the project folder — it checks for Node.js, installs dependencies on first run, opens your browser, and starts the dev server. On macOS/Linux the equivalent is `./start-unix.sh`.

### 4. (Optional) Run a production build

```bash
npm run build   # compile an optimized production bundle
npm run start   # serve it on http://localhost:3000
```

### 5. Take a tour

| Page | URL | What to try |
| --- | --- | --- |
| Arena lobby | `/` | Pick one of the 3 featured duels |
| 1v1 match | `/arena/p-algo-01` | Edit the starter code, hit **Run Tests** a few times (progress increases per run), then **Submit Solution** |
| Leaderboard | `/leaderboard` | Search players, switch Global / Weekly / Language filters |
| Premium checkout | Navbar → **Go Premium** | Pay $50 in SOL (simulated) to unlock premium |

### 6. Test the $50 crypto payment

1. Click **Go Premium** in the navbar (or **Unlock Full Solution with Premium** in the post-match modal).
2. Review the order: **$50.00 ≈ SOL** at the mock exchange rate, with a QR code and merchant wallet address (click the address to copy it).
3. Click **Pay ... SOL ($50)** and watch the transaction go through: wallet connection → signature → broadcast → confirmation → a transaction signature receipt.
4. Premium is now active — the navbar shows the **PREMIUM** pill and post-match optimal solutions are un-blurred with full explanations.

> **Note:** The checkout is fully simulated — no real cryptocurrency moves. Premium status persists in `localStorage`; to reset it, run `localStorage.removeItem("kodeon-premium")` in the browser devtools console and refresh. To accept a different coin, edit the constants in `lib/payment.ts`.

### Troubleshooting

- **`next: command not found`** — run `npm install` first.
- **Port 3000 already in use** — run `npm run dev -- -p 3001` and open `http://localhost:3001`.
- **Editor doesn't load** — Monaco is fetched from a CDN on first load; make sure you're online.

#### Windows-specific

- **`npm.ps1 cannot be loaded because running scripts is disabled`** (PowerShell) — run PowerShell **as Administrator** and execute `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`, then retry. Alternatively use CMD instead of PowerShell, or the `start-windows.bat` launcher.
- **`node` / `npm` not recognized** — Node.js isn't on your PATH. Re-run the Node.js installer (it adds PATH entries by default) and open a **new** terminal window.
- **Line-ending warnings from Git (`LF will be replaced by CRLF`)** — harmless; the repo ships a `.gitattributes` that keeps source files LF everywhere, so builds behave identically on Windows and Linux.
- **Firewall prompt on first run** — Windows Defender may ask to allow Node.js to listen on the network; allow it for private networks so `localhost:3000` works.
- **Path too long errors** — clone the repo close to the drive root (e.g. `C:\dev\Deviator`) or enable long paths: `git config --global core.longpaths true`.

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

### Premium Crypto Checkout ($50 in SOL)
- Solana Pay-style simulated checkout: $50.00 converted to SOL at a mock rate, QR code, copyable merchant wallet address, and an itemized total with network fee
- Animated processing pipeline (connect wallet → sign → broadcast → confirm) ending in a base58 transaction-signature receipt
- Unlocking premium updates the whole app instantly (navbar **PREMIUM** pill, un-blurred solutions) and persists across reloads via `localStorage`
- Token/price/rate live in `lib/payment.ts` — swap one constant block to accept a different coin

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
  PaymentModal.tsx       # $50 SOL crypto checkout (simulated)
  arena/                 # ArenaClient, ArenaHeader, ProblemPanel, CodeWorkspace
  ui/                    # Shadcn-style primitives
lib/
  mock-data.ts           # Problems, users, leaderboard, opponent script
  payment.ts             # Premium price, token config, mock tx signatures
  premium.tsx            # PremiumProvider + usePremium (localStorage-backed)
  utils.ts               # cn(), clock formatting
types/
  index.ts               # Shared domain types
start-windows.bat        # One-click Windows launcher (install + dev server)
start-unix.sh            # macOS / Linux launcher
```

## Cross-Platform Notes

The app runs natively on **Windows, macOS, and Linux** — no WSL or virtual machine needed on Windows:

- All npm scripts (`dev`, `build`, `start`, `lint`) are plain Next.js CLI commands with no shell-specific syntax.
- `.gitattributes` normalizes line endings (LF for source, CRLF for `.bat`), so checkouts behave identically on every OS.
- No native/compiled dependencies — `npm install` needs no build tools on Windows.
- `start-windows.bat` gives Windows users a double-click launcher; `start-unix.sh` does the same for macOS/Linux.
