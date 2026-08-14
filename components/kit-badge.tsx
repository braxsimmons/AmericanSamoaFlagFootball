/**
 * The signature marker.
 *
 * Only one garment carries it: the jersey the squad actually played in at the
 * World Championship. That is a fact about the shirt, not a marketing tier, and
 * it stops meaning anything the moment it appears on the training tanks too.
 *
 * Not absolutely positioned over the photograph. A badge floating on the chest
 * of the render is the pattern every drop-shipping storefront uses, and it
 * covers the tatau, which is the part worth looking at.
 */
export function SignatureBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`display inline-flex items-center gap-2 border border-red/40 bg-red/10 px-3 py-1 text-xs tracking-[0.16em] text-red ${className}`}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-red" />
      Match worn
    </span>
  );
}
