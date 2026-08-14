import sharp from "sharp";

/*
  Kit renders to web images.

  The supplied JPEGs arrive at slightly different heights (882 to 912), which
  would make the grid cards jitter against each other. Everything is padded onto
  one canvas using a colour sampled from that image's own corner, so the seam is
  invisible and every card is the same shape. KIT_W / KIT_H in lib/content.ts
  must match the numbers below.

  Re-run with: node scripts/kit-images.mjs
*/

const U = "/Users/braxdonsimmons/.claude/uploads/3110fd79-dbcc-425d-b59f-a6a93e11ece4";

// One canvas for every kit.
const W = 1401;
const H = 920;

const JOBS = [
  // The match jersey. Deliberately still the first batch: this is the only
  // render with the crest between the two views, and it is the one garment
  // that earns the extra mark.
  ["ab9559df-131e143d2173474dbfce0086592a5b86", "jersey-signature", 0],

  // The rest are the second batch, reshot with the floating crest removed from
  // between front and back. Cleaner, and it stops four repetitions of the same
  // shield competing with the tatau in a 2x2 grid.
  ["5074a2cb-B869656A33454E5E9E691220AD2BC712", "jersey-navy", 0],
  ["64099aee-7F9E5FCA81C3463DBD93A625A4422A53", "jersey-white", 0],
  ["2d475237-7F1EE4AAFF1440BDB49F00E1068F243B", "tank-navy", 0],
  ["76c8b045-3429DC7C8C7641F3A37F703726278E85", "tank-white", 0],
];

for (const [src, name, topCrop] of JOBS) {
  let img = sharp(`${U}/${src}.jpeg`);
  const m = await img.metadata();

  // `topCrop` trims a bleed off the source's top edge. The first white jersey
  // had a magenta sliver there; the reshoots are clean, so it is 0 throughout
  // now. Kept because the next batch may not be.
  if (topCrop) {
    img = sharp(
      await img
        .extract({ left: 0, top: topCrop, width: m.width, height: m.height - topCrop })
        .toBuffer(),
    );
  }

  const meta = await img.metadata();

  // Sample the image's own corner so the padding is indistinguishable from the
  // backdrop. A flat white pad would show a hard seam against these grey studio
  // gradients.
  const { data } = await sharp(await img.toBuffer())
    .extract({ left: 2, top: 2, width: 8, height: 8 })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bg = { r: data[0], g: data[1], b: data[2] };

  const pad = H - meta.height;
  const top = Math.floor(pad / 2);

  await img
    .extend({ top, bottom: pad - top, left: 0, right: 0, background: bg })
    .webp({ quality: 88 })
    .toFile(`public/kit/${name}.webp`);

  console.log(`${name}  ${meta.width}x${meta.height} -> ${W}x${H}  bg rgb(${bg.r},${bg.g},${bg.b})`);
}
