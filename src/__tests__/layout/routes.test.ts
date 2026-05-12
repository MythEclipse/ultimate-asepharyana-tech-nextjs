
import { describe, expect, it } from "vitest"

import { getKomikCategoryConfig, komikListRoute, parseKomikCategoryParam } from "@/lib/utils/komik-routes"
import {
  animeCanonicalPrefix,
  animeDetailRoute,
  animeHubRoute,
  animeListRoute,
  animeSearchRoute,
  animeWatchRoute,
  parseAnimeSourceParam,
} from "@/lib/utils/routes"

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
