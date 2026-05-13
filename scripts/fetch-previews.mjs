import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { sites } from "../sites.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../public/assets/previews");

async function getOGImage(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PreviewFetcher/1.0)" },
  });
  const html = await res.text();
  const match =
    html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  return match?.[1] ?? null;
}

function microlinkUrl(siteUrl) {
  return `https://api.microlink.io/?url=${encodeURIComponent(siteUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
}

async function fetchImage(imageUrl) {
  const res = await fetch(imageUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PreviewFetcher/1.0)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const fetchable = sites.filter((s) => s.status === "done" && s.href);

  for (const { slug, href } of fetchable) {
    const destJpg = path.join(OUT_DIR, `${slug}.jpg`);
    const destPng = path.join(OUT_DIR, `${slug}.png`);

    if (fs.existsSync(destJpg) || fs.existsSync(destPng)) {
      console.log(`skip  ${slug} (already cached)`);
      continue;
    }

    process.stdout.write(`fetch ${slug} ... `);
    try {
      let imageUrl = await getOGImage(href);
      let source = "og";
      if (!imageUrl) {
        imageUrl = microlinkUrl(href);
        source = "microlink";
      }

      const buf = await fetchImage(imageUrl);
      const isPng = buf[0] === 0x89 && buf[1] === 0x50;
      const dest = isPng ? destPng : destJpg;
      fs.writeFileSync(dest, buf);
      console.log(`saved (${source}) → ${path.basename(dest)}`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }
}

main();
