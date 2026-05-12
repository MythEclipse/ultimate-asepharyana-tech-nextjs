# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project rules

This workspace uses Next.js 16+ with App Router and modern APIs. Validate Next.js assumptions against local docs in `node_modules/next/dist/docs/` and follow deprecation notes.

Keep documentation, UI labels, and copy formal, direct, and non-hyperbolic. Avoid speculative claims beyond implemented behavior. For code and design, favor maintainable patterns with practical defensive practices. Do not assume clearing cache fixes problems; find and fix root logic.

## Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Production build: `npm run build`
- Start production server after build: `npm run start`
- Lint: `npm run lint`
- Auto-fix lint issues: `npm run lint:fix`
- Run Vitest in watch mode: `npm run test`
- Run unit tests once: `npm run test:run`
- Run one test file: `npx vitest run src/__tests__/lib/utils.test.ts`
- Run tests matching a name: `npx vitest run -t "cn utility"`
- Run Vitest UI: `npm run test:ui`
- Run Playwright suite: `npm run e2e`
- Run Playwright UI: `npm run e2e:ui`
- Refresh GitHub stats cache: `GITHUB_TOKEN=<token> node scripts/fetch-github-stats.mjs` (`GITHUB_TOKEN` optional but improves GraphQL contribution data)

Local app URL defaults to `http://localhost:3000`. API base defaults to `https://rust.asepharyana.tech/api`; override with `NEXT_PUBLIC_API_URL`.

## Architecture

- App uses Next.js App Router under `src/app`. Route pages are thin entry points that set metadata and delegate UI/data behavior to client shells in `src/components`.
- Root layout in `src/app/layout.tsx` wraps all pages with `LoadingProvider`, `ClientLayout`, and `QueryProvider`. `ClientLayout` owns theme setup, global background, navbar/footer, route-keyed `<main>`, and loading overlay.
- Data fetching uses TanStack Query on client components. Query client defaults live in `src/components/providers/query-provider.tsx`; feature hooks such as `src/components/anime/use-anime.ts`, `src/components/komik/use-komik.ts`, and shared media hooks compose query keys and API calls.
- External content API access is centralized in `src/lib/api`. `config.ts` defines `API_BASE_URL` and `fetchApi`; `media.ts` provides shared list/detail/search/stream endpoint builders for anime and komik; `anime.ts` and `komik.ts` expose typed feature-specific wrappers.
- Anime has two source variants. Routes under `/anime` pass `source={1}` and routes under `/anime2` pass `source={2}` into shared anime shells; source-specific API prefixing and Anime2 episode/download normalization live in `src/lib/api/anime.ts` and `src/lib/api/media.ts`.
- Komik pages use dedicated route/client shells plus shared media presentation components. Manga/manhwa/manhua list fetching goes through `fetchMediaList("komik", ...)` and feature wrappers in `src/lib/api/komik.ts`.
- Shared UI primitives live in `src/components/ui`; reusable media page/detail/search scaffolding lives in `src/components/shared`; feature sections live in `src/components/home`, `src/components/anime`, `src/components/komik`, `src/components/dashboard`, and related directories.
- Static portfolio data lives in `src/lib/data`. GitHub stats are served by `src/app/api/github/stats/route.ts`, which prefers remote cached JSON, then local JSON, then live GitHub API calls when forced or needed.
- Metrics endpoint `src/app/api/metrics/route.ts` exposes `prom-client` default metrics from `src/lib/prometheus.ts`.

## Testing notes

- Vitest uses jsdom, globals, React plugin, and `vitest.setup.ts`; tests are included from `src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}` and exclude `e2e`.
- `vitest.setup.ts` mocks `fetch`, `matchMedia`, `IntersectionObserver`, and `ResizeObserver` globally.
- Coverage config targets `src/**/*.{ts,tsx}` with 70% thresholds.
- Playwright is configured for Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari. It starts `npm run dev` automatically against `http://localhost:3000`; no e2e test files currently exist.

## Build and lint configuration

- TypeScript is strict, uses `moduleResolution: "bundler"`, and maps `@/*` to `src/*`.
- ESLint uses `eslint-config-next` plus TypeScript plugin, import ordering warnings, unresolved import errors, and unused variable errors except names starting with `_`.
- Next config outputs standalone builds, optimizes `@tsparticles/react`, transpiles tsparticles and `three`, and restricts image remote hosts in `next.config.ts`.
