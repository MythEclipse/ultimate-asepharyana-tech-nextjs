import { fetchKomikDetail } from "@/lib/api/komik";
import { KomikDetailView } from "@/components/komik/komik-detail";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const data = await fetchKomikDetail(slug);
    return { title: `${data.title} | Komik Reader` };
  } catch {
    return { title: "Komik Not Found" };
  }
}

export default async function KomikDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-16 h-16 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
      </div>
    }>
      <KomikDataFetcher slug={slug} />
    </Suspense>
  );
}

async function KomikDataFetcher({ slug }: { slug: string }) {
  let data;
  try {
    data = await fetchKomikDetail(slug);
  } catch {
    notFound();
  }
  return <KomikDetailView data={data} />;
}
