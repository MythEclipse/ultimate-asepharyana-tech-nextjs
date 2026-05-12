# Frontend Layout Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean all frontend pages into consistent source-based routes, shared layout primitives, and disciplined futuristic UI.

**Architecture:** Keep API/data hooks intact. Move route validation and canonical redirects to thin App Router pages, then delegate to shared client shells. Extract repeated hero/grid/card/nav structures into focused components before migrating pages.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS, Vitest/jsdom, TanStack Query.

---

## File structure

### Create

- `src/components/layout/navbar/nav-data.ts` — primary nav and theme mode data.
- `src/components/layout/navbar/theme-toggle.tsx` — shared desktop/mobile theme toggle.
- `src/components/layout/navbar/desktop-nav.tsx` — desktop nav links.
- `src/components/layout/navbar/mobile-nav.tsx` — mobile nav links.
- `src/components/layout/page-shell.tsx` — page width, spacing, optional glow.
- `src/components/layout/page-hero.tsx` — badge/title/subtitle/meta hero.
- `src/components/layout/content-grid.tsx` — responsive grid wrapper.
- `src/components/layout/feature-card.tsx` — reusable portfolio/media feature card.
- `src/lib/utils/anime-routes.ts` — source parsing and canonical anime route builders.
- `src/lib/utils/komik-routes.ts` — komik category parsing and config.
- `src/app/anime/[source]/page.tsx` — canonical anime hub route.
- `src/app/anime/[source]/search/page.tsx` — canonical anime search route.
- `src/app/anime/[source]/detail/[slug]/page.tsx` — canonical anime detail route.
- `src/app/anime/[source]/watch/[slug]/page.tsx` — canonical anime watch route.
- `src/app/anime/[source]/ongoing-anime/[page]/page.tsx` — canonical ongoing route.
- `src/app/anime/[source]/complete-anime/[page]/page.tsx` — canonical complete route.
- `src/app/komik/[category]/[page]/page.tsx` — dynamic komik category list route.
- `src/__tests__/layout/routes.test.ts` — pure route/helper tests.

### Modify

- `src/components/layout/navbar.tsx` — become small wrapper or re-export from split files.
- `src/config/site.ts` — update media links to canonical anime routes.
- `src/lib/utils/routes.ts` — route builders return canonical paths.
- `src/app/project/project-page-client.tsx` — use page primitives and feature card.
- `src/app/komik/komik-page-client.tsx` — use page primitives where useful.
- `src/components/anime/anime-page-shell.tsx` — accept canonical route links.
- `src/components/anime/anime-list-page.tsx` — use canonical list routes.
- `src/components/anime/anime-card.tsx` — use canonical detail/watch routes.
- `src/components/shared/media-detail-shell.tsx` — keep source-param compatibility.
- `src/__tests__/layout/navigation.test.tsx` — update expected project media routes.

### Convert to redirect wrappers

- `src/app/anime/page.tsx`
- `src/app/anime/search/page.tsx`
- `src/app/anime/detail/[slug]/page.tsx`
- `src/app/anime/watch/[slug]/page.tsx`
- `src/app/anime/ongoing-anime/[page]/page.tsx`
- `src/app/anime/complete-anime/[page]/page.tsx`
- all matching `src/app/anime2/**/page.tsx`
- `src/app/komik/manga/[page]/page.tsx`
- `src/app/komik/manhwa/[page]/page.tsx`
- `src/app/komik/manhua/[page]/page.tsx`

---

## Task 1: Route helper tests

**Files:**
- Create: `src/__tests__/layout/routes.test.ts`
- Modify: `src/__tests__/layout/navigation.test.tsx`

- [ ] **Step 1: Write failing route-helper tests**

Create `src/__tests__/layout/routes.test.ts`:

