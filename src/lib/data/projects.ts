export interface Project {
  id: string
  title: string
  description: string
  image: string
  category: string
  tags: string[]
  link: string
  colorClass: string
}

export const FEATURED_PROJECTS: Project[] = [
  {
      id: "01",
      title: "Rust Infrastructure",
      description: "Backend API system yang dibangun menggunakan framework Axum dan ORM SeaORM di Rust.",
      image: "/project-rust.png",
      category: "Backend",
      tags: ["Rust", "Axum", "SeaORM"],
      link: "/project",
      colorClass: "text-primary",
  },
  {
      id: "02",
      title: "Elysia Discovery",
      description: "Layanan REST API yang dibuat berfokus pada kecepatan menggunakan ElysiaJS dan runtime Bun.",
      image: "/project-elysia.png",
      category: "API",
      tags: ["Bun", "ElysiaJS", "OpenAPI"],
      link: "/project",
      colorClass: "text-accent",
  },

  {
      id: "04",
      title: "Anime Streaming",
      description: "Aplikasi penampil video anime yang mengambil (scrape) data rilis terbaru dari Otakudesu.",
      image: "/project-anime.png",
      category: "Otakudesu",
      tags: ["Video", "Streaming", "Scraper"],
      link: "/anime",
      colorClass: "text-blue-400",
  },
  {
      id: "05",
      title: "Anime Archive",
      description: "Situs arsip dan pencarian database anime yang memanfaatkan parsing dari situs Alqanime.",
      image: "/project-anime2.png", // NOTE: update image path if needed
      category: "Alqanime",
      tags: ["Archive", "Search", "Index"],
      link: "/anime2",
      colorClass: "text-cyan-400",
  },
  {
      id: "06",
      title: "Komik Reader",
      description: "Aplikasi baca komik dan manga berbasis web yang membaca chapter terindeks dari Komiku.",
      image: "/project-komik.png",
      category: "Komiku",
      tags: ["Manga", "Reader", "High-Res"],
      link: "/komik",
      colorClass: "text-orange-400",
  },
]
