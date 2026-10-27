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
      title: "ALL TOUR — Туры и контент-путешествия из Алматы",
      description:
        "Авторские программы и путешествия с отправлением из Алматы в Кыргызстан, Грузию и Китай. Просмотр маршрутов, фотогалереи и связь в WhatsApp.",
      ogImageAlt: "ALL TOUR — Туры и контент-путешествия из Алматы",
    },
    kz: {
      title: "ALL TOUR — Алматыдан турлар мен контент-саяхаттар",
      description:
        "Алматыдан шығатын Қырғызстан, Грузия және Қытай бағыттарындағы авторлық бағдарламалар мен саяхаттар. Бағыттарды көру, фотогалерея және WhatsApp арқылы байланыс.",
      ogImageAlt: "ALL TOUR — Алматыдан турлар мен контент-саяхаттар",
    },
  },
  "/tours": {
    ru: {
      title: "Каталог туров из Алматы — Кыргызстан, Грузия, Китай | ALL TOUR",
      description:
        "Каталог авторских туров с выездом из Алматы. Фильтры по странам, длительности и типам поездок, подробные программы и консультация в WhatsApp.",
      ogImageAlt: "Каталог туров ALL TOUR из Алматы",
    },
    kz: {
      title: "Алматыдан турлар каталогы — Қырғызстан, Грузия, Қытай | ALL TOUR",
      description:
        "Алматыдан шығатын авторлық турлар каталогы. Елдер, ұзақтық және саяхат түрлері бойынша сүзгілер, толық бағдарламалар және WhatsApp арқылы кеңес.",
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
      title: "О компании ALL TOUR — Контент-туры из Алматы",
      description:
        "Информация о проекте ALL TOUR: направления путешествий из Алматы, форматы авторских поездок, сопровождение на маршрутах и история создания.",
      ogImageAlt: "О проекте ALL TOUR",
    },
    kz: {
      title: "ALL TOUR туралы — Алматыдан контент-турлар",
      description:
        "ALL TOUR жобасы туралы ақпарат: Алматыдан саяхат бағыттары, авторлық сапар форматтары, бағыттардағы сүйемелдеу және құрылу тарихы.",
      ogImageAlt: "ALL TOUR жобасы туралы",
    },
  },
  "/reviews": {
    ru: {
      title: "Отзывы путешественников и фотоистории | ALL TOUR",
      description:
        "Отзывы участников поездок ALL TOUR по направлениям Кыргызстан, Грузия и Китай, фотоистории и впечатления о маршрутах.",
      ogImageAlt: "Отзывы и истории путешественников ALL TOUR",
    },
    kz: {
      title: "Саяхатшылардың пікірлері мен фотооқиғалары | ALL TOUR",
      description:
        "Қырғызстан, Грузия және Қытай бағыттары бойынша ALL TOUR сапар қатысушыларының пікірлері, фотооқиғалар және маршруттар туралы әсерлер.",
      ogImageAlt: "ALL TOUR саяхатшыларының пікірлері мен оқиғалары",
    },
  },
  "/faq": {
    ru: {
      title: "Часто задаваемые вопросы (FAQ) | ALL TOUR",
      description:
        "Часто задаваемые вопросы: порядок бронирования, город отправления Алматы, перечень необходимых документов и ответы по поездкам.",
      ogImageAlt: "Вопросы и ответы ALL TOUR",
    },
    kz: {
      title: "Жиі қойылатын сұрақтар (FAQ) | ALL TOUR",
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
      ru: "Контент-тур в Кыргызстан и сити-тур по Бишкеку",
      kz: "Қырғызстанға контент-тур және Бішкек сити-туры",
    },
    summary: {
      ru: "Насыщенный выезд из Алматы: панорамный небесный мост, канатная дорога, небесные качели, зиплайн и вечерний сити-тур по Бишкеку (площадь Ала-Тоо и мечеть Борбудук).",
      kz: "Алматыдан әсерлі сапар: панорамалық аспан көпірі, аспалы жол, аспан әткеншегі, зиплайн және Бішкек бойынша сити-тур (Ала-Тоо алаңы мен Борбудук мешіті).",
    },
    image: "/media/kyrgyzstan-hero.jpg",
  },
  "china-urumqi": {
    title: {
      ru: "Контент-тур в Урумчи (6 дней / 5 ночей)",
      kz: "Үрімшіге контент-тур (6 күн / 5 түн)",
    },
    summary: {
      ru: "Флагманский 6-дневный тур из Алматы в Урумчи: знакомство с пандами, золотой Буддийский храм, парк Красная гора (Хуншань), Spa-комплекс «West», шопинг и вечерние огни мегаполиса.",
      kz: "Алматыдан Үрімшіге флагмандық 6 күндік тур: пандалармен танысу, алтын Будда храмы, Қызыл тау (Хуншань) саябағы, «West» Spa-кешені, шопинг және мегаполистің кешкі шамдары.",
    },
    image: "/media/china-hero.jpg",
  },
  "china-content-3d": {
    title: {
      ru: "Контент-тур в Китай: Инин / Кульджа (3 дня / 2 ночи)",
      kz: "Қытайға контент-тур: Құлжа / Инин (3 күн / 2 түн)",
    },
    summary: {
      ru: "Компактный 3-дневный контент-тур из Алматы в Китай: улица Liu Sen Jie, этно-квартал Qazanchi, вечерний комплекс Light of the Silk Road, парк аттракционов, безлимитная китайская баня, прогулка на катере и шопинг.",
      kz: "Алматыдан Қытайға ықшам 3 күндік контент-тур: Liu Sen Jie көшесі, Qazanchi этно-кварталы, Light of the Silk Road кешкі кешені, аттракциондар саябағы, лимитсіз қытай моншасы, катермен серуендеу және шопинг.",
    },
    image: "/media/china-3.jpg",
  },
  "discover-georgia": {
    title: {
      ru: "Открой Грузию: Тбилиси и Казбеги",
      kz: "Грузияны аш: Тбилиси мен Казбеги",
    },
    summary: {
      ru: "Атмосферное путешествие из Алматы в Грузию: старинные кварталы Тбилиси, панорамы Большого Кавказа, Казбеги и знаменитый храм Гергети под облаками.",
      kz: "Алматыдан Грузияға атмосфералық саяхат: Тбилисидің көне кварталдары, Үлкен Кавказ панорамасы, Казбеги және бұлт астындағы әйгілі Гергети храмы.",
    },
    image: "/media/georgia-2.jpg",
  },
  "issyk-kul": {
    title: {
      ru: "Иссык-Куль и панорамы Тянь-Шаня",
      kz: "Ыстықкөл және Тянь-Шань панорамасы",
    },
    summary: {
      ru: "Путешествие из Алматы к горному озеру Иссык-Куль: отдых у воды, свежий альпийский воздух и живописные ущелья Северного Тянь-Шаня.",
      kz: "Алматыдан таулы Ыстықкөлге саяхат: су жағасындағы демалыс, таза альпі ауасы және Солтүстік Тянь-Шаньның көркем шатқалдары.",
    },
    image: "/media/kyrgyzstan-2.jpg",
  },
  "tien-shan-panoramas": {
    title: {
      ru: "Ущелья Тянь-Шаня и горные каньоны",
      kz: "Тянь-Шань шатқалдары мен тау каньондары",
    },
    summary: {
      ru: "Природный маршрут для ценителей горных пейзажей Кыргызстана: прогулки по ущельям, смотровые площадки и чистый воздух Тянь-Шаня.",
      kz: "Қырғызстанның тау пейзаждарын бағалайтындарға арналған табиғи бағыт: шатқалдарда серуендеу, шолу алаңдары және Тянь-Шаньның таза ауасы.",
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
      ru: "Берега Иссык-Куля, альпийские луга и горные каньоны создают ощущение абсолютной свободы и простора.",
      kz: "Ыстықкөл жағалауы, альпілік шалғындар мен тау шатқалдары еркіндік пен кеңістік сезімін сыйлайды.",
    },
    image: "/media/kyrgyzstan-2.jpg",
  },
  georgia: {
    name: {
      ru: "ГРУЗИЯ",
      kz: "ГРУЗИЯ",
    },
    editorialDescription: {
      ru: "От панорам Гергетской церкви под облаками до уютных каменных улочек и виноградных долин.",
      kz: "Бұлт астындағы Гергети шіркеуінің панорамасынан бастап тас көшелер мен жүзім алқаптарына дейін.",
    },
    image: "/media/georgia-2.jpg",
  },
  china: {
    name: {
      ru: "КИТАЙ",
      kz: "ҚЫТАЙ",
    },
    editorialDescription: {
      ru: "Яркая архитектура, живые ремесленные улицы, природные панорамы и совершенно иной культурный масштаб.",
      kz: "Айрықша сәулет, қолөнер көшелері, табиғи панорамалар және мүлдем жаңа мәдени кеңістік.",
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
