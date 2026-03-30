import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { Section } from "@/components/ui/section"
import { TECH_STACK } from "@/lib/data/tech-icons"

export function TechArsenal() {
  return (
    <Section className="py-24 w-full" glow>
      <div className="mb-16 text-center lg:text-left">
        <Badge variant="glass" className="mb-4">
          Capabilities
        </Badge>
        <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">
          Technology <span className="text-primary">Stack</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl text-lg mx-auto lg:mx-0">
          Tools and frameworks used for building maintainable, production-ready applications.
        </p>
      </div>

      <BentoGrid className="w-full">
        {TECH_STACK.slice(0, 6).map((item, index) => (
          <BentoGridItem
            key={item.name}
            title={item.name}
            description={item.description}
            header={
              <div className="group/header h-full w-full min-h-[10rem] rounded-2xl glass border-hairline flex items-center justify-center p-8 transition-all hover:bg-foreground/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/header:opacity-100 transition-opacity" />
                <Image
                  src={item.image}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain filter drop-shadow-2xl group-hover:scale-125 transition-transform duration-500"
                />
              </div>
            }
            className={index === 0 || index === 3 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>
    </Section>
  )
}
