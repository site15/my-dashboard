#!/usr/bin/env node
/**
 * Usage:
 *   node download-fonts.js "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" ./fonts
 *   node download-fonts.js "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" ./fonts/inter
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.argv.length < 4) {
  console.error("Usage: node download-fonts.js <css-url> <output-folder>");
  process.exit(1);
}

const cssUrl = process.argv[2];
const outDir = process.argv[3];

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// CHROME user-agent (важно!)
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
  "Accept": "text/css,*/*;q=0.1",
};

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: HEADERS }, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`Request failed: ${res.statusCode} ${url}`));
        return;
      }
      let data = [];
      res.on("data", chunk => data.push(chunk));
      res.on("end", () => resolve(Buffer.concat(data)));
    }).on("error", reject);
  });
}

(async () => {
  try {
    console.log(`Downloading CSS as Chrome: ${cssUrl}`);
    const cssBuffer = await download(cssUrl);
    let cssText = cssBuffer.toString("utf8");

    // Находим .woff2 ссылки (Chrome всегда выдаёт их)
    const fontUrls = [...cssText.matchAll(/https:\/\/[^)]+\.woff2/g)].map(m => m[0]);

    console.log(`Found ${fontUrls.length} .woff2 files`);

    const downloaded = [];

    for (const url of fontUrls) {
      const fileName = path.basename(url.split("?")[0]);
      const filePath = path.join(outDir, fileName);

      console.log(`Downloading font: ${fileName}`);
      const buffer = await download(url);
      fs.writeFileSync(filePath, buffer);

      downloaded.push({ url, fileName });
    }

    // Replace URLs in CSS → local files
    for (const f of downloaded) {
      cssText = cssText.replaceAll(f.url, `./${f.fileName}`);
    }

    fs.writeFileSync(path.join(outDir, "fonts.css"), cssText);

    console.log(`Done! Saved fonts and fonts.css`);
  } catch (err) {
    console.error(err);
  }
})();
