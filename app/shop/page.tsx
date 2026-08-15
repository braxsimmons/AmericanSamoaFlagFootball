import type { Metadata } from "next";
import { ECWID_PRODUCTS } from "@/lib/content";
import { EcwidProducts } from "@/components/ecwid";
import { SpearRow, TatauField } from "@/components/tatau";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Official Team American Samoa flag football apparel. Every purchase supports the national programme.",
  alternates: { canonical: "/shop" },
};

/*
  The shop.

  Four live Ecwid products, not photographs of them. The kit renders that used
  to sit here were standing in for a store that did not exist; keeping them now
  would put two pictures of the same shirt on one page, one of which cannot be
  bought.

  The signature flag football jersey is gone from this page entirely. It is not
  one of the four products, so showing it here would advertise something the
  store does not sell.
*/
export default function ShopPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep pb-16 pt-36 text-bone sm:pt-44">
        <TatauField className="absolute inset-0 text-bone" opacity={0.08} />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
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
            The same navy, white and red the squad wears in Düsseldorf.
          </p>
        </div>
        <SpearRow className="absolute bottom-0 left-0 h-3 w-full text-red" />
      </section>

      <section className="bg-bone py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <EcwidProducts products={ECWID_PRODUCTS} />
          </div>
        </div>
      </section>

      <section className="bg-navy-deep py-14 text-bone sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="display text-3xl leading-tight sm:text-4xl">
              All proceeds go to the team.
            </p>
            <div className="mt-5 h-[3px] w-24 bg-red" />
            <p className="mt-5 max-w-xl leading-relaxed text-bone/70">
              Every order funds the national programme: travel, kit, and getting
              the next group of players off the island and onto the field.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
