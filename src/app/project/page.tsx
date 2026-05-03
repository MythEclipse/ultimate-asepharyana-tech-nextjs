import type { Metadata } from "next"

import { ProjectPageClient } from "./project-page-client"

export const metadata: Metadata = {
  title: "Projects | Asep Haryana Portfolio",
  description: "Explore my portfolio of projects including web applications, tools, and open source contributions built with Rust and modern frontend technologies.",
}

export default function ProjectPage() {
  return <ProjectPageClient />
}