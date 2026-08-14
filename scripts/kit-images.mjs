import sharp from "sharp";
const U = "/Users/braxdonsimmons/.claude/uploads/3110fd79-dbcc-425d-b59f-a6a93e11ece4";
const JOBS = [
  ["ab9559df-131e143d2173474dbfce0086592a5b86", "jersey-signature", 0],
  ["ab2dcdae-B869656A33454E5E9E691220AD2BC712", "jersey-navy", 0],
  // 4px off the top: the source has a stray magenta sliver at the very edge.
  ["894fc7de-7F9E5FCA81C3463DBD93A625A4422A53", "jersey-white", 5],
  ["1baf7263-7F1EE4AAFF1440BDB49F00E1068F243B", "tank-navy", 0],
  ["41f36527-3429DC7C8C7641F3A37F703726278E85", "tank-white", 0],
];
// One canvas for every kit, so the cards line up in a grid instead of jittering.
const W = 1401, H = 920;
for (const [src, name, topCrop] of JOBS) {
  let img = sharp(`${U}/${src}.jpeg`);
  const m = await img.metadata();
  if (topCrop) img = sharp(await img.extract({ left: 0, top: topCrop, width: m.width, height: m.height - topCrop }).toBuffer());
  const meta = await img.metadata();
  // Pad with the image's own corner colour so the seam is invisible.
  const { data } = await sharp(await img.toBuffer()).extract({ left: 2, top: 2, width: 8, height: 8 }).raw().toBuffer({ resolveWithObject: true });
  const bg = { r: data[0], g: data[1], b: data[2] };
  const pad = H - meta.height, top = Math.floor(pad / 2);
  const out = `public/kit/${name}.webp`;
  await img.extend({ top, bottom: pad - top, left: 0, right: 0, background: bg })
    .webp({ quality: 88 }).toFile(out);
  console.log(name, `${meta.width}x${meta.height} -> ${W}x${H}`, `bg rgb(${bg.r},${bg.g},${bg.b})`);
}
