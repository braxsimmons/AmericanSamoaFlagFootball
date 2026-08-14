import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

/*
  Real pages only. Listing anchors as separate URLs is a common trick and a bad
  one: they are the same document, so it dilutes rather than adds. The squad
  page earns its entry by being a page.
*/
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    // Above the shop: the player names are what people search for, and the
    // shop has nothing to sell until Ecwid is connected.
    { url: `${SITE_URL}/squad`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}
