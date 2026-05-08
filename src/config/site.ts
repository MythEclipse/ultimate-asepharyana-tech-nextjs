import { IconCpu, IconDatabase, IconGlobe } from "@tabler/icons-react";

export const siteConfig = {
  name: "Asep Haryana Saputra",
  url: "https://ultimate-asepharyana.tech",
  ogImage: "https://ultimate-asepharyana.tech/og.png",
  description: "Crafting robust Backend systems with high-performance Frontend solutions to build seamless digital experiences.",
  links: {
    github: "https://github.com/MythEclipse",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    email: "superaseph@gmail.com",
  },
  mainNav: [
    { name: "Projects", link: "/project", icon: IconGlobe },
    { name: "Anime", link: "/anime", icon: IconCpu },
    { name: "Dashboard", link: "/dashboard", icon: IconDatabase },
  ],
};

export type SiteConfig = typeof siteConfig;
