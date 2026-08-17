import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

/*
  Two real pages. Listing anchors as separate URLs is a common trick and a bad
  one: they are the same document, so it dilutes rather than adds.
*/
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    // Above the shop while the coverage is fresh: this is the page journalists
    // and search traffic are arriving for this week.
    { url: `${SITE_URL}/press`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}
