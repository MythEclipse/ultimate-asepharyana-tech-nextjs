import AnimeSearchPage from "../../anime/search/page"

export default function Page({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  return <AnimeSearchPage searchParams={searchParams} source={2} />
}
