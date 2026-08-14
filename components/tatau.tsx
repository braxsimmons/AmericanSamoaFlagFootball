/*
  Tatau-inspired geometry.

  Hand-drawn SVG rather than a stock texture or a gradient, for two reasons.
  The practical one: a repeating vector band stays crisp full-bleed at any
  size and costs a few hundred bytes. The real one: a generic decorative blur
  is exactly what makes a site feel machine-assembled, and this team's own
  jersey is carrying real Samoan motif work — spearhead rows, chevron bands,
  filled and open triangles. Matching that is the whole visual identity.

  A note for whoever picks this up: these are respectful geometric motifs in
  the spirit of the jersey artwork, not reproductions of any specific pe'a or
  malu. Samoan tatau carries meaning earned by the wearer. Before launch these
  should be reviewed by the team, and ideally redrawn by a Samoan designer who
  can make them say something specific rather than merely look right.
*/

/** A band of alternating filled and open triangles — the spearhead row. */
export function SpearRow({
  className = "",
  color = "currentColor",
  flip = false,
}: {
  className?: string;
  color?: string;
  flip?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <defs>
        <pattern id="spear" width="20" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 12 L5 0 L10 12 Z" fill={color} />
          <path d="M10 12 L15 0 L20 12 Z" fill="none" stroke={color} strokeWidth="1.1" />
        </pattern>
      </defs>
      <rect width="120" height="12" fill="url(#spear)" />
    </svg>
  );
}

/**
 * The large field pattern — nested chevrons and diamond lattice, the way the
 * jersey runs it down the flank of the shirt.
 *
 * Rendered at low opacity behind content. It is texture, never information.
 */
export function TatauField({
  className = "",
  color = "currentColor",
  opacity = 0.14,
}: {
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      className={className}
      aria-hidden="true"
      width="100%"
      height="100%"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id="tatau-field"
          width="64"
          height="64"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(0)"
        >
          {/* Chevron stack */}
          <path
            d="M0 16 L16 0 L32 16 M0 32 L16 16 L32 32 M0 48 L16 32 L32 48"
            fill="none"
            stroke={color}
            strokeWidth="1.6"
          />
          {/* Diamond lattice, offset so the two never line up into a grid */}
          <path
            d="M48 8 L56 16 L48 24 L40 16 Z M48 40 L56 48 L48 56 L40 48 Z"
            fill="none"
            stroke={color}
            strokeWidth="1.4"
          />
          {/* Filled spearheads pointing inward */}
          <path d="M36 4 L40 12 L32 12 Z" fill={color} />
          <path d="M60 28 L64 36 L56 36 Z" fill={color} />
          {/* Tick rows */}
          <path
            d="M2 58 L2 62 M10 58 L10 62 M18 58 L18 62 M26 58 L26 62"
            stroke={color}
            strokeWidth="1.6"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tatau-field)" />
    </svg>
  );
}

/**
 * The circular motif from the back of the jersey — a ring of spearheads
 * around a centre. Used as a badge frame.
 */
export function TatauRing({
  className = "",
  color = "currentColor",
  teeth = 36,
}: {
  className?: string;
  color?: string;
  teeth?: number;
}) {
  const spikes = Array.from({ length: teeth }, (_, i) => {
    const angle = (i / teeth) * Math.PI * 2;
    const inner = 40;
    const outer = 50;
    const spread = (Math.PI * 2) / teeth / 2.6;

    const tip = [50 + Math.cos(angle) * outer, 50 + Math.sin(angle) * outer];
    const left = [
      50 + Math.cos(angle - spread) * inner,
      50 + Math.sin(angle - spread) * inner,
    ];
    const right = [
      50 + Math.cos(angle + spread) * inner,
      50 + Math.sin(angle + spread) * inner,
    ];

    return `M${left[0]!.toFixed(2)} ${left[1]!.toFixed(2)} L${tip[0]!.toFixed(2)} ${tip[1]!.toFixed(2)} L${right[0]!.toFixed(2)} ${right[1]!.toFixed(2)} Z`;
  }).join(" ");

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d={spikes} fill={color} opacity="0.9" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="2.4" />
      <circle cx="50" cy="50" r="33" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

/**
 * A vertical flank panel — the tatau column that runs down the side of the
 * jersey. Anchors a section edge without becoming a full background.
 */
export function TatauFlank({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="flank" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 0 L20 20 L0 40 Z" fill={color} opacity="0.85" />
          <path d="M40 0 L20 20 L40 40 Z" fill="none" stroke={color} strokeWidth="1.5" />
          <path d="M18 6 L22 12 L14 12 Z" fill={color} />
          <path d="M18 28 L22 34 L14 34 Z" fill={color} />
        </pattern>
      </defs>
      <rect width="40" height="200" fill="url(#flank)" />
    </svg>
  );
}
