import sharp from "sharp";

/*
  The Düsseldorf squad photograph.

  Cropped, not letterboxed. The original is a phone frame in portrait with a
  lot of sky above the tents and a lot of empty grass below the group; at the
  size this runs on the page both would just shrink the faces. The crop keeps
  the IFAF backdrop, because "WORLD FLAG DÜSSELDORF 2026" behind them is the
  evidence, and stops just under the flag.
*/
const SRC = "/Users/braxdonsimmons/.claude/uploads/3110fd79-dbcc-425d-b59f-a6a93e11ece4/5bd93dc8-IMG_7110.jpeg";

await sharp(SRC)
  .extract({ left: 0, top: 950, width: 3158, height: 2600 })
  .resize({ width: 1600 })
  .webp({ quality: 82 })
  .toFile("public/photos/squad-dusseldorf.webp");

const m = await sharp("public/photos/squad-dusseldorf.webp").metadata();
console.log(`squad-dusseldorf.webp  ${m.width}x${m.height}`);
