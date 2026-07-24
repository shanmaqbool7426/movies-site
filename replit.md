# StreamFlix

A Netflix-style movie & TV streaming site. Browse trending, top-rated, and now-playing titles, watch via VidSrc embed players, search, and discover by genre.

## Run & Operate

- `pnpm --filter @workspace/streamflix run dev` — React frontend (port 18649, preview at `/`)
- `pnpm --filter @workspace/api-server run dev` — Express API server (port 8080, prefix `/api`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Required Secrets

- `TMDB_API_KEY` — free key from https://www.themoviedb.org/settings/api (movie listings, posters, metadata)

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- Frontend: React 19 + Vite 7, Tailwind CSS 4, TanStack Query, Wouter routing
- API: Express 5
- Movie data: TMDB API (cached 5 min with node-cache)
- Video player: VidSrc embed (`https://vidsrc.to/embed/movie/{tmdbId}`) + 3 fallback servers
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/streamflix/src/pages/` — Home, MovieDetail, TvDetail, Search, Discover
- `artifacts/streamflix/src/components/ui/Player.tsx` — video player with server switcher (VidSrc, SuperEmbed, AutoEmbed, 2Embed)
- `artifacts/api-server/src/lib/tmdb.ts` — all TMDB API calls + response normalizers
- `artifacts/api-server/src/routes/streams.ts` — builds VidSrc/fallback embed URLs by TMDB ID
- `lib/api-client-react/` — generated React Query hooks (from OpenAPI spec via Orval)

## Architecture decisions

- Video playback uses VidSrc embed iframes — no direct video file handling needed.
- Four streaming servers per title (VidSrc, SuperEmbed, AutoEmbed, 2Embed) with client-side server switcher.
- All TMDB responses cached server-side for 5 min to avoid rate limits.
- API client generated from OpenAPI spec (`lib/api-spec/`) — run codegen after changing routes.

## User preferences

- Use VidSrc (`https://vidsrc.to`) as the primary streaming source.
