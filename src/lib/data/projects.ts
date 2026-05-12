export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  link: string;
}

export const FEATURED_PROJECTS: Project[] = [
  {
    id: '01',
    title: 'Rust Infrastructure',
    description:
      'Backend API system yang dibangun menggunakan framework Axum dan ORM SeaORM di Rust.',
    image: '/project-rust.png',
    category: 'Backend',
    tags: ['Rust', 'Axum', 'SeaORM'],
    link: 'https://rust.asepharyana.tech/docs/',
  },
  {
    id: '02',
    title: 'Elysia Discovery',
    description:
      'Layanan REST API yang dibuat berfokus pada kecepatan menggunakan ElysiaJS dan runtime Bun.',
    image: '/project-elysia.png',
    category: 'API',
    tags: ['Bun', 'ElysiaJS', 'OpenAPI'],
    link: 'https://elysia.asepharyana.tech/docs/',
  },

];

export const MEDIA_PROJECTS: Project[] = [
  {
    id: 'media-01',
    title: 'Anime Streaming',
    description:
      'Aplikasi penampil video anime yang mengambil data rilis terbaru dari Otakudesu.',
    image: '/project-anime.png',
    category: 'Otakudesu',
    tags: ['Video', 'Streaming', 'Scraper'],
    link: '/anime/source-1',
  },
  {
    id: 'media-02',
    title: 'Anime Archive',
    description:
      'Situs arsip dan pencarian database anime yang memanfaatkan parsing dari Alqanime.',
    image: '/project-anime2.png',
    category: 'Alqanime',
    tags: ['Archive', 'Search', 'Index'],
    link: '/anime/source-2',
  },
  {
    id: 'media-03',
    title: 'Komik Reader',
    description:
      'Aplikasi baca komik dan manga berbasis web untuk chapter terindeks dari Komiku.',
    image: '/project-komik.png',
    category: 'Komiku',
    tags: ['Manga', 'Reader', 'High-Res'],
    link: '/komik',
  },
];
