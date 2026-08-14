import { Hero } from "@/components/hero";
import { FollowSection } from "@/components/follow";
import { RoadSection, TeamSection, ValuesSection, WorldsSection } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <WorldsSection />
      <ValuesSection />
      <RoadSection />
      <TeamSection />
      <FollowSection />
    </>
  );
}
