import { describe, expect, it } from "vitest"

import { siteConfig } from "@/config/site"
import { MEDIA_PROJECTS } from "@/lib/data/projects"

describe("site navigation", () => {
  it("shows only Home, Projects, and Dashboard in the primary nav", () => {
    expect(siteConfig.mainNav.map((item) => [item.name, item.link])).toEqual([
      ["Home", "/"],
      ["Projects", "/project"],
      ["Dashboard", "/dashboard"],
    ])
  })

  it("keeps media destinations out of the primary nav", () => {
    expect(siteConfig.mainNav.map((item) => item.link)).not.toEqual(
      expect.arrayContaining(["/anime", "/anime2", "/komik"]),
    )
  })

  it("exposes media routes from the project hub", () => {
    expect(MEDIA_PROJECTS.map((project) => project.link)).toEqual(["/anime", "/anime2", "/komik"])
  })
})
