import type { Metadata } from "next";
import Image from "next/image";
import { KIT, KIT_H, KIT_W, TEAM } from "@/lib/content";
import { SignatureBadge } from "@/components/kit-badge";
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
  // Ecwid store id. Just the number, e.g. 12345678.
  const storeId = process.env.NEXT_PUBLIC_ECWID_STORE_ID;

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
            The same navy, white and red the squad wears in Düsseldorf. Every
            purchase goes back into the national programme, travel, kit, and
            getting the next group of players off the island and onto the field.
          </p>
        </div>
        <SpearRow className="absolute bottom-0 left-0 h-3 w-full text-red" />
      </section>

      {/*
        The lookbook. Every kit, large, before anybody is asked to buy.

        The signature jersey spans the full width and the rest pair off beneath
        it. Five items in a two-column grid leaves one orphaned in the last row,
        and the odd one out reads as an afterthought rather than as the thing
        the team actually played in.
      */}
      <section className="bg-bone py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <ul className="grid gap-10 sm:grid-cols-2">
            {KIT.map((item) => (
              <li key={item.id} className={item.signature ? "sm:col-span-2" : undefined}>
                <div className="overflow-hidden border border-navy/15 bg-white">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={KIT_W}
                    height={KIT_H}
                    sizes={
                      item.signature
                        ? "(min-width: 1280px) 76rem, 92vw"
                        : "(min-width: 640px) 34rem, 90vw"
                    }
                    priority={item.signature}
                    className="h-auto w-full"
                  />
                </div>
                {item.signature ? <SignatureBadge className="mt-5" /> : null}
                <p
                  className={`display text-navy-deep ${
                    item.signature ? "mt-3 text-3xl sm:text-4xl" : "mt-4 text-2xl"
                  }`}
                >
                  {item.name}
                </p>
                <p className="mt-1 text-sm text-navy/70">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-bone pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {storeId ? (
            <>
              {/*
                Ecwid mounts into a div and is driven by a store-specific script,
                rather than by an iframe. `defer` so it never blocks first paint,
                and the mount point is rendered server-side so the layout does
                not jump when the script arrives.
              */}
              <div id={`my-store-${storeId}`} />
              <script
                data-cfasync="false"
                src={`https://app.ecwid.com/script.js?${storeId}&data_platform=code&data_date=2026-08-14`}
                defer
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `xProductBrowser("categoriesPerRow=3","views=grid(3,3) list(10) table(20)","categoryView=grid","searchView=list","id=my-store-${storeId}");`,
                }}
              />
            </>
          ) : (
            <div className="border border-dashed border-navy/25 bg-white/60 p-12 text-center">
              <h2 className="display text-3xl text-navy-deep">Store opening soon</h2>
              <p className="mx-auto mt-4 max-w-lg leading-relaxed text-navy/70">
                Everything above is what the squad is wearing in Düsseldorf.
                Ordering opens here shortly.
              </p>
              <p className="mt-8 text-xs text-navy/65">
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
