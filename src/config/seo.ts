import type { Locale } from "../lib/whatsapp";

export interface LocalizedText {
  ru: string;
  kz: string;
}

export interface PageSEOMetadata {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  canonicalPath?: string;
}

/**
 * Verified base URL configuration for production.
 *
 * NOTE: Production domain has not been finalized yet.
 * In accordance with project requirements, no invented/placeholder URLs
 * (such as alltour.kz or localhost) are emitted into canonical tags, og:url, or sitemaps.
 * Once confirmed, set VITE_SITE_URL in your deployment environment (e.g. https://confirmed-domain.com).
 */
const rawBaseUrl =
  typeof import.meta !== "undefined" && import.meta.env
    ? (import.meta.env.VITE_SITE_URL as string | undefined)
    : undefined;

export const SITE_BASE_URL: string | null =
  rawBaseUrl && rawBaseUrl.trim().length > 0
    ? rawBaseUrl.trim().replace(/\/+$/, "")
    : null;

/**
 * Returns an absolute URL only when a verified production domain is configured.
 * When SITE_BASE_URL is null, returns null to avoid publishing invented URLs.
 */
export function getCanonicalUrl(path: string): string | null {
  if (!SITE_BASE_URL) {
    return null;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_BASE_URL}${cleanPath}`;
}

export const SITE_NAME = "ALL TOUR";
export const DEFAULT_OG_IMAGE = "/assets/brand/og-share-alltour.jpg";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;

/**
 * Static route SEO definitions with neutral, factual descriptions.
 * Does not make unsupported claims regarding offices, hours, fee guarantees, or guide vetting.
 */
export const STATIC_ROUTE_SEO: Record<
  string,
  {
    ru: { title: string; description: string; ogImageAlt: string };
    kz: { title: string; description: string; ogImageAlt: string };
  }
> = {
  "/": {
    ru: {
      title: "ALL TOUR — Туры из Алматы",
      description:
        "Туры из Алматы в Кыргызстан, Грузию и Китай. Посмотрите программы и уточните даты и стоимость в WhatsApp.",
      ogImageAlt: "Туры из Алматы с ALL TOUR",
    },
    kz: {
      title: "ALL TOUR — Алматыдан турлар",
      description:
        "Алматыдан Қырғызстанға, Грузияға және Қытайға турлар. Бағдарламаларды қарап, күндері мен бағасын WhatsApp арқылы нақтылаңыз.",
      ogImageAlt: "ALL TOUR-мен Алматыдан турлар",
    },
  },
  "/tours": {
    ru: {
      title: "Каталог туров из Алматы — Кыргызстан, Грузия, Китай | ALL TOUR",
      description:
        "Туры в Кыргызстан, Грузию и Китай с отправлением из Алматы. Программы, длительность, стоимость и бронирование в WhatsApp.",
      ogImageAlt: "Каталог туров ALL TOUR из Алматы",
    },
    kz: {
      title: "Алматыдан турлар каталогы — Қырғызстан, Грузия, Қытай | ALL TOUR",
      description:
        "Алматыдан Қырғызстанға, Грузияға және Қытайға турлар. Бағдарламалар, ұзақтығы, бағасы және WhatsApp арқылы брондау.",
      ogImageAlt: "ALL TOUR Алматыдан турлар каталогы",
    },
  },
  "/tours?favorites=true": {
    ru: {
      title: "Избранные туры | ALL TOUR",
      description:
        "Список сохранённых туров ALL TOUR. Сравнение выбранных маршрутов, просмотр деталей программ и переход к бронированию.",
      ogImageAlt: "Избранные туры ALL TOUR",
    },
    kz: {
      title: "Таңдаулы турлар | ALL TOUR",
      description:
        "ALL TOUR сақталған турлар тізімі. Таңдалған бағыттарды салыстыру, бағдарлама мәліметтерін көру және брондауға өту.",
      ogImageAlt: "ALL TOUR таңдаулы турлар",
    },
  },
  "/about": {
    ru: {
      title: "О команде ALL TOUR",
      description:
        "ALL TOUR организует поездки из Алматы в Кыргызстан, Грузию и Китай. Узнайте о нашей работе и выберите тур.",
      ogImageAlt: "Команда ALL TOUR",
    },
    kz: {
      title: "ALL TOUR командасы туралы",
      description:
        "ALL TOUR Алматыдан Қырғызстанға, Грузияға және Қытайға сапарлар ұйымдастырады. Жұмысымыз туралы біліп, тур таңдаңыз.",
      ogImageAlt: "ALL TOUR командасы",
    },
  },
  "/reviews": {
    ru: {
      title: "Отзывы о поездках | ALL TOUR",
      description:
        "Отзывы участников поездок ALL TOUR. Сообщения из WhatsApp и сторис в Instagram.",
      ogImageAlt: "Отзывы и истории путешественников ALL TOUR",
    },
    kz: {
      title: "Сапарлар туралы пікірлер | ALL TOUR",
      description:
        "ALL TOUR сапарлары қатысушыларының пікірлері. WhatsApp хабарламалары және Instagram стористері.",
      ogImageAlt: "ALL TOUR саяхатшыларының пікірлері мен оқиғалары",
    },
  },
  "/faq": {
    ru: {
      title: "Вопросы о поездках | ALL TOUR",
      description:
        "Часто задаваемые вопросы: порядок бронирования, город отправления Алматы, перечень необходимых документов и ответы по поездкам.",
      ogImageAlt: "Вопросы и ответы ALL TOUR",
    },
    kz: {
      title: "Сапарлар туралы сұрақтар | ALL TOUR",
      description:
        "Жиі қойылатын сұрақтар: брондау тәртібі, Алматы қаласынан шығу, қажетті құжаттар тізімі және сапарлар бойынша жауаптар.",
      ogImageAlt: "ALL TOUR жиі қойылатын сұрақтар",
    },
  },
  "/contacts": {
    ru: {
      title: "Контакты | ALL TOUR",
      description:
        "Контакты ALL TOUR: связь через WhatsApp, телефон, Instagram и форма обращения по турам с отправлением из Алматы.",
      ogImageAlt: "Контакты ALL TOUR",
    },
    kz: {
      title: "Байланыс | ALL TOUR",
      description:
        "ALL TOUR байланыс ақпараты: WhatsApp арқылы байланыс, телефон, Instagram және Алматыдан шығатын турлар бойынша сұраныс нысаны.",
      ogImageAlt: "ALL TOUR байланыс ақпараты",
    },
  },
  notFound: {
    ru: {
      title: "Страница не найдена | ALL TOUR",
      description:
        "Запрошенная страница не найдена. Перейдите в каталог доступных туров с отправлением из Алматы.",
      ogImageAlt: "Страница не найдена — ALL TOUR",
    },
    kz: {
      title: "Бет табылмады | ALL TOUR",
      description:
        "Сұралған бет табылмады. Алматыдан шығатын қолжетімді турлар каталогына өтіңіз.",
      ogImageAlt: "Бет табылмады — ALL TOUR",
    },
  },
};

/**
 * Lightweight SEO registry for tours.
 * Keeps heavy tour database (itineraries, included/excluded lists, etc.) out of the main entry bundle.
 * Parity with src/data/tours.ts is strictly enforced by unit test.
 */
export const TOUR_SEO_REGISTRY: Record<
  string,
  {
    title: LocalizedText;
    summary: LocalizedText;
    image: string;
  }
> = {
  "kyrgyzstan-content-tour": {
    title: {
      ru: "Кыргызстан: Небесный мост и Бишкек",
      kz: "Қырғызстан: Аспан көпірі және Бішкек",
    },
    summary: {
      ru: "Поездка из Алматы к Небесному мосту и в Бишкек. Канатная дорога, зиплайн, площадь Ала-Тоо и мечеть Борбудук.",
      kz: "Алматыдан Аспан көпіріне және Бішкекке сапар. Аспалы жол, зиплайн, Ала-Тоо алаңы және Борбудук мешіті.",
    },
    image: "/media/kyrgyzstan-hero.jpg",
  },
  "china-urumqi": {
    title: {
      ru: "Урумчи — 6 дней",
      kz: "Үрімші — 6 күн",
    },
    summary: {
      ru: "Тур из Алматы в Урумчи на 6 дней. Панда-парк, буддийский храм, парк Хуншань, рынок Дабазар и спа-комплекс West.",
      kz: "Алматыдан Үрімшіге 6 күндік тур. Панда-парк, Будда храмы, Хуншань саябағы, Дабазар базары және West спа-кешені.",
    },
    image: "/media/china-hero.jpg",
  },
  "china-content-3d": {
    title: {
      ru: "Инин (Кульджа) — 3 дня",
      kz: "Құлжа (Инин) — 3 күн",
    },
    summary: {
      ru: "Тур из Алматы в Инин на 3 дня. Квартал Казанчи, улица Liu Sen Jie, комплекс Light of the Silk Road и время для покупок.",
      kz: "Алматыдан Құлжаға 3 күндік тур. Қазаншы ауданы, Liu Sen Jie көшесі, Light of the Silk Road кешені және саудаға уақыт.",
    },
    image: "/media/china-3.jpg",
  },
  "discover-georgia": {
    title: {
      ru: "Грузия: Тбилиси и Казбеги",
      kz: "Грузия: Тбилиси және Казбеги",
    },
    summary: {
      ru: "Поездка из Алматы в Грузию. Старый Тбилиси, Военно-Грузинская дорога, Казбеги и церковь Гергети.",
      kz: "Алматыдан Грузияға сапар. Ескі Тбилиси, Әскери-Грузин жолы, Казбеги және Гергети шіркеуі.",
    },
    image: "/media/georgia-2.jpg",
  },
  "issyk-kul": {
    title: {
      ru: "Иссык-Куль",
      kz: "Ыстықкөл",
    },
    summary: {
      ru: "Поездка из Алматы на Иссык-Куль. Отдых на берегу озера и выезды в горные ущелья.",
      kz: "Алматыдан Ыстықкөлге сапар. Көл жағасындағы демалыс және тау шатқалдарына бару.",
    },
    image: "/media/kyrgyzstan-2.jpg",
  },
  "tien-shan-panoramas": {
    title: {
      ru: "Ущелья Тянь-Шаня",
      kz: "Тянь-Шань шатқалдары",
    },
    summary: {
      ru: "Поездка из Алматы в горы Кыргызстана. Прогулки по ущельям и остановки на смотровых площадках.",
      kz: "Алматыдан Қырғызстан тауларына сапар. Шатқалдарда серуендеу және шолу алаңдарында аялдау.",
    },
    image: "/media/kyrgyzstan-3.jpg",
  },
};

/**
 * Lightweight SEO registry for destinations.
 * Keeps destination objects out of the main entry bundle.
 * Parity with src/data/destinations.ts is strictly enforced by unit test.
 */
export const DESTINATION_SEO_REGISTRY: Record<
  string,
  {
    name: LocalizedText;
    editorialDescription: LocalizedText;
    image: string;
  }
> = {
  kyrgyzstan: {
    name: {
      ru: "КЫРГЫЗСТАН",
      kz: "ҚЫРҒЫЗСТАН",
    },
    editorialDescription: {
      ru: "Отдых у озера, прогулки в горах и экскурсии по Бишкеку.",
      kz: "Көл жағасындағы демалыс, тауда серуендеу және Бішкекке экскурсиялар.",
    },
    image: "/media/kyrgyzstan-2.jpg",
  },
  georgia: {
    name: {
      ru: "ГРУЗИЯ",
      kz: "ГРУЗИЯ",
    },
    editorialDescription: {
      ru: "Старый город, Военно-Грузинская дорога и церковь Гергети.",
      kz: "Ескі қала, Әскери-Грузин жолы және Гергети шіркеуі.",
    },
    image: "/media/georgia-2.jpg",
  },
  china: {
    name: {
      ru: "КИТАЙ",
      kz: "ҚЫТАЙ",
    },
    editorialDescription: {
      ru: "Музеи и парки Урумчи, улицы Инина и квартал Казанчи.",
      kz: "Үрімші музейлері мен саябақтары, Құлжа көшелері және Қазаншы ауданы.",
    },
    image: "/media/china-3.jpg",
  },
};

/**
 * Resolves SEO metadata for an individual tour by its slug.
 */
export function resolveTourSEO(slug: string, locale: Locale): PageSEOMetadata {
  const tour = TOUR_SEO_REGISTRY[slug];
  if (!tour) {
    const fallback = STATIC_ROUTE_SEO.notFound[locale];
    return {
      title: locale === "kz" ? "Тур табылмады | ALL TOUR" : "Тур не найден | ALL TOUR",
      description:
        locale === "kz"
          ? "Сұралған тур табылмады немесе жылжытылды. ALL TOUR каталогынан қолжетімді бағыттарды қараңыз."
          : "Запрошенный тур не найден или был перемещён. Ознакомьтесь с актуальными маршрутами в каталоге ALL TOUR.",
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
      ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
      ogImageAlt: fallback.ogImageAlt,
      canonicalPath: `/tours/${slug}`,
    };
  }

  const titleSuffix = locale === "kz" ? "Алматыдан тур | ALL TOUR" : "Тур из Алматы | ALL TOUR";
  const title = `${tour.title[locale]} — ${titleSuffix}`;
  const ctaNote =
    locale === "kz"
      ? "Алматыдан шығу. Бағдарлама сипаттамасы және WhatsApp арқылы кеңес."
      : "Отправление из Алматы. Описание программы и консультация в WhatsApp.";
  const description = `${tour.summary[locale]} ${ctaNote}`;

  return {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: "article",
    ogImage: tour.image || DEFAULT_OG_IMAGE,
    ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    ogImageAlt: tour.title[locale],
    canonicalPath: `/tours/${slug}`,
  };
}

/**
 * Resolves SEO metadata for a destination page by ID.
 */
export function resolveDestinationSEO(destinationId: string, locale: Locale): PageSEOMetadata {
  const dest = DESTINATION_SEO_REGISTRY[destinationId];

  if (!dest) {
    const fallback = STATIC_ROUTE_SEO.notFound[locale];
    return {
      title: fallback.title,
      description: fallback.description,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
      ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
      ogImageAlt: fallback.ogImageAlt,
      canonicalPath: `/destinations/${destinationId}`,
    };
  }

  const countryName = dest.name[locale];
  const title =
    locale === "kz"
      ? `${countryName} — Алматыдан турлар мен саяхаттар | ALL TOUR`
      : `${countryName} — Туры и путешествия из Алматы | ALL TOUR`;

  const ctaNote =
    locale === "kz"
      ? "Тур бағдарламалары, локациялар және WhatsApp арқылы кеңес."
      : "Программы туров, локации и консультация в WhatsApp.";
  const description = `${dest.editorialDescription[locale]} ${ctaNote}`;

  return {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: "website",
    ogImage: dest.image || DEFAULT_OG_IMAGE,
    ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    ogImageAlt: `${countryName} — ALL TOUR`,
    canonicalPath: `/destinations/${destinationId}`,
  };
}

/**
 * Main resolver mapping pathname, search query, and locale to complete SEO metadata.
 */
export function resolveRouteSEO(
  pathname: string,
  search: string,
  locale: Locale
): PageSEOMetadata {
  const normPath = pathname.replace(/\/+$/, "") || "/";

  // Catalog favorites check: /tours?favorites=true
  if (normPath === "/tours") {
    const params = new URLSearchParams(search);
    if (params.get("favorites") === "true") {
      const data = STATIC_ROUTE_SEO["/tours?favorites=true"][locale];
      return {
        title: data.title,
        description: data.description,
        ogType: "website",
        ogImage: DEFAULT_OG_IMAGE,
        ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
        ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
        ogImageAlt: data.ogImageAlt,
        canonicalPath: "/tours",
      };
    }
  }

  // Static routes
  if (STATIC_ROUTE_SEO[normPath]) {
    const data = STATIC_ROUTE_SEO[normPath][locale];
    return {
      title: data.title,
      description: data.description,
      ogType: "website",
      ogImage: DEFAULT_OG_IMAGE,
      ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
      ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
      ogImageAlt: data.ogImageAlt,
      canonicalPath: normPath,
    };
  }

  // Tour detail route: /tours/:slug
  const tourMatch = normPath.match(/^\/tours\/([^/]+)$/);
  if (tourMatch) {
    return resolveTourSEO(tourMatch[1], locale);
  }

  // Destination route: /destinations/:destinationId
  const destMatch = normPath.match(/^\/destinations\/([^/]+)$/);
  if (destMatch) {
    return resolveDestinationSEO(destMatch[1], locale);
  }

  // Fallback for unknown routes
  const notFound = STATIC_ROUTE_SEO.notFound[locale];
  return {
    title: notFound.title,
    description: notFound.description,
    ogType: "website",
    ogImage: DEFAULT_OG_IMAGE,
    ogImageWidth: DEFAULT_OG_IMAGE_WIDTH,
    ogImageHeight: DEFAULT_OG_IMAGE_HEIGHT,
    ogImageAlt: notFound.ogImageAlt,
    canonicalPath: normPath,
  };
}