```ts
import { describe, expect, it } from "vitest"

import {
  animeCanonicalPrefix,
  animeDetailRoute,
  animeHubRoute,
  animeListRoute,
  animeSearchRoute,
  animeWatchRoute,
  parseAnimeSourceParam,
} from "@/lib/utils/routes"
import { getKomikCategoryConfig, komikListRoute, parseKomikCategoryParam } from "@/lib/utils/komik-routes"

describe("anime canonical routes", () => {
  it("builds source-based anime routes", () => {
    expect(animeCanonicalPrefix(1)).toBe("/anime/source-1")
    expect(animeCanonicalPrefix(2)).toBe("/anime/source-2")
    expect(animeHubRoute(1)).toBe("/anime/source-1")
    expect(animeSearchRoute(2)).toBe("/anime/source-2/search")
    expect(animeListRoute(1, "ongoing", 3)).toBe("/anime/source-1/ongoing-anime/3")
    expect(animeDetailRoute(2, "one piece")).toBe("/anime/source-2/detail/one%20piece")
    expect(animeWatchRoute(1, "ep-1")).toBe("/anime/source-1/watch/ep-1")
  })

  it("parses only supported source params", () => {
    expect(parseAnimeSourceParam("source-1")).toBe(1)
    expect(parseAnimeSourceParam("source-2")).toBe(2)
    expect(parseAnimeSourceParam("anime2")).toBeNull()
    expect(parseAnimeSourceParam(undefined)).toBeNull()
  })
})

describe("komik category routes", () => {
  it("parses only supported komik categories", () => {
    expect(parseKomikCategoryParam("manga")).toBe("manga")
    expect(parseKomikCategoryParam("manhwa")).toBe("manhwa")
    expect(parseKomikCategoryParam("manhua")).toBe("manhua")
    expect(parseKomikCategoryParam("novel")).toBeNull()
  })

  it("builds category list routes and exposes config", () => {
    expect(komikListRoute("manga", 4)).toBe("/komik/manga/4")
    expect(getKomikCategoryConfig("manhwa").queryKeyBase).toBe("manhwa-list")
    expect(getKomikCategoryConfig("manhua").hero.title).toBe("MANHUA")
  })
})
```

- [ ] **Step 2: Update navigation expectation to canonical media routes**

Change `src/__tests__/layout/navigation.test.tsx` assertion:

```ts
it("exposes media routes from the project hub", () => {
  expect(MEDIA_PROJECTS.map((project) => project.link)).toEqual(["/anime/source-1", "/anime/source-2", "/komik"])
})
```

- [ ] **Step 3: Run tests and verify failure**

Run:

```bash
bunx vitest run src/__tests__/layout/routes.test.ts src/__tests__/layout/navigation.test.tsx
```

Expected: FAIL because `parseAnimeSourceParam`, `animeCanonicalPrefix`, and `komik-routes` do not exist yet or old routes still return `/anime` and `/anime2`.

---

## Task 2: Canonical route helpers

**Files:**
- Modify: `src/lib/utils/routes.ts`
- Create: `src/lib/utils/komik-routes.ts`
- Modify: `src/lib/data/projects.ts`

- [ ] **Step 1: Replace anime route builders with canonical routes**

Update `src/lib/utils/routes.ts`:

```ts
export type AnimeSource = 1 | 2
export type AnimeListType = "ongoing" | "complete"
export type KomikCategory = "manga" | "manhwa" | "manhua"

export function animeCanonicalPrefix(source: AnimeSource): string {
  return `/anime/source-${source}`
}

export function parseAnimeSourceParam(value: string | string[] | undefined): AnimeSource | null {
  const normalized = Array.isArray(value) ? value[0] : value
  if (normalized === "source-1") return 1
  if (normalized === "source-2") return 2
  return null
}

export function animePrefix(source: AnimeSource): "anime" | "anime2" {
  return source === 2 ? "anime2" : "anime"
}

export function animeHubRoute(source: AnimeSource): string {
  return animeCanonicalPrefix(source)
}

export function animeSearchRoute(source: AnimeSource): string {
  return `${animeHubRoute(source)}/search`
}

export function animeListBaseRoute(source: AnimeSource, type: AnimeListType): string {
  return `${animeHubRoute(source)}/${type}-anime`
}

export function animeListRoute(source: AnimeSource, type: AnimeListType, page: number): string {
  return `${animeListBaseRoute(source, type)}/${page}`
}

export function animeDetailRoute(source: AnimeSource, slug: string): string {
  return `${animeHubRoute(source)}/detail/${encodeURIComponent(slug)}`
}

export function animeWatchRoute(source: AnimeSource, slug: string): string {
  return `${animeHubRoute(source)}/watch/${encodeURIComponent(slug)}`
}

export function komikHubRoute(): string {
  return "/komik"
}

export function komikSearchRoute(): string {
  return `${komikHubRoute()}/search`
}

export function komikListBaseRoute(category: KomikCategory): string {
  return `${komikHubRoute()}/${category}`
}

export function komikListRoute(category: KomikCategory, page: number): string {
  return `${komikListBaseRoute(category)}/${page}`
}

export function komikDetailRoute(slug: string): string {
  return `${komikHubRoute()}/detail/${encodeURIComponent(slug)}`
}

export function komikChapterRoute(slug: string): string {
  return `${komikHubRoute()}/chapter/${encodeURIComponent(slug)}`
}
```

