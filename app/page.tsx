/*
  Revalidated hourly so the hero's "Competing now" badge is computed against a
  recent clock. It reads the fixture dates in a Server Component, so on a purely
  static build the label freezes at whatever it was when the site was deployed,
  which is exactly the stale-team-site failure the badge exists to avoid.
*/
export const revalidate = 3600;

import { Hero } from "@/components/hero";
import { HighlightsSection } from "@/components/highlights";
import { KitSection } from "@/components/kit";
import { InstagramSection } from "@/components/instagram";
import { RoadSection, TeamSection, ValuesSection, WorldsSection } from "@/components/sections";

export default function Home() {
  return (
    <>
      <Hero />
      <WorldsSection />
      <KitSection />
      <ValuesSection />
      <RoadSection />
      <HighlightsSection />
      <TeamSection />
      <InstagramSection />

      {/*
        Email capture is parked, not deleted. `components/follow.tsx` and
        `app/api/subscribe/route.ts` are both intact and working, including the
        no-JS form path and the provider webhook, so switching it back on is
        uncommenting this line and setting SUBSCRIBE_WEBHOOK_URL.

        <FollowSection />
      */}
    </>
  );
}
