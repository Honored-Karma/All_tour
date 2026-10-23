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
  coordinates: string;
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
      ru: "01 / 03 — ОТКРОЙ КЫРГЫЗСТАН",
      kz: "01 / 03 — ҚЫРҒЫЗСТАНДЫ АШ",
    },
    tagline: {
      ru: "Там, где горы встречаются с небом.",
      kz: "Таулар мен аспан түйісетін мекен.",
    },
    atmosphereNote: {
      ru: "Бирюзовая гладь озера Иссык-Куль, хвойные ущелья Тянь-Шаня и чистый высокогорный воздух всего в нескольких часах пути от Алматы.",
      kz: "Ыстықкөлдің көгілдір айдыны, Тянь-Шаньның шыршалы шатқалдары мен таза биік тау ауасы Алматыдан бірнеше сағаттық жерде.",
    },
    editorialDescription: {
      ru: "Берега Иссык-Куля, альпийские луга и горные каньоны создают ощущение абсолютной свободы и простора.",
      kz: "Ыстықкөл жағалауы, альпілік шалғындар мен тау шатқалдары еркіндік пен кеңістік сезімін сыйлайды.",
    },
    ctaLabel: {
      ru: "Смотреть туры →",
      kz: "Турларды көру →",
    },
    coordinates: "42°25′N 77°15′E",
    elevationOrRegion: {
      ru: "Иссык-Куль · Тянь-Шань · 1 607 м",
      kz: "Ыстықкөл · Тянь-Шань · 1 607 м",
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
      ru: "02 / 03 — ПОЧУВСТВУЙ ГРУЗИЮ",
      kz: "02 / 03 — ГРУЗИЯНЫ СЕЗІН",
    },
    tagline: {
      ru: "Горы, истории и места, в которые возвращаются.",
      kz: "Таулар, тарихтар және қайта оралғың келетін жерлер.",
    },
    atmosphereNote: {
      ru: "Тёплый золотой свет над вершинами Казбеги, древняя архитектура Тбилиси и гостеприимство Кавказа.",
      kz: "Казбеги шыңдарының үстіндегі жылы алтын сәуле, Тбилисидің көне сәулеті және Кавказ қонақжайлылығы.",
    },
    editorialDescription: {
      ru: "От панорам Гергетской церкви под облаками до уютных каменных улочек и виноградных долин.",
      kz: "Бұлт астындағы Гергети шіркеуінің панорамасынан бастап тас көшелер мен жүзім алқаптарына дейін.",
    },
    ctaLabel: {
      ru: "Исследовать направление →",
      kz: "Бағытты зерттеу →",
    },
    coordinates: "42°39′N 44°37′E",
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
      ru: "03 / 03 — ОТКРОЙ КИТАЙ",
      kz: "03 / 03 — ҚЫТАЙДЫ АШ",
    },
    tagline: {
      ru: "Открой мир по ту сторону привычного.",
      kz: "Үйреншікті шекарадан тыс әлемді аш.",
    },
    atmosphereNote: {
      ru: "Атмосферные кварталы Инина, культурное наследие Синьцзяна, вечерние огни и контраст древних традиций с ритмом современного Востока.",
      kz: "Құлжаның атмосфералық кварталдары, Шыңжаңның мәдени мұрасы, кешкі шамдар және ежелгі дәстүрлер мен заманауи Шығыс ырғағы.",
    },
    editorialDescription: {
      ru: "Яркая архитектура, живые ремесленные улицы, природные панорамы и совершенно иной культурный масштаб.",
      kz: "Айрықша сәулет, қолөнер көшелері, табиғи панорамалар және мүлдем жаңа мәдени кеңістік.",
    },
    ctaLabel: {
      ru: "Узнать о турах →",
      kz: "Турлар туралы білу →",
    },
    coordinates: "43°55′N 81°19′E",
    elevationOrRegion: {
      ru: "Инин (Кульджа) · Синьцзян · Культурные маршруты",
      kz: "Құлжа (Инин) · Шыңжаң · Мәдени бағыттар",
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
