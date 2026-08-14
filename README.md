# American Samoa National Flag Football

The web presence for the American Samoa national flag football team — the
territory's first-ever IFAF World Championship side.

Instagram: [@amsnff_](https://www.instagram.com/amsnff_/)

---

## Why the content says what it says

Every factual claim on this site is sourced. That is deliberate: the fastest way
to make a site feel machine-assembled is to fill it with plausible-sounding
nothing. "Empowering athletes to reach their potential" is what a template says.
"Beat China 41–34 in Ningbo to qualify" is what a team says.

| Claim | Source |
| --- | --- |
| Beat China 41–34 in the third-place playoff, Ningbo, Oct 2025 | [American Football International](https://www.americanfootballinternational.com/ifaf-world-flag-2026-mens-group-a-united-states-australia-israel-american-samoa) |
| First-ever IFAF World Championship berth | [IFAF](https://www.americanfootball.sport/2025/11/25/groups-announced-for-2026-ifaf-world-flag-in-dusseldorf/) |
| Entered IFAF World Rankings at #33 | American Football International |
| Worlds: Düsseldorf, 13–16 August 2026 | [Olympics.com](https://www.olympics.com/en/news/2026-ifaf-flag-football-world-championships-top-teams-tournament-format-how-to-watch-olympic-qualifier-live) |
| Group A: USA, Australia, Israel, American Samoa | IFAF |
| LA28 Olympic quota places on the line | Olympics.com |

The four values — **Fa'asāmoa**, **Laumei le Atua**, **One team / One island**,
**Play with heart** — are printed on the team's own jersey. They were not
written for a website.

All of it lives in [`lib/content.ts`](lib/content.ts) so the federation can
correct a score or add a fixture without touching a component.

---

## Setup

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Email capture

The form posts to `/api/subscribe`, which forwards to a single webhook URL. It is
provider-agnostic on purpose: the thing most likely to change about this form in
the next year is where it points.

Set one environment variable:

```
SUBSCRIBE_WEBHOOK_URL=...
```

**GoHighLevel** — create an Inbound Webhook trigger in a workflow and paste its
URL. The payload is:

```json
{ "email": "...", "name": "...", "source": "...", "submittedAt": "ISO-8601" }
```

**Google Sheet (fastest option, no CRM needed)** — in the Sheet choose
*Extensions → Apps Script*, paste this, then *Deploy → New deployment → Web app*,
execute as yourself, access "Anyone". Paste the resulting `/exec` URL:

```js
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow([
    new Date(), data.email, data.name || "", data.source || ""
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

With no variable set the endpoint accepts submissions, logs them, and returns
`stored: false` — so the form is testable before a provider is chosen, and
nothing can quietly believe an address was captured when it was not.

## Store

`/shop` renders a real page with a slot for a storefront. Set:

```
NEXT_PUBLIC_STORE_EMBED_URL=...
```

Works with any embeddable storefront — Shopify buy-button page, Fourthwall,
Printful, Big Cartel. Without it the page shows an honest "opening soon" state
that routes people to the email form instead of a dead end.

---

## Design notes

**Palette** is sampled from the team's jersey artwork, not invented: the navy and
red of the American Samoa flag, plus the gold of the fue and uatogi the eagle
carries. Deliberately no second accent — the jerseys get all their energy from
navy, white and one red.

**Type** is Barlow Condensed for anything set large and Barlow for anything read.
The jersey wordmark is tall, condensed and heavy; the type has to sit next to
that artwork without looking like a different project.

**The tatau motifs** in [`components/tatau.tsx`](components/tatau.tsx) are
hand-drawn SVG — spearhead rows, chevron fields, a ring of teeth. A repeating
vector stays crisp full-bleed at any size and costs a few hundred bytes, but the
real reason is that a generic decorative blur is exactly what makes a site feel
machine-assembled.

> **Before launch:** these are respectful geometric motifs in the spirit of the
> jersey artwork, not reproductions of any specific pe'a or malu. Samoan tatau
> carries meaning earned by the wearer. They should be reviewed by the team, and
> ideally redrawn by a Samoan designer who can make them say something specific
> rather than merely look right.

**Motion** is CSS behind a `.js` class added by an inline script before first
paint. Turn JavaScript off and every section is simply visible. The first build
of this site used a motion library whose `initial` state renders as inline
`opacity: 0` in the server HTML — with JS disabled the page was blank, including
the hero headline. Do not reintroduce that pattern.

`prefers-reduced-motion` removes every animation and transition.

---

## Assets still needed

- [ ] Team photography and match footage (hero currently runs on pattern alone)
- [ ] The squad — `ROSTER` in `lib/content.ts` renders an honest empty state
      rather than invented names, which is the worst thing a team site can carry
- [ ] A proper crest/logo file (the header crest is a placeholder redraw)
- [ ] Results from Düsseldorf as they land
