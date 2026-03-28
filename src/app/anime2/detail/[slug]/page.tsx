import { fetchAnime2Detail } from "@/lib/api/anime";
import { AnimeDetailView } from "@/components/anime/anime-detail";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const data = await fetchAnime2Detail(slug);
    return { title: `${data.title} | Anime Source 2` };
  } catch {
    return { title: "Anime Not Found" };
  }
}

export default async function Anime2DetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin" />
      </div>
    }>
      <Anime2DataFetcher slug={slug} />
    </Suspense>
  );
}

async function Anime2DataFetcher({ slug }: { slug: string }) {
  let data;
  try {
    data = await fetchAnime2Detail(slug);
  } catch {
    notFound();
  }
  return <AnimeDetailView data={data} source={2} />;
}
