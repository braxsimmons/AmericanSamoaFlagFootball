import Script from "next/script";

/**
 * Google Analytics 4.
 *
 * Rendered through `next/script` rather than raw `<script>` tags so Next
 * controls when it loads. `afterInteractive` means the tag fires once the page
 * is usable instead of competing with it: gtag.js is roughly 100KB of
 * third-party JavaScript, and blocking first paint on an analytics beacon
 * costs real visitors on the island connections this site is partly for.
 *
 * Only runs on the production deployment. Preview builds and localhost share
 * NODE_ENV=production, so gating on that alone would fold every test pageview
 * into the real numbers and quietly ruin the first month of data.
 *
 * NOTE, worth a decision before the tournament traffic lands: GA4 sets cookies
 * and sends IPs to Google. Under GDPR that needs consent from EU visitors, and
 * a German tournament means EU visitors. Vercel Analytics, already installed
 * here, is cookieless and does not. Options are a consent banner, or leaning on
 * Vercel Analytics and treating GA as a US-audience tool. Not something to
 * settle by accident, so it is written down rather than assumed.
 */
export function GoogleAnalytics({ id }: { id: string }) {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
