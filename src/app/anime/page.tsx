import type { Metadata } from "next"

import { AnimePageShell } from "@/components/anime/anime-page-shell"

export const metadata: Metadata = {
  title: "Anime | Asep Haryana Portfolio",
  description: "Watch anime online with high-quality streaming. Explore ongoing and completed anime series with the latest episodes.",
}

export default function AnimePage() {
  return <AnimePageShell source={1} />
}
