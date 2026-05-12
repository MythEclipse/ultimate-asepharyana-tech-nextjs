# Frontend Layout Cleanup Design

## Goal

Clean up the full frontend architecture and UI while keeping the futuristic/cyber visual direction. Scope includes all user-facing pages, route organization, shared layout patterns, and large duplicated page implementations.

## Routing architecture

Use a source-based anime route structure so Anime source 1 and source 2 share the same route family and components. Canonical routes should represent source explicitly, such as `/anime/source-1` and `/anime/source-2`, with shared detail, search, watch, ongoing, and complete list routes beneath that structure.

Keep compatibility redirects from old `/anime2/...` URLs to the new canonical source-2 URLs. Old `/anime/...` URLs should also resolve or redirect to the canonical source-1 equivalents where needed, so existing links do not break during cleanup.

Komik category pages should use one dynamic category route instead of separate wrappers for manga, manhwa, and manhua. Valid category values are `manga`, `manhwa`, and `manhua`; invalid values should be rejected at the route boundary.

Route files should stay thin. They should own metadata, params validation, canonical redirects, and delegation to shared client shells. UI behavior should live in components.

## Component architecture

Introduce shared page primitives for repeated layout structure:

- `PageShell` for global page spacing, width, and background treatment.
- `PageHero` for badge, title, subtitle, and supporting metadata.
- `ContentGrid` for responsive card layouts.
- `FeatureCard` for project/dashboard-style cards.
- `MediaCard` for anime and komik cards.

Split `Navbar` into small pieces: navigation config, desktop navigation, mobile navigation, and theme toggle. The exported `Navbar` should coordinate state only.

Use one hub pattern for project, anime, and komik landing pages. Project and media hubs should share card treatment, spacing, hover behavior, and CTA structure.

Use one anime detail/search/watch implementation parameterized by source. Remove cloned source-specific page UI from anime source 1 and source 2 routes.

Large files targeted for decomposition include `src/components/layout/navbar.tsx`, `src/app/project/project-page-client.tsx`, anime detail/search/watch route clients, and komik category wrappers.

## UI direction

Keep the futuristic/cyber identity, but make it disciplined. Use glass, glow, gradients, and glitch treatment sparingly so hierarchy stays clear.

Each page should have one strong hero, clear section headings, and consistent vertical rhythm. Cards should share radius, border strength, image treatment, hover movement, and CTA labels.

Navbar should feel cleaner: brand on the left, primary routes grouped consistently, and theme toggle behavior matching desktop and mobile. Navigation should avoid duplicate destinations and keep top-level items focused.

Mobile views should reduce extreme letter spacing, avoid oversized headings that crowd the viewport, and preserve consistent grid gaps and touch targets.

## Data flow and boundaries

Keep existing API modules and feature hooks as the source of data access. This cleanup should not change API contracts.

Validate route params at boundaries:

- Invalid anime source should return `notFound()` or redirect to a canonical valid source.
- Invalid komik type should return `notFound()`.
- Invalid page params should normalize or reject before reaching client shells.

Client shells should receive validated props. Shared components should not duplicate route validation logic.

## Loading and error behavior

Use existing app-level `loading.tsx`, `error.tsx`, `Skeleton`, `ErrorFallback`, and `EmptyState` patterns. Cleanup should consolidate duplicated loading and empty states into shared components where they already match.

Do not add broad fallback behavior that hides API or routing failures. Errors should remain visible through existing error boundaries and feature error states.

## Testing and verification

Add or update tests for:

- Canonical navigation items.
- Legacy route redirects for `/anime2/...`.
- Source-specific anime routes resolving to the correct source.
- Komik dynamic category routing for valid and invalid categories.
- Shared hub links for project, anime, and komik entry points.

Run unit tests and lint after implementation. Start the dev server and manually verify home, project, dashboard, anime source 1, anime source 2, komik hub, komik categories, search, detail, and watch/chapter golden paths where data is available.

## Non-goals

Do not rewrite API clients, query behavior, backend endpoints, portfolio data, or visual brand identity. Do not remove old routes without redirects. Do not add new product features beyond layout, routing, and UI cleanup.
