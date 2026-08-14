import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/google-analytics";
import { GA_MEASUREMENT_ID, SITE_URL, TEAM } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/*
  Barlow Condensed for anything set large, Barlow for everything read.

  Chosen against the jersey: the wordmark on the shirt is tall, condensed and
  heavy, and the type has to sit next to that artwork without looking like a
  different project. The scaffold default (Geist) is a fine typeface and an
  instant tell that nobody chose it.
*/
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://americansamoaflagfootball.com"),
  title: {
    default: "American Samoa National Flag Football",
    template: "%s · American Samoa Flag Football",
  },
  description:
    "The American Samoa national flag football team. First-ever IFAF World Championship berth, won 41–34 over China. Group A in Düsseldorf, 13–16 August 2026.",
  openGraph: {
    title: "American Samoa National Flag Football",
    description:
      "A first world championship, won on the field. Group A in Düsseldorf, 13–16 August 2026.",
    type: "website",
    locale: "en_AS",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // `suppressHydrationWarning` is required here, not a smell: the inline
    // script below adds a `js` class to <html> before React hydrates, so React
    // finds an attribute it did not render. Scoped to this one element.
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Runs before first paint, so the reveal styles apply without a flash of
          fully-visible content collapsing. Without JavaScript this class is
          never added and every section renders plainly visible, which is the
          point: the page must not depend on a script to have content.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className={`${barlow.variable} ${barlowCondensed.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-navy focus:px-4 focus:py-2 focus:text-bone"
        >
          Skip to content
        </a>
        {/*
          Schema.org SportsTeam. This is what lets a search engine understand
          that the page is about an organisation rather than merely mentioning
          one, and it is the difference between a plain blue link and a result
          carrying the crest and the socials.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsTeam",
              name: "American Samoa National Flag Football Team",
              alternateName: ["ASNFF", "Amerika Samoa Flag Football"],
              sport: "Flag football",
              url: SITE_URL,
              logo: `${SITE_URL}/media/asnff-crest.png`,
              image: `${SITE_URL}/opengraph-image.png`,
              description:
                "The national flag football team of American Samoa. First ever IFAF World Championship berth, qualified by beating China 41 to 34 in Ningbo.",
              sameAs: [TEAM.instagram, TEAM.youtube],
              parentOrganization: {
                "@type": "SportsOrganization",
                name: "American Samoa National Football Federation",
              },
              memberOf: {
                "@type": "SportsOrganization",
                name: "International Federation of American Football",
                alternateName: "IFAF",
              },
              location: {
                "@type": "Place",
                name: "American Samoa",
                address: { "@type": "PostalAddress", addressCountry: "AS" },
              },
            }),
          }}
        />

        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />

        {/*
          First-party analytics: served from this domain, no third-party
          cookies, nothing to consent to under GDPR/ePrivacy, and not blocked by
          the ad blockers a lot of the audience runs. Speed Insights reports
          real Core Web Vitals from actual visitors, which is what Google ranks
          on rather than a lab score.
        */}
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics id={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
