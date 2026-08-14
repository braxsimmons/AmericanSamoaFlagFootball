import sharp from "sharp";

/*
  Images for search results.

  Google picks a web result's thumbnail from what is on the page, weighted by
  prominence and size. It is not og:image, which only drives social cards. What
  it does read is structured data, and Google's documented advice is to supply
  the same photograph at several aspect ratios so it can pick whichever fits the
  surface it is rendering.

  Cropped from the original 3158x4213 phone frame rather than from the 1600px
  web copy, because Google wants at least 1200px wide and upscaling a downscale
  would be worse than useless.

  The 16:9 is the awkward one. The group stands 1983px tall in the source and a
  16:9 crop at full width is only 1776px, so something has to go. It comes off
  the bottom: losing shins is survivable, losing faces is not.
*/
const SRC = "/Users/braxdonsimmons/.claude/uploads/3110fd79-dbcc-425d-b59f-a6a93e11ece4/5bd93dc8-IMG_7110.jpeg";

const JOBS = [
  { name: "squad-16x9", extract: { left: 0, top: 1290, width: 3158, height: 1776 }, width: 1200 },
  { name: "squad-4x3", extract: { left: 0, top: 1250, width: 3158, height: 2369 }, width: 1200 },
  { name: "squad-1x1", extract: { left: 0, top: 1000, width: 3158, height: 3158 }, width: 1200 },
];

for (const job of JOBS) {
  await sharp(SRC)
    .extract(job.extract)
    .resize({ width: job.width })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(`public/photos/${job.name}.jpg`);

  const m = await sharp(`public/photos/${job.name}.jpg`).metadata();
  console.log(`${job.name.padEnd(12)} ${m.width}x${m.height}  ratio ${(m.width / m.height).toFixed(3)}`);
}
