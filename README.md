# American Samoa National Flag Football

The web presence for the American Samoa national flag football team, the
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

The four values, **Fa'asāmoa**, **Laumei le Atua**, **One team / One island**,
**Play with heart**, are printed on the team's own jersey. They were not
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

**GoHighLevel**, create an Inbound Webhook trigger in a workflow and paste its
URL. The payload is:

```json
{ "email": "...", "name": "...", "source": "...", "submittedAt": "ISO-8601" }
```

**Google Sheet (fastest option, no CRM needed)**, in the Sheet choose
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
`stored: false`, so the form is testable before a provider is chosen, and
nothing can quietly believe an address was captured when it was not.

## Instagram feed

Instagram removed free *profile* feed embeds. There is no supported way to
render "the latest N posts from @amsnff_" without one of:

- **A third-party widget**, SnapWidget, LightWidget or Elfsight all have free
  tiers. Create one, copy its iframe `src`, and set it. This is the fastest path.
- **The Instagram Graph API**, needs a Business/Creator account, a linked
  Facebook Page, an app, and a long-lived token. More work, no third party.

```
NEXT_PUBLIC_INSTAGRAM_EMBED_URL=...
```

Without it the section renders two designed link-out cards to Instagram and
YouTube rather than fake post placeholders. That is deliberate: grey rectangles
pretending to be posts are the clearest "unfinished site" signal there is, and
both accounts are live and worth sending people to.

## Store

`/shop` renders a real page with a slot for a storefront. Set:

```
NEXT_PUBLIC_STORE_EMBED_URL=...
```

Works with any embeddable storefront, Shopify buy-button page, Fourthwall,
Printful, Big Cartel. Without it the page shows an honest "opening soon" state
that routes people to the email form instead of a dead end.

---

## Design notes

**Palette** is sampled from the team's jersey artwork, not invented: the navy and
red of the American Samoa flag, plus the gold of the fue and uatogi the eagle
carries. Deliberately no second accent, the jerseys get all their energy from
navy, white and one red.

**Type** is Barlow Condensed for anything set large and Barlow for anything read.
The jersey wordmark is tall, condensed and heavy; the type has to sit next to
that artwork without looking like a different project.

**The patterns** are the client's own supplied artwork. `scripts/knockout.mjs`
turns each black-on-white reference into a transparent PNG by using inverted
luminance as the alpha channel, ink becomes opaque, paper becomes transparent,
and the anti-aliased greys survive as partial alpha so edges stay smooth. They
are then used as CSS `mask-image` over `currentColor`, so one file serves navy,
red and bone without three copies.

Real artwork carries irregularities, a hand's line weight, motifs that do not
tile perfectly, that a generated pattern does not, and those irregularities are
most of why it reads as authentic rather than as decoration.

Only the thin divider bands in [`components/tatau.tsx`](components/tatau.tsx)
are still drawn in code, because a 360px raster cropped to a 12px strip cannot
stay crisp.

Re-run after replacing a source image:

```bash
node scripts/knockout.mjs
```

> **Before launch, two things.**
>
> **Licensing.** The supplied pattern images look like stock illustrations. If
> they were licensed, confirm the licence covers commercial web use. If not, the
> federation's kit supplier already owns finished artwork for these jerseys , 
> that is the better source.
>
> **Attribution.** Samoan tatau is earned through tā tatau and carries the
> wearer's rank and lineage. Whoever's pattern work ships here should be
> credited by name in the footer.

**Motion** is CSS behind a `.js` class added by an inline script before first
paint. Turn JavaScript off and every section is simply visible. The first build
of this site used a motion library whose `initial` state renders as inline
`opacity: 0` in the server HTML, with JS disabled the page was blank, including
the hero headline. Do not reintroduce that pattern.

`prefers-reduced-motion` removes every animation and transition.

---

## Assets still needed

- [ ] Team photography and match footage (hero currently runs on pattern alone)
- [ ] The squad, `ROSTER` in `lib/content.ts` renders an honest empty state
      rather than invented names, which is the worst thing a team site can carry
- [ ] A proper crest/logo file (the header crest is a placeholder redraw)
- [ ] Results from Düsseldorf as they land

## Email capture

Signups from the popup go to one webhook URL. The intended destination is a
Google Sheet, which needs no CRM, no service account and no dependency.

### Google Sheet setup

1. Make a Sheet. Anything; the script writes its own header row.
2. **Extensions → Apps Script**. Delete the placeholder and paste
   [`scripts/google-sheet-webhook.gs`](scripts/google-sheet-webhook.gs).
3. Change `TOKEN` at the top to a long random string. Keep it.
4. **Deploy → New deployment → Web app**, with:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**

   "Anyone" is required, because a server with no Google session has to POST to
   it. That is why the token exists: the deployment URL ends up in env vars and
   logs, so it is not a credential.
5. Copy the deployment URL.
6. In Vercel → Settings → Environment Variables, set both:

   ```
   SUBSCRIBE_WEBHOOK_URL=<the deployment URL>
   SUBSCRIBE_WEBHOOK_TOKEN=<the same string as TOKEN>
   ```

7. Redeploy. Env vars are read at runtime but a redeploy is the reliable way to
   pick them up.

Re-deploying the Apps Script after any edit issues a **new URL** unless you use
*Manage deployments → edit → new version*. Editing an existing deployment keeps
the URL; creating a new one silently leaves the site posting at the old script.

### What it does and does not do

The script de-duplicates on email, locks before appending so two simultaneous
signups cannot overwrite each other, and rejects anything without the token.

With no `SUBSCRIBE_WEBHOOK_URL` set the form still works and returns
`stored: false`, so nothing quietly believes an address was captured when it was
not.

Apps Script cannot return a status code: a rejected token and a successful
append both come back as HTTP 200 with the outcome in the body. The API route
reads `ok` out of the body for exactly this reason. Without that, a wrong token
would drop every address while the form said thank you.

### Switching to a CRM later

Point `SUBSCRIBE_WEBHOOK_URL` at the new inbound webhook. Nothing else changes;
the route was written provider-agnostic on purpose.
