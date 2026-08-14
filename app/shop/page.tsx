import type { Metadata } from "next";
import Link from "next/link";
import { TEAM } from "@/lib/content";
import { SpearRow, TatauField } from "@/components/tatau";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Official Team American Samoa flag football apparel. Every purchase supports the national programme.",
};

/*
  The shop.

  Built as a real page with a clearly marked slot rather than a "coming soon"
  holding page, so dropping in a Shopify buy-button, a Printful embed or a
  Fourthwall storefront is a single paste with no layout work. The surrounding
  copy, header and footer are already right.

  See README for exactly where each provider's snippet goes.
*/
export default function ShopPage() {
  const embed = process.env.NEXT_PUBLIC_STORE_EMBED_URL;

  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep pb-16 pt-36 text-bone sm:pt-44">
        <TatauField className="absolute inset-0 text-bone" opacity={0.08} />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="h-[2px] w-10 bg-red" />
            <span className="display text-xs tracking-[0.3em] text-red">Official apparel</span>
          </div>
          {/*
            Not "wear the tatau". A tatau is earned through tā tatau and carries
            the wearer's rank and lineage, it is not something bought. Using it
            as an apparel slogan, over motifs that are an approximation of it,
            was the most appropriative thing on this site. The jersey's own words
            say the intended thing without the claim.
          */}
          <h1 className="display display-balanced mt-5 max-w-3xl text-6xl sm:text-7xl">
            Represent
            <span className="block text-red">with pride</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone/70">
            The same navy, white and red the squad wears in Düsseldorf. Every
            purchase goes back into the national programme, travel, kit, and
            getting the next group of players off the island and onto the field.
          </p>
        </div>
        <SpearRow className="absolute bottom-0 left-0 h-3 w-full text-red" />
      </section>

      <section className="bg-bone py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {embed ? (
            <div className="overflow-hidden border border-navy/10 bg-white">
              {/* The storefront. Sandboxed, and titled for screen readers. */}
              <iframe
                src={embed}
                title="Team American Samoa official store"
                className="h-[1200px] w-full"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          ) : (
            <div className="border border-dashed border-navy/25 bg-white/60 p-12 text-center">
              <h2 className="display text-3xl text-navy-deep">Store opening soon</h2>
              <p className="mx-auto mt-4 max-w-lg leading-relaxed text-navy/60">
                Jerseys, training tees and sideline wear are on the way. Put your
                email in on the home page and we will tell you the day it opens.
              </p>
              <Link
                href="/#follow"
                className="display mt-8 inline-flex h-14 items-center bg-red px-8 text-lg tracking-[0.1em] text-bone transition-transform duration-200 hover:-translate-y-0.5"
              >
                Tell me when it opens
              </Link>
              <p className="mt-10 text-xs text-navy/65">
                Following the team in the meantime:{" "}
                <a
                  href={TEAM.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-red underline underline-offset-4"
                >
                  {TEAM.instagramHandle}
                </a>
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