- [ ] **Step 2: Add komik category config helper**

Create `src/lib/utils/komik-routes.ts`:

```ts
import { fetchManga, fetchManhua, fetchManhwa } from "@/lib/api/komik"
import type { KomikCategory } from "@/lib/utils/routes"
import { komikListBaseRoute, komikListRoute } from "@/lib/utils/routes"

const KOMIK_CATEGORY_CONFIG = {
  manga: {
    fetchFn: fetchManga,
    queryKeyBase: "manga-list",
    baseUrl: komikListBaseRoute("manga"),
    hero: {
      title: "MANGA",
      accent: "LIST",
      description: "List of manga updates.",
      accentTextClass: "text-cyan-500",
      tagClass: "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400",
      introText: "Manga",
      colorClass: "border-cyan-500/20",
      linkTextClass: "text-cyan-500",
    },
  },
  manhwa: {
    fetchFn: fetchManhwa,
    queryKeyBase: "manhwa-list",
    baseUrl: komikListBaseRoute("manhwa"),
    hero: {
      title: "MANHWA",
      accent: "LIST",
      description: "List of manhwa updates.",
      accentTextClass: "text-indigo-500",
      tagClass: "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400",
      introText: "Manhwa",
      colorClass: "border-indigo-500/20",
      linkTextClass: "text-indigo-500",
    },
  },
  manhua: {
    fetchFn: fetchManhua,
    queryKeyBase: "manhua-list",
    baseUrl: komikListBaseRoute("manhua"),
    hero: {
      title: "MANHUA",
      accent: "LIST",
      description: "List of manhua updates.",
      accentTextClass: "text-red-500",
      tagClass: "bg-red-500/10 border border-red-500/20 text-red-400",
      introText: "Manhua",
      colorClass: "border-red-500/20",
      linkTextClass: "text-red-500",
    },
  },
} as const

export function parseKomikCategoryParam(value: string | string[] | undefined): KomikCategory | null {
  const normalized = Array.isArray(value) ? value[0] : value
  if (normalized === "manga" || normalized === "manhwa" || normalized === "manhua") {
    return normalized
  }
  return null
}

export function getKomikCategoryConfig(category: KomikCategory) {
  return KOMIK_CATEGORY_CONFIG[category]
}

export { komikListRoute }
```

- [ ] **Step 3: Update media project links**

In `src/lib/data/projects.ts`, set anime media project links to canonical routes:

```ts
link: "/anime/source-1"
```

and

```ts
link: "/anime/source-2"
```

Keep komik as:

```ts
link: "/komik"
```

- [ ] **Step 4: Run tests**

Run:

```bash
bunx vitest run src/__tests__/layout/routes.test.ts src/__tests__/layout/navigation.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/routes.ts src/lib/utils/komik-routes.ts src/lib/data/projects.ts src/__tests__/layout/routes.test.ts src/__tests__/layout/navigation.test.tsx
git commit -m "refactor: add canonical frontend route helpers"
```

---

## Task 3: Shared layout primitives

**Files:**
- Create: `src/components/layout/page-shell.tsx`
- Create: `src/components/layout/page-hero.tsx`
- Create: `src/components/layout/content-grid.tsx`
- Create: `src/components/layout/feature-card.tsx`

- [ ] **Step 1: Create `PageShell`**

```tsx
import { Section } from "@/components/ui/section"
import { cn } from "@/lib/utils"

interface PageShellProps {
  children: React.ReactNode
  className?: string
  contentClassName?: string
  glow?: boolean
}

export function PageShell({ children, className, contentClassName, glow = true }: PageShellProps) {
  return (
    <main className={cn("min-h-screen text-foreground relative overflow-hidden", className)}>
      <Section glow={glow} glowVariant="both" className={cn("max-w-6xl mx-auto pb-32", contentClassName)}>
        {children}
      </Section>
    </main>
  )
}
```

- [ ] **Step 2: Create `PageHero`**

