/*
  The one way anything talks to Google Analytics.

  Everything queues onto `dataLayer` as an `arguments` object rather than
  calling `window.gtag`. Two reasons, and both have bitten this file already:

  - `window.gtag` does not exist until the inline snippet has run. A visitor who
    clicks Accept before that would have their choice dropped silently. The
    queue is created by the snippet and drained in order once gtag.js arrives,
    so an early call still counts.

  - `dataLayer.push(["consent", ...])` with an array literal is not the same as
    pushing `arguments`. The array form is not the shape gtag.js reads, which is
    the entire reason the official snippet defines a function whose only job is
    to forward `arguments`.
*/

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    dataLayer?: unknown[];
  }
}

function gtagPush(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as (...a: unknown[]) => void;
  gtag(...args);
}

/** Grant or revoke analytics storage. Everything else stays denied. */
export function setAnalyticsConsent(granted: boolean) {
  gtagPush("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
  });
}

/**
 * Report a page view.
 *
 * Sent by hand rather than by `config`, because `config` fires once per script
 * load and this is a single-page app: the App Router swaps routes with
 * `pushState` and never reloads the page, so a visitor who went from the home
 * page to the shop was recorded as having only ever seen the home page. The
 * shop page was invisible in reporting. `send_page_view: false` on the config
 * call turns off the automatic one so this is the only source and nothing is
 * counted twice.
 *
 * `page_location` is read from `window.location` rather than assembled from the
 * path, so query strings survive and campaign parameters still attribute.
 */
export function pageView() {
  if (typeof window === "undefined") return;
  gtagPush("event", "page_view", {
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.search,
    page_title: document.title,
  });
}
