import { fetchAnime2Stream } from "@/lib/api/anime";
import { AnimeStreamView } from "@/components/anime/anime-stream";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const data = await fetchAnime2Stream(slug);
    return { title: `Watching ${data.episode} | Anime Source 2` };
  } catch {
    return { title: "Episode Not Found" };
  }
}

export default async function Anime2WatchRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin" />
      </div>
    }>
      <Anime2StreamFetcher slug={slug} />
    </Suspense>
  );
}

async function Anime2StreamFetcher({ slug }: { slug: string }) {
  let data;
  try {
    data = await fetchAnime2Stream(slug);
  } catch {
    notFound();
  }
  return <AnimeStreamView data={data} source={2} />;
}
