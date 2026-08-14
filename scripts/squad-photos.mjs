import sharp from "sharp";

/*
  Hero carousel photographs.

  All three are cropped to one aspect ratio. A carousel whose slides disagree on
  shape reflows the page every time it advances, and this one sits next to the
  wordmark in the hero where any height change drags the headline around.

  1600x1317 is the existing field photograph's shape, and the hero column is
  already tuned to it, so the other two are cropped to match rather than the
  layout being re-tuned to them.
*/
const U = "/Users/braxdonsimmons/.claude/uploads/3110fd79-dbcc-425d-b59f-a6a93e11ece4";

const W = 1600;
const H = 1317;
const RATIO = W / H; // 1.2148

const JOBS = [
  {
    src: "5bd93dc8-IMG_7110.jpeg",
    out: "squad-dusseldorf",
    // Portrait phone frame: crop the sky above the tents and the empty grass
    // below the group, keeping the backdrop because that is the evidence.
    extract: { left: 0, top: 950, width: 3158, height: 2600 },
  },
  {
    src: "9b2b5e94-IMG_7086.jpeg",
    out: "squad-backdrop",
    // 4:3, so 358px of width has to go. All of it off the left, which has the
    // most empty wall; taking it off the right would cut the tournament banner.
    extract: { left: 358, top: 0, width: 3674, height: 3024 },
  },
  {
    src: "9cbb59f4-13b88ed4d1cf4446b9c5f8fee918e586.jpeg",
    out: "squad-delegation",
    // Same 358px, off the right this time: the leftmost person stands 60px from
    // that edge and the right has clear floor to spare.
    extract: { left: 0, top: 0, width: 3674, height: 3024 },
  },
];

for (const job of JOBS) {
  const got = job.extract.width / job.extract.height;
  if (Math.abs(got - RATIO) > 0.02) {
    throw new Error(`${job.out}: crop is ${got.toFixed(3)}, needs ${RATIO.toFixed(3)}`);
  }

  await sharp(`${U}/${job.src}`)
    .extract(job.extract)
    .resize({ width: W, height: H })
    .webp({ quality: 82 })
    .toFile(`public/photos/${job.out}.webp`);

  console.log(`${job.out.padEnd(18)} ${job.extract.width}x${job.extract.height} -> ${W}x${H}`);
}
