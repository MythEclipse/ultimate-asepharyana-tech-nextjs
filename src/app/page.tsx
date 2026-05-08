import { ActivitySection } from "@/components/home/activity-section";
import { CallToActionSection } from "@/components/home/cta-section";
import { HeroSection } from "@/components/home/hero-section";
import { TechArsenal } from "@/components/home/tech-arsenal";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TechArsenal />
      <ActivitySection />
      <CallToActionSection />
    </>
  );
}
