import sharp from "sharp";
import { statSync } from "fs";

/*
  Icon and social-card compression.

  These four files sat at 445KB, 57KB and 589KB twice. icon.png is referenced
  from the head of every page, so nearly half a megabyte was being fetched for a
  favicon, and the two social cards are byte-identical to each other.

  All of them are flat vector-derived artwork: a crest on transparency, and a
  crest on a black field. That is exactly what a palette compresses well, and it
  is why the saving here is enormous rather than marginal. Nothing is resized,
  so the pixels Google and Apple ask for are unchanged.
*/

const JOBS = [
  // Transparency has to survive: the crest sits on the browser tab's own
  // background, which is not always white.
  { file: "app/icon.png", palette: true },
  // Apple wants an opaque square. It already is; just squeeze it.
  { file: "app/apple-icon.png", palette: true },
  // The social cards are photographic-ish around the crest edges, so a palette
  // would band the gradient. Full colour, maximum effort.
  { file: "app/opengraph-image.png", palette: false },
  { file: "app/twitter-image.png", palette: false },
];

for (const { file, palette } of JOBS) {
  const before = statSync(file).size;
  const buf = await sharp(file)
    .png({ compressionLevel: 9, effort: 10, palette, quality: palette ? 90 : undefined })
    .toBuffer();

  // Never write a "compressed" file that is bigger than what it replaces.
  if (buf.length >= before) {
    console.log(`${file.padEnd(28)} ${(before / 1024).toFixed(0)}KB  already minimal, left alone`);
    continue;
  }

  await sharp(buf).toFile(file);
  const after = statSync(file).size;
  console.log(
    `${file.padEnd(28)} ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB  (${Math.round((1 - after / before) * 100)}% off)`,
  );
}
