import AnimeIndexPage from "@/components/anime/anime-index";

export const metadata = {
  title: "Anime Source 1 | Media Hub",
};

export default function AnimePage() {
  return <AnimeIndexPage source={1} />;
}
