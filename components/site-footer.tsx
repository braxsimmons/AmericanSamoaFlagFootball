import Link from "next/link";
import { NAV, TEAM } from "@/lib/content";
import { SpearRow } from "./tatau";

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-bone">
      <SpearRow className="h-3 w-full text-red" color="currentColor" flip />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="display text-3xl leading-none">
              Amerika Sāmoa
              <span className="block text-red">Flag Football</span>
            </p>
            <p className="mt-4 max-w-sm text-bone/55">
              The national flag football programme of American Samoa, run by the{" "}
              {TEAM.federation}.
            </p>
          </div>

          <div>
            <p className="display text-xs tracking-[0.24em] text-bone/45">Site</p>
            <ul className="mt-4 space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-bone/70 transition-colors hover:text-bone">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="display text-xs tracking-[0.24em] text-bone/45">Follow</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={TEAM.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-bone/70 transition-colors hover:text-bone"
                >
                  Instagram {TEAM.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-bone/12 pt-8 text-sm text-bone/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {TEAM.federation}. All rights reserved.</p>
          <p>Fa&apos;afetai for the support. Soifua.</p>
        </div>
      </div>
    </footer>
  );
}
