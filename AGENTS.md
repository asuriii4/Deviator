# Deviator

## Cursor Cloud specific instructions

### What this repo is
Deviator is **Kodeon — a 1v1 Coding Arena**, a single-service **Next.js 14 (App Router) + TypeScript** web app (Tailwind CSS, Radix/shadcn UI, Monaco editor, Framer Motion). It is frontend-only: there is **no backend, database, or auth**. All problems, users, and the leaderboard come from mock data in `lib/mock-data.ts`, so no external services or secrets are required.

### Where the app code lives
The application currently lives on the feature branch `cursor/coding-arena-mvp-4fe2`; the base branch `main` may only contain `README.md` until that work is merged. If the checkout has no `package.json`, the app code has not been merged yet — check out the app branch (or a branch based on it) to run it. The startup update script guards on `package.json`, so it safely no-ops on an empty checkout.

### Package manager
Use **npm** (a `package-lock.json` is committed). Node 22 is fine.

### Run / lint / build (standard scripts from `package.json`)
- Dev server: `npm run dev` (serves on `http://localhost:3000`).
- Lint: `npm run lint` (`next lint`).
- Build: `npm run build`; production start: `npm start`.

### Notes / gotchas
- The **Run Tests** simulation only starts passing tests **after you edit the starter code** in the Monaco editor — a pristine editor will not advance the test flow. This is intentional mock behavior, not a bug.
- Routes: `/` (lobby), `/arena/[id]` (match room, e.g. `/arena/p-algo-01`), `/leaderboard`, `/ctf` (placeholder). Arena pages are statically generated for the mock problem ids.
