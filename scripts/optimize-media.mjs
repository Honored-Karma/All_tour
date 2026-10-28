import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

sharp.concurrency(2);
const directory = path.resolve("public/media");
const output = path.join(directory, "optimized");
await fs.mkdir(output, { recursive: true });
const inputs = (await fs.readdir(directory)).filter((name) => name.endsWith(".jpg")).map((name) => path.join(directory, name));
inputs.push(path.resolve("public/assets/brand/group-china-tour.png"));
let generated = 0;
for (const input of inputs) {
  const original = await fs.stat(input);
  for (const width of [480, 960, 1600]) {
    const target = path.join(output, `${path.parse(input).name}-${width}.webp`);
    const existing = await fs.stat(target).catch(() => null);
    if (existing && existing.mtimeMs >= original.mtimeMs) continue;
    await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(target);
    generated += 1;
  }
}
console.log(`Responsive media ready (${generated} generated).`);
