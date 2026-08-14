/*
  Revalidated hourly so the hero's "Competing now" badge is computed against a
  recent clock. It reads the fixture dates in a Server Component, so on a purely
  static build the label freezes at whatever it was when the site was deployed —
  which is exactly the stale-team-site failure the badge exists to avoid.
*/
export const revalidate = 3600;

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