```tsx
import { Badge } from "@/components/ui/badge"
import { GlitchText } from "@/components/ui/glitch-text"
import { Heading } from "@/components/ui/heading"
import { cn } from "@/lib/utils"

interface PageHeroProps {
  badge: string
  title: string
  kicker?: string
  description?: React.ReactNode
  meta?: React.ReactNode
  className?: string
}

export function PageHero({ badge, title, kicker, description, meta, className }: PageHeroProps) {
  return (
    <header className={cn("flex flex-col items-center text-center gap-8 mb-20", className)}>
      <Badge variant="glass">{badge}</Badge>
      <div className="space-y-2">
        <Heading as="h1" className="text-6xl md:text-8xl lg:text-[9rem]">
          <GlitchText text={title} className="bg-linear-to-r from-primary via-accent to-primary bg-clip-text text-transparent" />
        </Heading>
        {kicker ? (
          <p className="text-2xl md:text-4xl font-black uppercase tracking-[0.22em] md:tracking-[0.3em] text-foreground/10">
            {kicker}
          </p>
        ) : null}
      </div>
      {description ? <p className="max-w-2xl text-muted-foreground/70 text-base font-medium leading-relaxed">{description}</p> : null}
      {meta ? <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/50">{meta}</div> : null}
    </header>
  )
}
```

- [ ] **Step 3: Create `ContentGrid`**

```tsx
import { cn } from "@/lib/utils"

interface ContentGridProps {
  children: React.ReactNode
  className?: string
  variant?: "cards" | "media"
}

export function ContentGrid({ children, className, variant = "cards" }: ContentGridProps) {
  return (
    <div
      className={cn(
        variant === "media" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6 gap-y-10" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className,
      )}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Create `FeatureCard`**

```tsx
import Link from "next/link"

import { CachedImage } from "@/components/ui/cached-image"
import { Card } from "@/components/ui/card"
import { Heading } from "@/components/ui/heading"

interface FeatureCardProps {
  title: string
  description: string
  category: string
  image: string
  href: string
  actionLabel: string
}

export function FeatureCard({ title, description, category, image, href, actionLabel }: FeatureCardProps) {
  const isExternal = href.startsWith("http")

  return (
    <Link href={href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className="group">
      <Card className="h-full flex flex-col overflow-hidden border-border/40 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300">
        <div className="relative h-40 overflow-hidden">
          <CachedImage src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <span className="absolute top-3 right-3 rounded-md bg-background/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur-md">
            {category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4 gap-2">
          <Heading as="h3" className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </Heading>
          <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">{description}</p>
          <span className="mt-auto pt-3 text-[10px] font-black uppercase tracking-[0.25em] text-primary">{actionLabel}</span>
        </div>
      </Card>
    </Link>
  )
}
```

- [ ] **Step 5: Run type/lint check**

```bash
bun run lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/page-shell.tsx src/components/layout/page-hero.tsx src/components/layout/content-grid.tsx src/components/layout/feature-card.tsx
git commit -m "refactor: add shared page layout primitives"
```

---

## Task 4: Split Navbar

**Files:**
- Create: `src/components/layout/navbar/nav-data.ts`
- Create: `src/components/layout/navbar/theme-toggle.tsx`
- Create: `src/components/layout/navbar/desktop-nav.tsx`
- Create: `src/components/layout/navbar/mobile-nav.tsx`
- Modify: `src/components/layout/navbar.tsx`

- [ ] **Step 1: Create nav data**

```ts
export const THEME_SEQUENCE = ["light", "dark", "system"] as const
```

- [ ] **Step 2: Create theme toggle**

```tsx
"use client"

import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  mounted: boolean
  theme: string | undefined
  onToggle: () => void
  variant?: "desktop" | "mobile"
}

export function ThemeToggle({ mounted, theme, onToggle, variant = "desktop" }: ThemeToggleProps) {
  const icon = !mounted ? (
    <div className="w-5 h-5 rounded-full bg-border/20 animate-pulse" />
  ) : theme === "light" ? (
    <IconSun className="w-5 h-5 text-amber-500 transition-transform duration-500 group-hover:rotate-12" />
  ) : theme === "dark" ? (
    <IconMoon className="w-5 h-5 text-indigo-400 transition-transform duration-500 group-hover:-rotate-12" />
  ) : (
    <IconDeviceDesktop className="w-5 h-5 text-cyan-400 transition-transform duration-500 group-hover:scale-110" />
  )

  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme mode"
      title={mounted ? `Theme: ${theme}` : "Theme: loading"}
      className={cn(
        "group rounded-lg transition-all active:scale-95",
        variant === "mobile"
          ? "flex items-center gap-3 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border/30 hover:border-border/60"
          : "p-3 hover:bg-muted/50",
      )}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      {variant === "mobile" ? <span>{theme ?? "system"}</span> : null}
    </button>
  )
}
```

- [ ] **Step 3: Create desktop nav**

```tsx
"use client"

import Link from "next/link"

import { siteConfig } from "@/config/site"

