import sharp from "sharp";
import { writeFileSync } from "fs";

/*
  Builds app/favicon.ico from the crest.

  This file existed and looked correct for a long time while being wrong. It was
  the default create-next-app favicon, a black circle with a white triangle,
  which carries 16, 32, 48 and 256 frames exactly like a real one. Anything that
  checks the frame table passes it. Only rendering the pixels shows the problem.

  Written by hand rather than with a png-to-ico dependency, because the format
  is a header and a table and this is less code than the install.

  The small frames are 32bpp BMP rather than embedded PNG. PNG-in-ICO is
  understood by every current browser, but BMP is understood by everything ever
  made and costs a few kilobytes at these sizes. 256 stays PNG because a BMP at
  that size is 256KB on its own.
*/

const SRC = "app/icon.png";
const OUT = "app/favicon.ico";

const BMP_SIZES = [16, 32, 48];
const PNG_SIZES = [128, 256];

/** A 32bpp BMP DIB as an ICO frame: header, bottom-up BGRA, then an AND mask. */
async function bmpFrame(size) {
  const { data } = await sharp(SRC)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const xor = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    // ICO stores rows bottom-up.
    const src = (size - 1 - y) * size * 4;
    for (let x = 0; x < size; x++) {
      const s = src + x * 4;
      const d = (y * size + x) * 4;
      xor[d] = data[s + 2]; // B
      xor[d + 1] = data[s + 1]; // G
      xor[d + 2] = data[s]; // R
      xor[d + 3] = data[s + 3]; // A
    }
  }

  // The AND mask is ignored when there is an alpha channel, but the format
  // still requires the bytes, padded to a 4-byte row.
  const maskRow = Math.ceil(size / 32) * 4;
  const mask = Buffer.alloc(maskRow * size);

  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0); // biSize
  header.writeInt32LE(size, 4); // biWidth
  header.writeInt32LE(size * 2, 8); // biHeight, XOR plus AND
  header.writeUInt16LE(1, 12); // biPlanes
  header.writeUInt16LE(32, 14); // biBitCount
  header.writeUInt32LE(0, 16); // BI_RGB
  header.writeUInt32LE(xor.length + mask.length, 20);

  return { size, data: Buffer.concat([header, xor, mask]) };
}

async function pngFrame(size) {
  const data = await sharp(SRC)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
  return { size, data };
}

const frames = [
  ...(await Promise.all(BMP_SIZES.map(bmpFrame))),
  ...(await Promise.all(PNG_SIZES.map(pngFrame))),
];

const dir = Buffer.alloc(6);
dir.writeUInt16LE(0, 0); // reserved
dir.writeUInt16LE(1, 2); // 1 = icon
dir.writeUInt16LE(frames.length, 4);

const entries = [];
// Image data starts after the directory and the whole entry table.
let offset = 6 + frames.length * 16;

for (const frame of frames) {
  const e = Buffer.alloc(16);
  e.writeUInt8(frame.size === 256 ? 0 : frame.size, 0); // 0 means 256
  e.writeUInt8(frame.size === 256 ? 0 : frame.size, 1);
  e.writeUInt8(0, 2); // palette
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // planes
  e.writeUInt16LE(32, 6); // bit depth
  e.writeUInt32LE(frame.data.length, 8);
  e.writeUInt32LE(offset, 12);
  entries.push(e);
  offset += frame.data.length;
}

const ico = Buffer.concat([dir, ...entries, ...frames.map((f) => f.data)]);
writeFileSync(OUT, ico);

console.log(`${OUT}  ${frames.length} frames, ${(ico.length / 1024).toFixed(1)}KB`);
for (const f of frames) {
  console.log(`  ${String(f.size).padStart(3)}x${f.size}  ${(f.data.length / 1024).toFixed(1)}KB  ${f.size >= 128 ? "png" : "bmp"}`);
}
