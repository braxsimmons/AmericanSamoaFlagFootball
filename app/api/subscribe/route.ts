import { NextResponse } from "next/server";

/*
  Email capture.

  Deliberately provider-agnostic. The destination is a single env var holding a
  webhook URL — a GoHighLevel inbound webhook, a Google Apps Script bound to a
  Sheet, Mailchimp, whatever the federation ends up using. Swapping providers
  is an env change and a redeploy, not a code change, because the thing most
  likely to change about this form in the next year is where it points.

  Set SUBSCRIBE_WEBHOOK_URL in Vercel. See README for the Apps Script snippet
  that turns a Google Sheet into a valid endpoint in about two minutes.
*/

const WEBHOOK = process.env.SUBSCRIBE_WEBHOOK_URL;

/** Deliberately permissive. Rejecting a real address costs more than accepting a typo. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value);
}

export async function POST(request: Request) {
  let payload: { email?: unknown; name?: unknown; honeypot?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Send JSON." }, { status: 400 });
  }

  // Bots fill every field they find. A human never sees this one.
  if (typeof payload.honeypot === "string" && payload.honeypot.length > 0) {
    // Answer as though it worked — telling a bot it was caught only teaches it.
    return NextResponse.json({ ok: true });
  }

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const name = typeof payload.name === "string" ? payload.name.trim().slice(0, 120) : "";

  if (!email || !looksLikeEmail(email)) {
    return NextResponse.json(
      { error: "That does not look like an email address." },
      { status: 400 },
    );
  }

  if (!WEBHOOK) {
    /*
      No destination configured yet. Logged and accepted rather than failing,
      so the form is testable before the federation has picked a CRM — but it
      returns `stored: false`, so nothing can quietly believe an address was
      captured when it was not.
    */
    console.warn(`[subscribe] No SUBSCRIBE_WEBHOOK_URL set. Dropping: ${email}`);
    return NextResponse.json({ ok: true, stored: false });
  }

  try {
    const response = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        source: "americansamoaflagfootball.com",
        submittedAt: new Date().toISOString(),
      }),
      // A slow CRM must not hold a supporter's browser open.
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error(`[subscribe] Webhook returned ${response.status} for ${email}`);
      return NextResponse.json(
        { error: "We could not save that just now. Try again in a moment." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, stored: true });
  } catch (error) {
    // The address is logged so it is recoverable from Vercel's logs rather
    // than lost entirely when a provider has an outage.
    console.error(`[subscribe] Failed for ${email}:`, error);
    return NextResponse.json(
      { error: "We could not save that just now. Try again in a moment." },
      { status: 502 },
    );
  }
}
