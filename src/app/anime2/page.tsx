import { AnimeHubLoader } from "@/components/anime/anime-hub-loader"

export const dynamic = "force-dynamic"

export default function Page() {
  return <AnimeHubLoader source={2} />
}
