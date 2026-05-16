# Tsunami SS16 — VCS overlay control

Next.js broadcast dashboard for League of Legends overlays: tournament data (SQLite / Prisma), a control room at `/dashboard`, and an in-game HUD at `/hud/ingame`. Live game state comes from `@bluebottle_gg/league-broadcast-client` when a compatible League broadcast feed is available.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **League of Legends** with whatever tooling exposes the broadcast WebSocket this app expects (default in code: `localhost:58869` — see `src/app/context/LeagueDataContext.js`)

## Install (first time or fresh clone)

From the project root `tsunami_ss16`:

```powershell
cd tsunami_ss16
npm install
npx prisma generate
npx prisma migrate deploy
```

SQLite database file: `prisma/data.db` (created by migrations).

## Rebuild (clean artifacts)

Use this when builds act stale or after major dependency upgrades.

```powershell
cd tsunami_ss16
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

Optional nuclear reset (reinstalls all packages):

```powershell
Remove-Item -Recurse -Force node_modules, .next -ErrorAction SilentlyContinue
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
```

## Run — development

`npm run dev` starts **both**:

| Service | Port | Role |
|--------|------|------|
| Next.js | [http://localhost:3000](http://localhost:3000) | Web UI and API routes |
| Socket.IO (`socket/server.js`) | **3001** | Overlay visibility state shared between dashboard and HUD |

```powershell
npm run dev
```

## Run — production build

```powershell
npm run build
```

Then run **two** processes (the `start` script only launches Next.js, not the socket server):

```powershell
# Terminal 1
npm run start

# Terminal 2
node socket/server.js
```

Next.js defaults to port **3000**; the socket server listens on **3001**.

## How to use

1. Start the stack (`npm run dev` or production pair above).
2. Open **[http://localhost:3000/dashboard](http://localhost:3000/dashboard)** — control overlay modules (scoreboard, rankings, KDA, skin spotlight, strike mode, etc.). Changes sync over Socket.IO to clients on port 3001.
3. Open **[http://localhost:3000/hud/ingame](http://localhost:3000/hud/ingame)** in a browser source (**OBS**, vMix, etc.) for the transparent overlay; keep the socket server running so the dashboard and HUD stay in sync.
4. Ensure your **League broadcast** endpoint matches the app (`host` / `port` in `LeagueDataProvider`). Without it, HUD sections that depend on live game data will not update.
5. **Tournament / teams / players**: use the navbar and routes under `/tournament`, `/team`, `/player`, and REST handlers under `/api/*`. Prisma Studio can be launched from the home page control (`/`) via the API that opens port **5555** when available.

Other useful routes include `/dashboard/current-match`, `/hud/ingame/testui`, and `/hud/ingame/testpage` for layout experiments.

## Scripts (from `package.json`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Next dev + socket server (concurrent) |
| `npm run next` | Next.js only |
| `npm run socket` | Socket.IO server only |
| `npm run build` | Production build |
| `npm run start` | Production Next.js server |
| `npm run lint` | ESLint |

---

## Roadmap — future work in this project

**In scope (baseline shipped today):** overlay control, HUD ingest, Prisma tournament data, socket sync — treat as **✓** once your branch matches release.

**Add / todo (not done yet — mark ✗ until implemented):**

| | |
|--|--|
| ✗ | Gold graph |
| ✗ | Rune page |
| ✗ | CD items (item cooldowns on overlay) |
| ✗ | Kill-feed events |
| ✗ | Tower events |
| ✗ | POST-GAME analysis |

Flip **✗ → ✓** in this file when each feature ships.

---

## Tech stack

- Next.js 16, React 19, Tailwind 4, Ant Design, Framer Motion, Recharts  
- Prisma + SQLite  
- Socket.IO (separate Node server)  
- `@bluebottle_gg/league-broadcast-client` for in-game state  

---

## Learn More (Next.js)

- [Next.js Documentation](https://nextjs.org/docs)
