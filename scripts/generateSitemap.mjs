import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

/**
 * Sitemap generator script.
 *
 * NOTE: Production domain has not been finalized yet.
 * In accordance with project requirements, no placeholder or unverified domains
 * (such as alltour.kz) are published in public output.
 *
 * Usage once domain is confirmed:
 *   VITE_SITE_URL=https://confirmed-domain.com npm run sitemap
 */

const tourSlugs = [
  "kyrgyzstan-content-tour",
  "china-urumqi",
  "china-content-3d",
  "discover-georgia",
  "issyk-kul",
  "tien-shan-panoramas",
];

const destinationIds = ["kyrgyzstan", "georgia", "china"];

const staticRoutes = [
  { path: "", priority: "1.0", changefreq: "weekly" },
  { path: "tours", priority: "0.9", changefreq: "daily" },
  { path: "about", priority: "0.75", changefreq: "monthly" },
  { path: "reviews", priority: "0.8", changefreq: "weekly" },
  { path: "faq", priority: "0.75", changefreq: "monthly" },
  { path: "contacts", priority: "0.8", changefreq: "monthly" },
];

function generate() {
  const baseUrlEnv = process.env.VITE_SITE_URL || process.env.SITE_URL;

  if (!baseUrlEnv || !baseUrlEnv.trim()) {
    console.log("[sitemap] No confirmed production base URL configured in VITE_SITE_URL.");
    console.log("[sitemap] Keeping sitemap outside public output until domain is confirmed.");
    console.log("[sitemap] To generate: VITE_SITE_URL=https://your-domain.com npm run sitemap");
    return;
  }

  const baseUrl = baseUrlEnv.trim().replace(/\/+$/, "");
  console.log(`[sitemap] Generating sitemap for confirmed base URL: ${baseUrl}`);

  const urls = [];

  for (const r of staticRoutes) {
    const loc = r.path ? `${baseUrl}/${r.path}` : `${baseUrl}/`;
    urls.push(`  <url><loc>${loc}</loc><priority>${r.priority}</priority><changefreq>${r.changefreq}</changefreq></url>`);
  }

  for (const slug of tourSlugs) {
    urls.push(`  <url><loc>${baseUrl}/tours/${slug}</loc><priority>0.85</priority><changefreq>weekly</changefreq></url>`);
  }

  for (const destId of destinationIds) {
    urls.push(`  <url><loc>${baseUrl}/destinations/${destId}</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>`);
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  const targetPath = path.join(rootDir, "public", "sitemap.xml");
  fs.writeFileSync(targetPath, sitemapXml, "utf8");
  console.log(`[sitemap] Successfully wrote ${urls.length} verified routes to public/sitemap.xml`);
}

generate();
