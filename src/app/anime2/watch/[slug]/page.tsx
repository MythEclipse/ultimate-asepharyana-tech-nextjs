import AnimeWatchRoute from "../../../anime/watch/[slug]/page"

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <AnimeWatchRoute params={params} source={2} />
}
