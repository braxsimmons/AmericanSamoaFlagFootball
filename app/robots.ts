import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

/*
  Crawling is fully open. There is nothing here to hide, and the whole point of
  this site is that somebody searching "American Samoa flag football" finds the
  team rather than a third-party aggregator.

  The API route is excluded because it accepts POSTs and returns no content a
  crawler can use.
*/
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
