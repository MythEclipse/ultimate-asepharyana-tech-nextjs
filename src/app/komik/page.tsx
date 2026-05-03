import type { Metadata } from "next"

import { KomikPageClient } from "./komik-page-client"

export const metadata: Metadata = {
  title: "Komik | Asep Haryana Portfolio",
  description: "Read komik online including manga, manhwa, and manhua. Free access to latest chapters updated daily.",
}

export default function KomikPage() {
  return <KomikPageClient />
}