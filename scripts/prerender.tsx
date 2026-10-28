import fs from "node:fs/promises";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { loadEnv } from "vite";
import { StaticPage } from "../src/app/StaticPage";
import { publicRoutes } from "../src/config/routes";
import { businessConfig } from "../src/config/business";
import type { Locale } from "../src/lib/whatsapp";
import { departures } from "../src/lib/departures";
import { validateDepartureRecords } from "../src/lib/departureValidation";
import { tours } from "../src/data/tours";

const root = process.cwd();
const validation = validateDepartureRecords(departures, new Set(tours.map((tour) => tour.id)));
if (validation.errors.length) throw new Error(validation.errors.join("\n"));
const env = loadEnv("production", root, "VITE_");
process.env.VITE_SITE_URL ||= env.VITE_SITE_URL || "";
const { resolveRouteSEO, validateSiteUrl } = await import("../src/config/seo");
const base = validateSiteUrl(process.env.VITE_SITE_URL);
const output = path.resolve(root, "dist");
const template = await fs.readFile(path.join(output, "index.html"), "utf8");
const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);

for (const locale of ["ru", "kz"] as Locale[]) {
  for (const route of [...publicRoutes, "/404"]) {
    const seo = resolveRouteSEO(route, "", locale);
    const canonical = base ? `${base}${route}${locale === "kz" ? "?lang=kz" : ""}` : null;
    const image = base ? new URL(seo.ogImage || "/assets/brand/og-share-alltour.jpg", base).href : seo.ogImage!;
    let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(seo.title)}</title>`)
      .replace(/<html lang="[^"]+"/, `<html lang="${locale === "kz" ? "kk" : "ru"}"`)
      .replace(/<meta (?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"[^>]*\/?>/g, "");
    const metadata = [
      `<meta name="description" content="${escape(seo.description)}" />`,
      `<meta name="robots" content="${seo.noIndex ? "noindex, follow" : "index, follow"}" />`,
      ...Object.entries({ "og:title": seo.title, "og:description": seo.description, "og:type": seo.ogType || "website", "og:image": image, "og:locale": locale === "kz" ? "kk_KZ" : "ru_KZ", "og:site_name": "ALL TOUR", "og:image:alt": seo.ogImageAlt || "ALL TOUR" })
        .map(([key, value]) => `<meta property="${key}" content="${escape(value)}" />`),
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escape(seo.title)}" />`,
      `<meta name="twitter:description" content="${escape(seo.description)}" />`,
      `<meta name="twitter:image" content="${escape(image)}" />`,
    ];
    if (canonical && !seo.noIndex) {
      metadata.push(`<link rel="canonical" href="${escape(canonical)}" />`, `<meta property="og:url" content="${escape(canonical)}" />`);
      for (const [lang, suffix] of [["ru", ""], ["kk", "?lang=kz"], ["x-default", ""]]) metadata.push(`<link rel="alternate" hreflang="${lang}" data-alltour-language="true" href="${escape(base + route + suffix)}" />`);
    }
    const organization = { "@context": "https://schema.org", "@type": "TravelAgency", name: businessConfig.brandName, telephone: businessConfig.whatsappDisplay, sameAs: [businessConfig.instagramUrl, businessConfig.telegramUrl], ...(base ? { url: base } : {}) };
    metadata.push(`<script type="application/ld+json">${JSON.stringify(organization).replace(/</g, "\\u003c")}</script>`);
    html = html.replace("</head>", `${metadata.join("\n")}\n</head>`)
      .replace('<div id="root"></div>', `<div id="root">${renderToString(<StaticPage path={route} locale={locale} />)}</div>`);
    const folder = locale === "kz" ? path.join(output, "_localized", "kz") : output;
    const target = route === "/404" ? path.join(folder, "404.html") : path.join(folder, route.slice(1), "index.html");
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, html);
  }
}

if (base) {
  const urls = publicRoutes.map((route) => `  <url><loc>${escape(base + route)}</loc><xhtml:link rel="alternate" hreflang="ru" href="${escape(base + route)}"/><xhtml:link rel="alternate" hreflang="kk" href="${escape(base + route + "?lang=kz")}"/></url>`);
  await fs.writeFile(path.join(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>`);
}
await fs.writeFile(path.join(output, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /_localized/\n${base ? `Sitemap: ${base}/sitemap.xml\n` : ""}`);
// Keep working originals in the repository; exclude authoring-only files from deployment.
for (const relative of ["assets/aistudio/_______4cea0f8f.zip", "assets/aistudio/Paste_October_23__2026_-_7_16PM_26625e59", "assets/aistudio/Paste_October_21__2026_-_6_58PM_1f62c368", "fonts/montserrat/Montserrat-Variable.ttf", "fonts/montserrat/Montserrat-Italic-Variable.ttf"]) {
  const target = path.resolve(output, relative);
  if (!target.startsWith(output + path.sep)) throw new Error("Invalid output path");
  await fs.rm(target, { force: true });
}
console.log(`Prerendered ${(publicRoutes.length + 1) * 2} public/404 documents. ${base ? "Canonical and sitemap configured." : "Set VITE_SITE_URL to enable canonical URLs and sitemap."}`);
