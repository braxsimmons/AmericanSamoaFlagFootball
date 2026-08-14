import sharp from "sharp";

/*
  Group A flag roundels.

  The four sources arrive inconsistent: two are 447px PNGs with opaque white
  corners, one is a 512px PNG that is already transparent, and American Samoa is
  a 980px JPEG sitting on a light grey card with a drop shadow. Dropped into the
  bracket as-is they would render at four different effective diameters, and two
  of them would show white corners against the bone background.

  So every one gets the same treatment: find where the disc actually is, crop to
  it, resize to one size, and mask to a circle. The mask matters even for the
  sources that already look round, because it is what guarantees they share an
  edge and a diameter rather than approximately sharing them.
*/

const U = "/Users/braxdonsimmons/.claude/uploads/3110fd79-dbcc-425d-b59f-a6a93e11ece4";

// 128px for a 36px slot: covers 3x displays with room to spare, and these are
// flat vector-derived graphics that cost almost nothing at this size.
const SIZE = 128;

/*
  How to find the disc in each source. Declared per file rather than guessed,
  because a single clever heuristic gets one of these wrong every time:

  full   the disc is already inscribed in the square and touches all four
         edges, so there is nothing to crop. A saturation test would shrink it,
         since the top of the United States disc is a white stripe.
  alpha  the source is already transparent outside the disc.
  card   the disc sits on a grey card whose shadow runs from about 246 beside
         the disc down to 100 in the corners. Two tests fail here and both are
         worth recording, because each looks right until it is measured:

         Matching the corner colour finds nothing to trim, since the shadow is
         a gradient rather than one flat value.

         Saturation alone reports the disc as 793x842, not square. The flag's
         white band crosses the middle, so the circle's leftmost and rightmost
         points are white and read as unsaturated; only the navy top and bottom
         get found, and the crop comes out narrow with a sliver of card left
         inside the mask.

         What separates them is that the card is neutral and never brighter
         than about 250, while the flag's white is 255. Neutral-and-not-white
         is background, and that returns 846x845, which is a circle.
*/
const JOBS = [
  ["8e4200b5-IMG_2736.png", "us", "full"],
  ["480df778-IMG_2737.png", "au", "full"],
  ["8427133b-IMG_2738.png", "il", "alpha"],
  ["d2af208d-IMG_2739.jpeg", "as", "card"],
];

/** Bounding box of the disc, using the strategy declared for that source. */
async function contentBox(file, mode) {
  const meta = await sharp(file).metadata();
  if (mode === "full") {
    return { left: 0, top: 0, width: meta.width, height: meta.height };
  }

  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isContent = (i) => {
    if (mode === "alpha") return data[i + 3] > 8;
    // card
    if (data[i + 3] < 8) return false;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const neutral = Math.max(r, g, b) - Math.min(r, g, b) < 12;
    return !(neutral && (r + g + b) / 3 <= 250);
  };

  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!isContent((y * width + x) * channels)) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

// Radius is one pixel inside the box: the crop lands within a pixel or two of
// the true disc edge, and a full-radius mask would keep that last antialiased
// ring of card colour.
const circle = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
     <circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2 - 1}" fill="#fff"/>
   </svg>`,
);

for (const [src, name, mode] of JOBS) {
  const file = `${U}/${src}`;
  const box = await contentBox(file, mode);

  // Square it off around the centre of what was found, so an off-centre crop
  // does not shave one side of the disc.
  const side = Math.max(box.width, box.height);
  const cx = box.left + box.width / 2;
  const cy = box.top + box.height / 2;
  const meta = await sharp(file).metadata();
  const left = Math.max(0, Math.min(meta.width - side, Math.round(cx - side / 2)));
  const top = Math.max(0, Math.min(meta.height - side, Math.round(cy - side / 2)));

  await sharp(file)
    .extract({ left, top, width: Math.min(side, meta.width), height: Math.min(side, meta.height) })
    .resize(SIZE, SIZE, { fit: "fill" })
    .ensureAlpha()
    // `dest-in` keeps the flag only where the circle is opaque, so the corners
    // become genuinely transparent rather than white.
    .composite([{ input: circle, blend: "dest-in" }])
    .png({ compressionLevel: 9 })
    .toFile(`public/flags/${name}.png`);

  console.log(
    `${name.padEnd(3)} ${mode.padEnd(5)} ${meta.width}x${meta.height} -> disc ${box.width}x${box.height} at ${box.left},${box.top} -> ${SIZE}x${SIZE}`,
  );
}
