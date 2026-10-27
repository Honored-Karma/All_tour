export type DestinationId = "kyrgyzstan" | "georgia" | "china";

export interface DestinationMedia {
  heroImage: string;
  mobileImage?: string;
  secondaryImage: string;
  backgroundVideo?: string;
  poster?: string;
  objectPositionDesktop: string;
  objectPositionMobile: string;
  fallbackGradient: string;
}

export interface DestinationPalette {
  primary: string;
  accent: string;
  surface: string;
  charcoal: string;
  glassTint: string;
  glowColor: string;
}

export interface LocalizedText {
  ru: string;
  kz: string;
}

export interface Destination {
  id: DestinationId;
  indexLabel: string;
  stepNumber: string;
  name: LocalizedText;
  kicker: LocalizedText;
  tagline: LocalizedText;
  atmosphereNote: LocalizedText;
  editorialDescription: LocalizedText;
  ctaLabel: LocalizedText;
  elevationOrRegion: LocalizedText;
  highlights: {
    ru: string[];
    kz: string[];
  };
  palette: DestinationPalette;
  media: DestinationMedia;
}

export const destinations: Destination[] = [
  {
    id: "kyrgyzstan",
    indexLabel: "01 / 03",
    stepNumber: "01",
    name: {
      ru: "КЫРГЫЗСТАН",
      kz: "ҚЫРҒЫЗСТАН",
    },
    kicker: {
      ru: "ТУРЫ В КЫРГЫЗСТАН",
      kz: "ҚЫРҒЫЗСТАНҒА ТУРЛАР",
    },
    tagline: {
      ru: "Иссык-Куль и горы Тянь-Шаня",
      kz: "Ыстықкөл және Тянь-Шань таулары",
    },
    atmosphereNote: {
      ru: "Поездки из Алматы к озеру Иссык-Куль, в горные ущелья и Бишкек.",
      kz: "Алматыдан Ыстықкөлге, тау шатқалдарына және Бішкекке сапарлар.",
    },
    editorialDescription: {
      ru: "Отдых у озера, прогулки в горах и экскурсии по Бишкеку.",
      kz: "Көл жағасындағы демалыс, тауда серуендеу және Бішкекке экскурсиялар.",
    },
    ctaLabel: {
      ru: "Смотреть туры →",
      kz: "Турларды көру →",
    },
    elevationOrRegion: {
      ru: "Иссык-Куль · Тянь-Шань",
      kz: "Ыстықкөл · Тянь-Шань",
    },
    highlights: {
      ru: ["Озеро Иссык-Куль", "Горы Тянь-Шаня", "Альпийские ущелья"],
      kz: ["Ыстықкөл", "Тянь-Шань таулары", "Альпі шатқалдары"],
    },
    palette: {
      primary: "#163E54",
      accent: "#6BAFB3",
      surface: "#E8E6DF",
      charcoal: "#182C32",
      glassTint: "rgba(22, 62, 84, 0.32)",
      glowColor: "rgba(107, 175, 179, 0.25)",
    },
    media: {
      heroImage: "/media/kyrgyzstan-2.jpg",
      mobileImage: "/media/kyrgyzstan-2.jpg",
      secondaryImage: "/media/kyrgyzstan-3.jpg",
      objectPositionDesktop: "center 52%",
      objectPositionMobile: "center 55%",
      fallbackGradient:
        "radial-gradient(circle at 65% 30%, #2a637c 0%, #163E54 48%, #0d1d24 100%)",
    },
  },
  {
    id: "georgia",
    indexLabel: "02 / 03",
    stepNumber: "02",
    name: {
      ru: "ГРУЗИЯ",
      kz: "ГРУЗИЯ",
    },
    kicker: {
      ru: "ТУРЫ В ГРУЗИЮ",
      kz: "ГРУЗИЯҒА ТУРЛАР",
    },
    tagline: {
      ru: "Тбилиси и Казбеги",
      kz: "Тбилиси және Казбеги",
    },
    atmosphereNote: {
      ru: "Прогулки по старому Тбилиси и поездка в горы Кавказа.",
      kz: "Ескі Тбилисиде серуендеу және Кавказ тауларына сапар.",
    },
    editorialDescription: {
      ru: "Старый город, Военно-Грузинская дорога и церковь Гергети.",
      kz: "Ескі қала, Әскери-Грузин жолы және Гергети шіркеуі.",
    },
    ctaLabel: {
      ru: "Смотреть туры →",
      kz: "Турларды көру →",
    },
    elevationOrRegion: {
      ru: "Казбеги · Тбилиси · Кавказ",
      kz: "Казбеги · Тбилиси · Кавказ",
    },
    highlights: {
      ru: ["Казбеги и Гергети", "Старый Тбилиси", "Кавказский хребет"],
      kz: ["Казбеги мен Гергети", "Ескі Тбилиси", "Кавказ жотасы"],
    },
    palette: {
      primary: "#8A6A50",
      accent: "#EDE6DA",
      surface: "#344438",
      charcoal: "#35414B",
      glassTint: "rgba(74, 56, 42, 0.34)",
      glowColor: "rgba(200, 168, 121, 0.24)",
    },
    media: {
      heroImage: "/media/georgia-2.jpg",
      mobileImage: "/media/georgia-2.jpg",
      secondaryImage: "/media/georgia-3.jpg",
      objectPositionDesktop: "center 45%",
      objectPositionMobile: "54% 45%",
      fallbackGradient:
        "radial-gradient(circle at 60% 35%, #8A6A50 0%, #344438 52%, #1b2226 100%)",
    },
  },
  {
    id: "china",
    indexLabel: "03 / 03",
    stepNumber: "03",
    name: {
      ru: "КИТАЙ",
      kz: "ҚЫТАЙ",
    },
    kicker: {
      ru: "ТУРЫ В КИТАЙ",
      kz: "ҚЫТАЙҒА ТУРЛАР",
    },
    tagline: {
      ru: "Урумчи и Инин",
      kz: "Үрімші және Құлжа",
    },
    atmosphereNote: {
      ru: "Экскурсии, прогулки по городу и время для покупок.",
      kz: "Экскурсиялар, қалада серуендеу және саудаға уақыт.",
    },
    editorialDescription: {
      ru: "Музеи и парки Урумчи, улицы Инина и квартал Казанчи.",
      kz: "Үрімші музейлері мен саябақтары, Құлжа көшелері және Қазаншы ауданы.",
    },
    ctaLabel: {
      ru: "Смотреть туры →",
      kz: "Турларды көру →",
    },
    elevationOrRegion: {
      ru: "Урумчи · Инин",
      kz: "Үрімші · Құлжа",
    },
    highlights: {
      ru: ["Инин и квартал Казанчи", "Природа Синьцзяна", "Традиционная архитектура"],
      kz: ["Құлжа мен Қазаншы", "Шыңжаң табиғаты", "Дәстүрлі сәулет"],
    },
    palette: {
      primary: "#17242D",
      accent: "#C8A879",
      surface: "#9F403A",
      charcoal: "#64817B",
      glassTint: "rgba(23, 36, 45, 0.38)",
      glowColor: "rgba(159, 64, 58, 0.25)",
    },
    media: {
      heroImage: "/media/china-3.jpg",
      mobileImage: "/media/china-3.jpg",
      secondaryImage: "/media/china-2.jpg",
      objectPositionDesktop: "center 50%",
      objectPositionMobile: "center 50%",
      fallbackGradient:
        "radial-gradient(circle at 60% 35%, #5c2a28 0%, #17242D 55%, #0c1318 100%)",
    },
  },
];

export function getDestinationById(id: DestinationId): Destination {
  return destinations.find((d) => d.id === id) || destinations[0];
}
