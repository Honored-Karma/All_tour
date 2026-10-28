import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";

const routes = ["", "tours", "about", "reviews", "faq", "contacts", "tours/china-urumqi", "tours/china-content-3d", "tours/kyrgyzstan-content-tour", "tours/discover-georgia", "tours/issyk-kul", "tours/tien-shan-panoramas", "destinations/china", "destinations/kyrgyzstan", "destinations/georgia"];
for (const prefix of ["", "_localized/kz"]) {
  for (const route of routes) {
    const html = await fs.readFile(path.join("dist", prefix, route, "index.html"), "utf8");
    assert.match(html, /<h1\b/);
    assert.ok(!html.includes('<div id="root"></div>'));
    assert.match(html, prefix ? /<html lang="kk"/ : /<html lang="ru"/);
    assert.match(html, /application\/ld\+json/);
    if (route === "tours/china-urumqi") assert.ok(html.includes(prefix ? "Үрімші" : "Урумчи"));
  }
  const missing = await fs.readFile(path.join("dist", prefix, "404.html"), "utf8");
  assert.match(missing, /noindex, follow/);
}
const mobileHero = await fs.stat("dist/media/optimized/china-hero-480.webp");
assert.ok(mobileHero.size < 150_000, "Mobile hero exceeds the image budget");
console.log("Verified 30 public HTML pages, localized 404s and the mobile image budget.");
