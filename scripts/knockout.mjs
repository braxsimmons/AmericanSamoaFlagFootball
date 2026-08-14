/*
  Turns the supplied black-on-white pattern artwork into transparent PNGs.

  The luminance of each pixel becomes the *alpha* channel, inverted: black ink
  goes fully opaque, white paper goes fully transparent, and the anti-aliased
  greys in between survive as partial alpha so the edges stay smooth. The RGB is
  then flattened to pure white.

  White-on-transparent is deliberate. Used as a CSS `mask-image` the colour comes
  from whatever is underneath, so the same file works in navy, in red and in
  bone without three copies — and it stays consistent with the palette rather
  than baking one colour into the asset.

  Run: node scripts/knockout.mjs
*/
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "/Users/braxdonsimmons/.claude/uploads/3110fd79-dbcc-425d-b59f-a6a93e11ece4";

const JOBS = [
  { in: `${SRC}/cddc4055-IMG_2715.jpeg`, out: "public/patterns/band-arc.png" },
  { in: `${SRC}/e5b5c871-IMG_2716.jpeg`, out: "public/patterns/field-symmetry.png" },
];

await mkdir("public/patterns", { recursive: true });

for (const job of JOBS) {
  const src = sharp(job.in);
  const { width, height } = await src.metadata();

  // Greyscale copy, inverted: dark ink -> high value -> high alpha.
  const alpha = await sharp(job.in).greyscale().negate().toColourspace("b-w").raw().toBuffer();

  // A pure white canvas the same size, wearing that alpha.
  await sharp({
    create: {
      width: width,
      height: height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .png({ compressionLevel: 9 })
    .toFile(job.out);

  console.log(`${job.out}  ${width}x${height}`);
}
