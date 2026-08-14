"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

/*
  The hero carousel.

  Built on native scroll-snap rather than on transforms. The track is a real
  horizontally scrolling list, which means:

  - It works with scripting off. Every slide is reachable by swiping or
    dragging, and the first is visible without touching anything. Only the dots
    and arrows need JavaScript, and they are hidden without it (globals.css)
    rather than left on the page as dead buttons.

  - Touch is the browser's, not ours. Momentum, rubber-banding and the feel of a
    half-swipe snapping back are all native, and no hand-written drag handler
    gets those right.

  The script's job is only to report which slide is showing, and to scroll on
  demand. It never owns the position.
*/

export interface Slide {
  src: string;
  /** Never rendered as visible text. Alt is for people who cannot see the photo. */
  alt: string;
}

const W = 1600;
const H = 1317;

/** Long enough to take a photograph in. Shorter and it feels like a slideshow. */
const ADVANCE_MS = 6500;

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  // Auto-advance stops for good on the first deliberate interaction. Something
  // that keeps moving after being told where to go is the single most annoying
  // thing a carousel does.
  const [auto, setAuto] = useState(true);

  const goTo = useCallback((i: number, smooth = true) => {
    const el = track.current;
    if (!el) return;
    const slide = el.children[i] as HTMLElement | undefined;
    if (!slide) return;
    el.scrollTo({ left: slide.offsetLeft, behavior: smooth ? "smooth" : "auto" });
  }, []);

  // Report the visible slide from the scroll position rather than tracking it
  // in state, so a swipe, a keypress and a dot click all agree.
  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = Number((entry.target as HTMLElement).dataset.index);
            setIndex(i);
          }
        }
      },
      { root: el, threshold: 0.6 },
    );

    for (const child of Array.from(el.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [slides.length]);

  useEffect(() => {
    if (!auto || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      // Read the index off the ref rather than the closure, so the interval
      // does not need re-creating on every slide change.
      const el = track.current;
      if (!el) return;
      const current = Math.round(el.scrollLeft / el.clientWidth);
      goTo((current + 1) % slides.length);
    }, ADVANCE_MS);

    return () => window.clearInterval(id);
  }, [auto, slides.length, goTo]);

  const stop = useCallback(() => setAuto(false), []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      stop();
      const next = e.key === "ArrowRight" ? index + 1 : index - 1;
      goTo((next + slides.length) % slides.length);
    },
    [index, slides.length, goTo, stop],
  );

  return (
    <div
      className="group/carousel relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="The squad in Düsseldorf"
      onMouseEnter={() => setAuto(false)}
      onFocusCapture={() => setAuto(false)}
      onTouchStart={stop}
      onKeyDown={onKeyDown}
    >
      <ul
        ref={track}
        className="carousel-track flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
        // Focusable so arrow keys work without a pointer. A scrolling region
        // needs this anyway for keyboard users.
        tabIndex={0}
        aria-live="polite"
      >
        {slides.map((slide, i) => (
          <li
            key={slide.src}
            data-index={i}
            className="w-full shrink-0 snap-center"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
          >
            <div className="relative overflow-hidden border border-bone/15">
              <Image
                src={slide.src}
                alt={slide.alt}
                width={W}
                height={H}
                sizes="(min-width: 1024px) 40rem, 92vw"
                // Only the first is above the fold; the rest would compete with
                // it for bandwidth on the load that matters.
                priority={i === 0}
                className="h-auto w-full"
              />
              {/*
                A light wash only, to settle the photograph into the navy around
                it. The heavier bottom ramp that used to be here existed to carry
                a caption; with the captions gone it was just darkening the
                players' legs for no reason.
              */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/30 to-transparent"
              />
            </div>
          </li>
        ))}
      </ul>

      {slides.length > 1 ? (
        <div className="carousel-controls mt-4 items-center gap-4">
          <div className="flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => {
                  stop();
                  goTo(i);
                }}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-7 bg-red" : "w-3 bg-bone/30 hover:bg-bone/60"
                }`}
              />
            ))}
          </div>

          <span className="display ml-auto text-xs tabular-nums tracking-[0.18em] text-bone/45">
            {index + 1} / {slides.length}
          </span>
        </div>
      ) : null}
    </div>
  );
}
