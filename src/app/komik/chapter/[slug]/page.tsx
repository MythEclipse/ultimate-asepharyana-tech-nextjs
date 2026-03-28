import { fetchChapter } from "@/lib/api/komik";
import { KomikChapterView } from "@/components/komik/komik-chapter";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const data = await fetchChapter(decodedSlug);
    return { title: `${data.title} | Komik Reader` };
  } catch {
    return { title: "Chapter Not Found" };
  }
}

export default async function KomikChapterRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <KomikChapterFetcher slug={slug} />
    </Suspense>
  );
}

async function KomikChapterFetcher({ slug }: { slug: string }) {
  let data;
  try {
    const decodedSlug = decodeURIComponent(slug);
    data = await fetchChapter(decodedSlug);
  } catch {
    notFound();
  }
  return <KomikChapterView data={data} />;
}
