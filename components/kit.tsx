import Image from "next/image";
import Link from "next/link";
import { KIT } from "@/lib/content";
import { BandStack } from "./tatau";
import { Reveal } from "./reveal";

/**
 * The kit band.
 *
 * Every card is a link to the shop. Nothing here is a product listing with a
 * price, because the store is not open yet and inventing one would be a lie a
 * visitor discovers at checkout. What it does is show the shirt, which is the
 * part that makes somebody want it.
 */
export function KitSection() {
  return (
    <section id="kit" className="relative overflow-hidden bg-bone py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display display-balanced max-w-2xl text-5xl text-navy-deep sm:text-6xl">
              What the squad
              <span className="block text-red">wears in Düsseldorf</span>
            </h2>

            <Link
              href="/shop"
              className="display group inline-flex h-12 items-center gap-3 border border-navy/25 px-5 text-sm tracking-[0.14em] text-navy transition-all duration-200 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:border-navy hover:bg-navy hover:text-bone"
            >
              Shop our merch
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
          </div>
        </Reveal>

        <ul className="mt-14 grid gap-8 sm:grid-cols-2">
          {KIT.slice(1, 3).map((item, i) => (
            <Reveal as="li" key={item.id} delay={i * 90} className="block">
              <Link href="/shop" className="group block">
                <div className="overflow-hidden border border-navy/15 bg-white">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={1400}
                    height={1122}
                    sizes="(min-width: 640px) 34rem, 90vw"
                    className="h-auto w-full transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <div>
                    <p className="display text-2xl text-navy-deep transition-colors group-hover:text-red">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-navy/70">{item.detail}</p>
                  </div>
                  <span className="display shrink-0 text-sm tracking-[0.14em] text-red">
                    Shop
                    <span
                      aria-hidden
                      className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>

      <BandStack className="mt-20 w-full text-navy/20" motifs={["spear", "comb"]} />
    </section>
  );
}
