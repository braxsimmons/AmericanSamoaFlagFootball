"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Reveals its children once they scroll into view.
 *
 * The hidden state lives in CSS behind a `.js` class rather than in inline
 * styles, so a browser without JavaScript — or one where a script failed —
 * shows the content instead of an empty page. See globals.css.
 *
 * One observer per element and it disconnects after firing: this runs on every
 * section of a long marketing page, and leaving dozens of live observers
 * attached to scroll is how a landing page starts to feel heavy on a phone.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  /** Milliseconds. Used to stagger siblings. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Already on screen at load — reveal without waiting for a scroll that
    // may never come on a short viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
