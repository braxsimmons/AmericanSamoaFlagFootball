import { chromium } from "playwright";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
for (const [path, name] of [["/", "home"], ["/shop", "shop"]]) {
  await p.goto("http://localhost:4321" + path, { waitUntil: "networkidle" });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1200);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${process.env.SD}/asff/${name}-kit.png`, fullPage: true });
}
await b.close();
