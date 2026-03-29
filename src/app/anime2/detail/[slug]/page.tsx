import AnimeDetailRoute from "../../../anime/detail/[slug]/page"

export default function Page({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  return <AnimeDetailRoute params={params} searchParams={Promise.resolve({ s: "2" })} />
}
