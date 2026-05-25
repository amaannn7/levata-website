// One-off: load qexpress.jpg, make near-white pixels transparent, save as qexpress.png.
// Uses sharp (already in node_modules). Run from project root:
//   node scripts/remove-white-bg.mjs
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const input = path.join(root, "public/clients/qexpress.jpg");
const output = path.join(root, "public/clients/qexpress.png");

// Tolerance: anything with R, G, B all above this threshold is treated as background.
const WHITE_THRESHOLD = 240;

const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.from(data);

for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
        out[i + 3] = 0; // alpha = 0 (transparent)
    }
}

await sharp(out, { raw: { width, height, channels } })
    .png()
    .toFile(output);

console.log(`Wrote ${output} (${width}x${height})`);
