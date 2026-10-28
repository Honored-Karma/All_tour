import { useEffect } from "react";
import type { Locale } from "../lib/whatsapp";
import {
  resolveRouteSEO,
  getCanonicalUrl,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_WIDTH,
  DEFAULT_OG_IMAGE_HEIGHT,
  type PageSEOMetadata,
} from "../config/seo";

/**
 * Safely updates or creates a <meta> element in document.head.
 * If content is null, removes all matching meta elements to prevent stale data.
 */
export function setMetaTag(
  attributeName: "name" | "property",
  attributeValue: string,
  content: string | null | undefined
): void {
  if (typeof document === "undefined") return;

  const selector = `meta[${attributeName}="${attributeValue}"]`;
  const existingElements = Array.from(
    document.head.querySelectorAll<HTMLMetaElement>(selector)
  );

  if (content === null || content === undefined) {
    existingElements.forEach((el) => el.remove());
    return;
  }

  if (existingElements.length > 0) {
    existingElements[0].setAttribute("content", content);
    // Remove any accidental duplicate tags
    for (let i = 1; i < existingElements.length; i++) {
      existingElements[i].remove();
    }
  } else {
    const meta = document.createElement("meta");
    meta.setAttribute(attributeName, attributeValue);
    meta.setAttribute("content", content);
    document.head.appendChild(meta);
  }
}

/**
 * Safely updates or creates a <link> element in document.head.
 * If href is null, removes all matching link elements.
 */
export function setLinkTag(
  rel: string,
  href: string | null | undefined
): void {
  if (typeof document === "undefined") return;

  const selector = `link[rel="${rel}"]`;
  const existingElements = Array.from(
    document.head.querySelectorAll<HTMLLinkElement>(selector)
  );

  if (!href) {
    existingElements.forEach((el) => el.remove());
    return;
  }

  if (existingElements.length > 0) {
    existingElements[0].setAttribute("href", href);
    for (let i = 1; i < existingElements.length; i++) {
      existingElements[i].remove();
    }
  } else {
    const link = document.createElement("link");
    link.setAttribute("rel", rel);
    link.setAttribute("href", href);
    document.head.appendChild(link);
  }
}

export interface UseSEOOptions {
  pathname: string;
  search: string;
  locale: Locale;
}

/**
 * Route-aware SEO and social metadata hook.
 * Synchronizes document title, descriptions, Open Graph, Twitter cards, and lang attribute.
 */
export function useSEO({ pathname, search, locale }: UseSEOOptions): PageSEOMetadata {
  const seo = resolveRouteSEO(pathname, search, locale);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // 1. Title & html lang
    document.title = seo.title;
    document.documentElement.lang = locale === "kz" ? "kk" : "ru";

    // 2. Standard Meta Description
    setMetaTag("name", "description", seo.description);

    // 3. Open Graph Tags
    const ogTitle = seo.ogTitle || seo.title;
    const ogDescription = seo.ogDescription || seo.description;
    const imagePath = seo.ogImage || DEFAULT_OG_IMAGE;
    const ogImage = getCanonicalUrl(imagePath) || imagePath;
    const ogWidth = String(seo.ogImageWidth || DEFAULT_OG_IMAGE_WIDTH);
    const ogHeight = String(seo.ogImageHeight || DEFAULT_OG_IMAGE_HEIGHT);
    const ogLocale = locale === "kz" ? "kk_KZ" : "ru_KZ";

    setMetaTag("property", "og:title", ogTitle);
    setMetaTag("property", "og:description", ogDescription);
    setMetaTag("property", "og:type", seo.ogType || "website");
    setMetaTag("property", "og:locale", ogLocale);
    setMetaTag("property", "og:site_name", SITE_NAME);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:image:width", ogWidth);
    setMetaTag("property", "og:image:height", ogHeight);
    if (seo.ogImageAlt) {
      setMetaTag("property", "og:image:alt", seo.ogImageAlt);
    }

    // 4. Twitter Card Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", ogTitle);
    setMetaTag("name", "twitter:description", ogDescription);
    setMetaTag("name", "twitter:image", ogImage);

    // 5. Canonical URL & og:url (Strictly avoided when domain is unconfirmed)
    const canonicalPath = seo.canonicalPath || pathname;
    const canonical = getCanonicalUrl(`${canonicalPath}${locale === "kz" ? "?lang=kz" : ""}`);
    setLinkTag("canonical", canonical);
    setMetaTag("property", "og:url", canonical);
    setMetaTag("name", "robots", seo.noIndex ? "noindex, follow" : "index, follow");
    document.head.querySelectorAll('link[data-alltour-language]').forEach((element) => element.remove());
    for (const [language, query] of [["ru", ""], ["kk", "?lang=kz"], ["x-default", ""]]) {
      const href = getCanonicalUrl(canonicalPath + query);
      if (!href) continue;
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = language;
      link.href = href;
      link.dataset.alltourLanguage = "true";
      document.head.appendChild(link);
    }
  }, [seo, locale, pathname]);

  return seo;
}
