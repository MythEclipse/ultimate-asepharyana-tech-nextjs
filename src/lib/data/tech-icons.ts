export interface TechIcon {
  name: string
  image: string
  color: string
}

export interface TechIcon {
  name: string
  image: string
  color: string
  description: string
}

export const TECH_STACK: TechIcon[] = [
  {
      name: "TypeScript",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      color: "from-blue-500 to-blue-600",
      description: "Type-safe architecture for reliable large-scale applications.",
  },
  {
      name: "Rust",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
      color: "from-orange-500 to-red-600",
      description: "Memory-safe system programming with high performance.",
  },
  {
      name: "Kotlin",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
      color: "from-purple-500 to-violet-600",
      description: "Modern JVM language for Android and backend development.",
  },
  {
      name: "JavaScript",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      color: "from-yellow-400 to-yellow-600",
      description: "Versatile web scripting for dynamic client and server UI.",
  },
  {
      name: "Java",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
      color: "from-red-500 to-orange-500",
      description: "Enterprise-grade services and scalable microservices.",
  },
  {
      name: "Python",
      image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
      color: "from-green-500 to-blue-500",
      description: "Productivity scripting and data-driven AI integration.",
  },
]
