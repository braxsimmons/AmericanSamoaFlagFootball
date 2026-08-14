import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

/*
  Email capture.

  Provider-agnostic: the destination is one env var holding a webhook URL, a
  GoHighLevel inbound webhook, a Google Apps Script bound to a Sheet, whatever
  the federation ends up using. Swapping providers is an env change, because the
  thing most likely to change about this form in the next year is where it
  points.

  Handles both a JSON fetch (JavaScript present) and a plain form POST
  (JavaScript absent). The no-JS path matters: without an `action` the browser
  falls back to a GET and puts the subscriber's email address in the URL, where
  it lands in history, referrer headers and server logs. That is a privacy leak
  dressed as a broken form.
*/

const WEBHOOK = process.env.SUBSCRIBE_WEBHOOK_URL;

const MAX_EMAIL = 254; // RFC 5321
const MAX_NAME = 120;
const MAX_BODY = 4_000;

/** Deliberately permissive. Rejecting a real address costs more than accepting a typo. */
function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(value);
}

/**
 * Addresses are never written to logs in full.
 *
 * A subscriber list is personal data, and Vercel's logs are retained, searchable
 * and visible to anyone with project access, a wider audience than the CRM the
 * address was given to. The hash is enough to correlate a support report with a
 * log line without the log itself being a copy of the mailing list.
 */
function pseudonym(email: string): string {
  return createHash("sha256").update(email).digest("hex").slice(0, 10);
}

/*
  Crude per-IP rate limiting.

  In-memory, so it resets on cold start and is per-instance, it will not stop a
  determined distributed flood. It stops the realistic case: one script hammering
  the endpoint and running up the CRM's bill. Anything stronger needs a shared
  store (Upstash, Vercel KV); noted rather than pretended.
*/
const HITS = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function overLimit(ip: string, now: number): boolean {
  const entry = HITS.get(ip);
  if (!entry || now > entry.resetAt) {
    HITS.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  // Unbounded growth would be its own problem on a long-lived instance.
  if (HITS.size > 5_000) HITS.clear();
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const now = Date.now();
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Whether the caller expects JSON back or a page to land on.
  const contentType = request.headers.get("content-type") ?? "";
  const isFormPost = contentType.includes("application/x-www-form-urlencoded");

  const reply = (status: number, body: Record<string, unknown>, hash?: string) => {
    if (!isFormPost) return NextResponse.json(body, { status });
    // No-JS path: land back on the page with a result in the query string.
    // Never the address itself.
    const outcome = status < 400 ? "ok" : "error";
    return NextResponse.redirect(
      new URL(`/?subscribed=${outcome}#follow`, request.url),
      { status: 303 },
    );
    void hash;
  };

  if (overLimit(ip, now)) {
    return reply(429, { error: "Too many attempts. Try again in a minute." });
  }

  let email = "";
  let name = "";
  let honeypot = "";

  try {
    if (isFormPost) {
      const form = await request.formData();
      email = String(form.get("email") ?? "");
      name = String(form.get("name") ?? "");
      honeypot = String(form.get("company") ?? "");
    } else {
      const raw = await request.text();
      if (raw.length > MAX_BODY) {
        return reply(413, { error: "That request was too large." });
      }
      const parsed: unknown = JSON.parse(raw);
      // `null` and `"a string"` are both valid JSON and neither has properties.
      if (typeof parsed !== "object" || parsed === null) {
        return reply(400, { error: "Send a JSON object." });
      }
      const body = parsed as Record<string, unknown>;
      email = typeof body.email === "string" ? body.email : "";
      name = typeof body.name === "string" ? body.name : "";
      honeypot = typeof body.honeypot === "string" ? body.honeypot : "";
    }
  } catch {
    return reply(400, { error: "We could not read that." });
  }

  // Bots fill every field they find. A human never sees this one. Answered as
  // though it worked, telling a bot it was caught only teaches it.
  if (honeypot.length > 0) return reply(200, { ok: true });

  email = email.trim().toLowerCase().slice(0, MAX_EMAIL);
  name = name.trim().slice(0, MAX_NAME);

  if (!email || !looksLikeEmail(email)) {
    return reply(400, { error: "That does not look like an email address." });
  }

  if (!WEBHOOK) {
    // No destination configured yet. Accepted so the form is testable before a
    // provider is chosen, but `stored: false` so nothing can quietly believe an
    // address was captured when it was not.
    console.warn(`[subscribe] No SUBSCRIBE_WEBHOOK_URL set. Dropped ${pseudonym(email)}`);
    return reply(200, { ok: true, stored: false });
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
      console.error(`[subscribe] Webhook ${response.status} for ${pseudonym(email)}`);
      return reply(502, { error: "We could not save that just now. Try again in a moment." });
    }

    return reply(200, { ok: true, stored: true });
  } catch (error) {
    console.error(`[subscribe] Failed for ${pseudonym(email)}:`, error);
    return reply(502, { error: "We could not save that just now. Try again in a moment." });
  }
}