function NavLink({ href, label, currentPath }: { href: string; label: string; currentPath: string }) {
  const isActive = currentPath === href || (href !== "/" && currentPath.startsWith(`${href}/`))

  return (
    <Link
      href={href}
      className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.24em] transition-all duration-300 rounded-xl relative group/link ${
        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
    >
      <span className="relative z-10">{label}</span>
      {isActive ? <span className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-primary" /> : null}
    </Link>
  )
}

export function DesktopNav({ currentPath }: { currentPath: string }) {
  return (
    <div className="hidden md:flex items-center gap-1">
      {siteConfig.mainNav.map((item) => (
        <NavLink key={item.link} href={item.link} label={item.name} currentPath={currentPath} />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create mobile nav**

```tsx
"use client"

import Link from "next/link"

import { siteConfig } from "@/config/site"

function MobileNavLink({ href, label, isActive, onClick }: { href: string; label: string; isActive: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block py-4 px-5 text-base font-black uppercase tracking-tight border rounded-xl transition-all duration-300 active:scale-95 ${
        isActive ? "bg-primary/10 border-primary/20 text-primary" : "border-white/5 hover:bg-white/5 hover:border-white/10 text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  )
}

interface MobileNavProps {
  currentPath: string
  onNavigate: () => void
  children: React.ReactNode
}

export function MobileNav({ currentPath, onNavigate, children }: MobileNavProps) {
  return (
    <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-3xl animate-fade-in overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-3">
        {siteConfig.mainNav.map((item) => (
          <MobileNavLink
            key={item.link}
            href={item.link}
            label={item.name}
            isActive={currentPath === item.link || (item.link !== "/" && currentPath.startsWith(`${item.link}/`))}
            onClick={onNavigate}
          />
        ))}
        <div className="pt-6 mt-6 border-t border-border/20 flex items-center justify-between">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Replace Navbar with coordinator**

Update `src/components/layout/navbar.tsx`:

```tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { DesktopNav } from "@/components/layout/navbar/desktop-nav"
import { MobileNav } from "@/components/layout/navbar/mobile-nav"
import { THEME_SEQUENCE } from "@/components/layout/navbar/nav-data"
import { ThemeToggle } from "@/components/layout/navbar/theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    const nextIndex = (THEME_SEQUENCE.indexOf((theme ?? "system") as (typeof THEME_SEQUENCE)[number]) + 1) % THEME_SEQUENCE.length
    setTheme(THEME_SEQUENCE[nextIndex])
  }

  return (
    <nav role="navigation" aria-label="Primary" className="sticky top-0 z-100 w-full backdrop-blur-3xl bg-background/75 border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-4 md:px-8">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
            <span className="text-background font-black text-xl italic tracking-tighter">A</span>
          </div>
          <div className="hidden sm:block space-y-0.5">
            <span className="text-lg font-black italic tracking-tighter uppercase leading-none block group-hover:text-primary transition-colors">
              Asep <span className="text-primary group-hover:text-foreground transition-colors">Haryana</span>
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.42em] text-muted-foreground/50 block">Personal Portfolio</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <DesktopNav currentPath={pathname} />
          <div className="w-px h-6 bg-border/60" />
          <ThemeToggle mounted={mounted} theme={theme} onToggle={cycleTheme} />
        </div>

        <button className="md:hidden p-3 rounded-lg hover:bg-muted/50 transition-all active:scale-95" onClick={() => setIsOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={isOpen}>
          <div className="space-y-1.5 w-6">
            <div className={`h-0.5 bg-foreground rounded-full transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2" : "w-full"}`} />
            <div className={`h-0.5 bg-foreground rounded-full transition-all duration-300 ${isOpen ? "opacity-0" : "w-2/3"}`} />
            <div className={`h-0.5 bg-foreground rounded-full transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2" : "w-full"}`} />
          </div>
        </button>
      </div>

      {isOpen ? (
        <MobileNav currentPath={pathname} onNavigate={() => setIsOpen(false)}>
          <ThemeToggle mounted={mounted} theme={theme} onToggle={cycleTheme} variant="mobile" />
        </MobileNav>
      ) : null}
    </nav>
  )
}
```

- [ ] **Step 6: Run tests/lint**

```bash
bun run lint
bunx vitest run src/__tests__/layout/navigation.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/navbar.tsx src/components/layout/navbar/nav-data.ts src/components/layout/navbar/theme-toggle.tsx src/components/layout/navbar/desktop-nav.tsx src/components/layout/navbar/mobile-nav.tsx
git commit -m "refactor: split navbar into focused components"
```

---

## Task 5: Canonical anime routes and redirects

**Files:**
- Create canonical `src/app/anime/[source]/**/page.tsx` files
- Modify legacy `src/app/anime/**/page.tsx` and `src/app/anime2/**/page.tsx` files

- [ ] **Step 1: Create canonical anime hub page**

Create `src/app/anime/[source]/page.tsx`:

```tsx
import { notFound } from "next/navigation"

import { AnimePageShell } from "@/components/anime/anime-page-shell"
import { parseAnimeSourceParam } from "@/lib/utils/routes"

export default async function AnimeSourcePage({ params }: { params: Promise<{ source: string }> }) {
  const { source } = await params
  const parsedSource = parseAnimeSourceParam(source)
  if (!parsedSource) notFound()

  return <AnimePageShell source={parsedSource} />
}
```

- [ ] **Step 2: Create canonical anime list pages**

Create `src/app/anime/[source]/ongoing-anime/[page]/page.tsx`:

```tsx
import { notFound } from "next/navigation"

import { AnimeListPage } from "@/components/anime/anime-list-page"
import { parsePageParam } from "@/lib/utils/route-params"
import { parseAnimeSourceParam } from "@/lib/utils/routes"

export default async function OngoingAnimeSourcePage({ params }: { params: Promise<{ source: string; page: string }> }) {
  const { source, page } = await params
  const parsedSource = parseAnimeSourceParam(source)
  if (!parsedSource) notFound()

  return <AnimeListPage source={parsedSource} page={parsePageParam(page)} type="ongoing" />
}
```

Create `src/app/anime/[source]/complete-anime/[page]/page.tsx`:

```tsx
import { notFound } from "next/navigation"

import { AnimeListPage } from "@/components/anime/anime-list-page"
import { parsePageParam } from "@/lib/utils/route-params"
import { parseAnimeSourceParam } from "@/lib/utils/routes"

export default async function CompleteAnimeSourcePage({ params }: { params: Promise<{ source: string; page: string }> }) {
  const { source, page } = await params
  const parsedSource = parseAnimeSourceParam(source)
  if (!parsedSource) notFound()

  return <AnimeListPage source={parsedSource} page={parsePageParam(page)} type="complete" />
}
```

- [ ] **Step 3: Create canonical anime detail/search/watch pages by adapting existing implementations**

Move current detail/search/watch UI into shared client components if not already available. Canonical route files should look like:

`src/app/anime/[source]/detail/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation"

import AnimeDetailRoute from "@/app/anime/detail/[slug]/page"
import { parseAnimeSourceParam } from "@/lib/utils/routes"

export default async function CanonicalAnimeDetailPage({ params }: { params: Promise<{ source: string; slug: string }> }) {
  const { source, slug } = await params
  const parsedSource = parseAnimeSourceParam(source)
  if (!parsedSource) notFound()

  return <AnimeDetailRoute source={parsedSource} slug={slug} />
}
```

If current `src/app/anime/detail/[slug]/page.tsx` does not export a prop-based component, first extract its client UI to `src/components/anime/anime-detail-route.tsx` with props:

```ts
type AnimeDetailRouteProps = { source: 1 | 2; slug: string }
```

Use same extraction pattern for search and watch:

```ts
type AnimeSearchRouteProps = { source: 1 | 2 }
type AnimeWatchRouteProps = { source: 1 | 2; slug: string }
```

- [ ] **Step 4: Convert old anime root to redirect**

Update `src/app/anime/page.tsx`:

```tsx
import { redirect } from "next/navigation"

export default function AnimePage() {
  redirect("/anime/source-1")
}
```

Update `src/app/anime2/page.tsx`:

```tsx
import { redirect } from "next/navigation"

export default function Anime2Page() {
  redirect("/anime/source-2")
}
```

- [ ] **Step 5: Convert old anime list pages to redirects**

Example `src/app/anime2/ongoing-anime/[page]/page.tsx`:

```tsx
import { redirect } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  redirect(`/anime/source-2/ongoing-anime/${page}`)
}
```

Apply same pattern:

- `/anime/ongoing-anime/[page]` → `/anime/source-1/ongoing-anime/[page]`
- `/anime/complete-anime/[page]` → `/anime/source-1/complete-anime/[page]`
- `/anime2/ongoing-anime/[page]` → `/anime/source-2/ongoing-anime/[page]`
- `/anime2/complete-anime/[page]` → `/anime/source-2/complete-anime/[page]`

- [ ] **Step 6: Convert old detail/search/watch pages to redirects**

Examples:

```tsx
import { redirect } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/anime/source-2/detail/${encodeURIComponent(slug)}`)
}
```

Search pages:

```tsx
import { redirect } from "next/navigation"

export default function Page() {
  redirect("/anime/source-2/search")
}
```

Apply source 1 and source 2 equivalents.

- [ ] **Step 7: Run focused tests and build routing type check**

```bash
bunx vitest run src/__tests__/layout/routes.test.ts src/__tests__/layout/navigation.test.tsx
bun run lint
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/app/anime src/app/anime2 src/components/anime src/lib/utils/routes.ts
git commit -m "refactor: add canonical anime source routes"
```

---

## Task 6: Dynamic komik category route

**Files:**
- Create: `src/app/komik/[category]/[page]/page.tsx`
- Modify: `src/app/komik/manga/[page]/page.tsx`
- Modify: `src/app/komik/manhwa/[page]/page.tsx`
- Modify: `src/app/komik/manhua/[page]/page.tsx`

- [ ] **Step 1: Create dynamic komik category page**

```tsx
import { notFound } from "next/navigation"

import { KomikListPage } from "@/components/komik/komik-list-page"
import { parsePageParam } from "@/lib/utils/route-params"
import { getKomikCategoryConfig, parseKomikCategoryParam } from "@/lib/utils/komik-routes"

export default async function KomikCategoryPage({ params }: { params: Promise<{ category: string; page: string }> }) {
  const { category, page } = await params
  const parsedCategory = parseKomikCategoryParam(category)
  if (!parsedCategory) notFound()

  const config = getKomikCategoryConfig(parsedCategory)

  return (
    <KomikListPage
      page={parsePageParam(page)}
      fetchFn={config.fetchFn}
      queryKeyBase={config.queryKeyBase}
      baseUrl={config.baseUrl}
      variant={parsedCategory}
      heroExpose={config.hero}
    />
  )
}
```

- [ ] **Step 2: Convert old category pages to redirect wrappers**

Example `src/app/komik/manga/[page]/page.tsx`:

```tsx
import { redirect } from "next/navigation"

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  redirect(`/komik/manga/${page}`)
}
```

Because canonical path matches old path, delete old duplicate wrappers only if Next route conflict permits. If route conflict occurs, keep only the dynamic route and delete the three old wrapper directories after confirming generated route priority works.

- [ ] **Step 3: Run route helper tests**

```bash
bunx vitest run src/__tests__/layout/routes.test.ts
bun run lint
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/komik src/lib/utils/komik-routes.ts
git commit -m "refactor: consolidate komik category routes"
```

---

## Task 7: Apply shared page primitives to project hub

**Files:**
- Modify: `src/app/project/project-page-client.tsx`

- [ ] **Step 1: Replace project page structure**

Update `src/app/project/project-page-client.tsx` to use shared primitives:

```tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { ContentGrid } from "@/components/layout/content-grid"
import { FeatureCard } from "@/components/layout/feature-card"
import { PageHero } from "@/components/layout/page-hero"
import { PageShell } from "@/components/layout/page-shell"
import { Heading } from "@/components/ui/heading"
import { FEATURED_PROJECTS, MEDIA_PROJECTS } from "@/lib/data/projects"

export function ProjectPageClient() {
  return (
    <PageShell contentClassName="max-w-6xl">
      <PageHero
        badge="Featured Projects"
        title="Project"
        kicker="Showcase"
        description={<>Software projects built with <span className="text-cyan-400 font-bold">Rust</span> and <span className="text-blue-400 font-bold">Frontend</span> technologies.</>}
        meta={
          <>
            <span className="h-px w-16 bg-linear-to-r from-transparent to-border/50" />
            Total <span className="text-foreground/80 px-3 py-1 bg-muted/50 rounded-md border border-border/50">{FEATURED_PROJECTS.length}</span> Projects
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-border/50" />
          </>
        }
      />

      <section className="mb-20 space-y-6">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <Badge variant="glass">Media Apps</Badge>
          <Heading as="h2" className="text-3xl md:text-5xl">Explore Anime and Komik</Heading>
          <p className="max-w-2xl text-sm text-muted-foreground/70 leading-relaxed">Media readers live under Projects so primary navigation stays focused.</p>
        </div>
        <ContentGrid>
          {MEDIA_PROJECTS.map((project) => (
            <FeatureCard key={project.id} title={project.title} description={project.description} category={project.category} image={project.image} href={project.link} actionLabel="Open" />
          ))}
        </ContentGrid>
      </section>

      <ContentGrid>
        {FEATURED_PROJECTS.map((project) => (
          <FeatureCard key={project.id} title={project.title} description={project.description} category={project.category} image={project.image} href={project.link} actionLabel={project.link.startsWith("http") ? "Visit" : "View"} />
        ))}
      </ContentGrid>
    </PageShell>
  )
}
```

- [ ] **Step 2: Run navigation tests**

```bash
bunx vitest run src/__tests__/layout/navigation.test.tsx
bun run lint
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/project/project-page-client.tsx
git commit -m "refactor: clean project hub layout"
```

---

## Task 8: Apply primitives to media hubs and grids

**Files:**
- Modify: `src/components/shared/media-hub-section.tsx`
- Modify: `src/components/shared/media-hub-content.tsx`
- Modify: `src/components/anime/anime-page-shell.tsx`
- Modify: `src/app/komik/komik-page-client.tsx`

- [ ] **Step 1: Use `ContentGrid` in media hub section**

Update `src/components/shared/media-hub-section.tsx`:

```tsx
"use client"

import { ReactNode } from "react"

import { ContentGrid } from "@/components/layout/content-grid"
import { SectionHeader } from "@/components/shared/section-header"

interface MediaHubSectionProps<T> {
  id: string
  title: string
  icon: React.ElementType
  color: string
  link: string
  items: T[]
  maxItems?: number
  renderItem: (item: T, index: number) => ReactNode
}

export function MediaHubSection<T extends { slug?: string }>({ id, title, icon, color, link, items, maxItems = 10, renderItem }: MediaHubSectionProps<T>) {
  return (
    <section id={id}>
      <SectionHeader title={title} icon={icon} color={color} link={link} />
      <ContentGrid variant="media">
        {items.slice(0, maxItems).map((item, index) => (
          <div key={item.slug ?? index}>{renderItem(item, index)}</div>
        ))}
      </ContentGrid>
    </section>
  )
}
```

- [ ] **Step 2: Tighten hub spacing**

Update `MediaHubContent` wrapper spacing:

```tsx
return (
  <TracingBeam className="px-4 md:px-6">
    <div className="space-y-20 md:space-y-24 py-8">
      {sections.map((section) => (
        <MediaHubSection
          key={section.id}
          id={section.id}
          title={section.title}
          icon={section.icon}
          color={section.color}
          link={section.link}
          items={section.items}
          maxItems={section.maxItems}
          renderItem={section.renderItem}
        />
      ))}
    </div>
  </TracingBeam>
)
```

- [ ] **Step 3: Update hub links through route helpers**

In anime/komik hub components, replace hard-coded `/anime`, `/anime2`, `/komik/manga` style links with `animeHubRoute`, `animeListRoute`, `animeSearchRoute`, and `komikListRoute` from helpers.

Example import:

```ts
import { animeListRoute, animeSearchRoute } from "@/lib/utils/routes"
```

Example usage:

```ts
link: animeListRoute(source, "ongoing", 1)
```

- [ ] **Step 4: Run tests/lint**

```bash
bunx vitest run src/__tests__/layout/routes.test.ts src/__tests__/layout/navigation.test.tsx
bun run lint
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/media-hub-section.tsx src/components/shared/media-hub-content.tsx src/components/anime/anime-page-shell.tsx src/app/komik/komik-page-client.tsx
git commit -m "refactor: align media hub layouts"
```

---

## Task 9: Final verification and UI smoke test

**Files:**
- No planned source edits unless verification finds failures.

- [ ] **Step 1: Run full unit suite**

```bash
bun run test:run
```

Expected: all tests PASS.

- [ ] **Step 2: Run lint**

```bash
bun run lint
```

Expected: PASS with zero warnings.

- [ ] **Step 3: Run production build**

```bash
bun run build
```

Expected: build completes without TypeScript, route, or Next.js errors.

- [ ] **Step 4: Start dev server**

```bash
bun run dev
```

Expected: local app available at `http://localhost:3000`.

- [ ] **Step 5: Manual browser smoke paths**

Open and verify:

- `/`
- `/project`
- `/dashboard`
- `/anime/source-1`
- `/anime/source-2`
- `/anime2` redirects to `/anime/source-2`
- `/komik`
- `/komik/manga/1`
- `/komik/manhwa/1`
- `/komik/manhua/1`

Expected: layout renders, navbar works, theme toggle works, cards link to canonical routes, no console errors from route params.

- [ ] **Step 6: Commit verification fixes if needed**

If verification required source edits:

```bash
git add <changed-files>
git commit -m "fix: resolve frontend cleanup verification issues"
```

If no edits were needed, do not create an empty commit.
