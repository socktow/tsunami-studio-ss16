# Tsunami Studio SS16

A broadcast dashboard built with Next.js, Prisma, Express-style socket communication, and a small SQLite-backed data model. This app powers tournament team management, player lookup, live overlay state updates, and an in-game HUD for match broadcasts.

## Key Features

- Next.js 16 app using the App Router
- Live socket server on port `3001` for real-time overlay state events
- Prisma ORM with SQLite database (`prisma/schema.prisma`)
- League and tournament dashboard pages, player and team views
- Custom HUD components and match overlay state handling
- Concurrent development of Next.js frontend and socket backend via `npm run dev`

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm, pnpm, or yarn

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

This runs both:

- `next dev` for the frontend app on `http://localhost:3000`
- `node socket/server.js` for the socket server on `http://localhost:3001`

### Build and start for production

```bash
npm run build
npm start
```

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - shared components such as layout containers and navigation
- `src/hooks/` - custom React hooks for API data and state management
- `src/lib/` - utility functions, constants, API route helpers, and Prisma DB utilities
- `src/store/` - client-side state store
- `socket/server.js` - standalone socket.io server for overlay state broadcasting
- `prisma/` - Prisma schema and migrations

## Database

This project uses Prisma with SQLite. The database file is configured in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./data.db"
}
```

### Prisma commands

- Generate Prisma client: `npx prisma generate`
- Apply migrations: `npx prisma migrate dev`
- Open Prisma Studio: `npx prisma studio`

## Socket Server

The socket server listens on port `3001` and emits overlay state updates:

- Emits `init` with initial overlay state on connection
- Listens for `update` events from clients
- Broadcasts the current state with `state`

## Available Scripts

- `npm run dev` - run Next.js and socket server concurrently
- `npm run next` - run Next.js in development mode only
- `npm run socket` - run the socket server only
- `npm run build` - build Next.js for production
- `npm start` - start the built Next.js app
- `npm run lint` - run ESLint

## Notes

- The app uses `reactCompiler: true` in `next.config.mjs`.
- There is no explicit `.env` requirement in the current repository, but you can add environment configuration if needed.

## License

This repository does not specify a license.
