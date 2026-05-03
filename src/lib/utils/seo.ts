import type { Metadata } from "next"

interface SeoParams {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: "website" | "article" | "profile"
  publishedTime?: string
  modifiedTime?: string
  tags?: string[]
  section?: string
}

const SITE_NAME = "Asep Haryana Portfolio"
const SITE_URL = "https://asepharyana.tech"
const DEFAULT_IMAGE = "/default.png"

export function createSeoMetadata({
  title,
  description = "Crafting robust Backend systems with high-performance Frontend solutions to build seamless digital experiences.",
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  section,
}: SeoParams): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL
  const fullImage = image.startsWith("http") ? image : `${SITE_URL}${image}`

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
      ...(tags && { tags }),
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  }
}

export function createPageMetadata(path: string): Metadata {
  const pages: Record<string, SeoParams> = {
    "/": {
      title: undefined,
      type: "website",
    },
    "/anime": {
      title: "Anime",
      description: "Watch anime online with high-quality streaming. Explore ongoing and completed anime series.",
    },
    "/komik": {
      title: "Komik",
      description: "Read komik online including manga, manhwa, and manhua. Free access to latest chapters.",
    },
    "/project": {
      title: "Projects",
      description: "Explore my portfolio of projects including web applications, tools, and open source contributions.",
    },
    "/dashboard": {
      title: "Dashboard",
      description: "Personal dashboard for managing your account and preferences.",
    },
    "/settings": {
      title: "Settings",
      description: "Manage your account settings and preferences.",
    },
  }

  const pageConfig = pages[path] || { description: undefined }

  return createSeoMetadata(pageConfig)
}