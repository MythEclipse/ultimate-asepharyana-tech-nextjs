
import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ProjectPageClient } from "@/app/project/project-page-client"
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
    expect(MEDIA_PROJECTS.map((project) => project.link)).toEqual(["/anime/source-1", "/anime/source-2", "/komik"])
  })

  it("keeps project hub media cards without a small section title", () => {
    render(<ProjectPageClient />)

    expect(screen.queryByText("Media Apps")).not.toBeInTheDocument()
    expect(screen.queryByText("Explore Anime and Komik")).not.toBeInTheDocument()
    expect(screen.getByText("Anime Streaming")).toBeInTheDocument()
    expect(screen.getByText("Anime Archive")).toBeInTheDocument()
    expect(screen.getByText("Komik Reader")).toBeInTheDocument()
  })
})
