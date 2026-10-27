import type { DestinationId, LocalizedText } from "./destinations";

export type BrandAssetCategory =
  | "logo"
  | "poster_china_urumqi"
  | "poster_china_3d"
  | "poster_kyrgyzstan"
  | "reviews";

export interface BrandAssetItem {
  id: string;
  src: string;
  category: BrandAssetCategory;
  destinationId?: DestinationId;
  tourId?: string;
  aspectRatio: "1:1" | "3:4" | "9:16";
  title: LocalizedText;
  caption: LocalizedText;
  isHistoricalPromo?: boolean;
}

export const OFFICIAL_LOGO = {
  originalJpg: "/assets/brand/photo_16.jpg",
  transparentPng: "/assets/brand/logo-transparent.png",
  markPng: "/assets/brand/logo-mark.png",
  faviconPng: "/favicon.png",
  groupChinaPhoto: "/assets/brand/group-china-tour.png",
};

export const brandAssets: BrandAssetItem[] = [
  {
    id: "photo_16",
    src: "/assets/brand/photo_16.jpg",
    category: "logo",
    aspectRatio: "1:1",
    title: {
      ru: "Логотип ALL TOUR",
      kz: "ALL TOUR логотипі",
    },
    caption: {
      ru: "ALL TOUR",
      kz: "ALL TOUR",
    },
  },
  {
    id: "photo_1",
    src: "/assets/brand/photo_1.jpg",
    category: "poster_china_urumqi",
    destinationId: "china",
    tourId: "china-urumqi-6d",
    aspectRatio: "3:4",
    isHistoricalPromo: true,
    title: {
      ru: "Урумчи — 6 дней",
      kz: "Үрімші — 6 күн",
    },
    caption: {
      ru: "Программа тура. Стоимость и даты уточните у менеджера.",
      kz: "Тур бағдарламасы. Баға мен күндерді менеджерден нақтылаңыз.",
    },
  },
  {
    id: "photo_13",
    src: "/assets/brand/photo_13.jpg",
    category: "poster_china_urumqi",
    destinationId: "china",
    tourId: "china-urumqi-6d",
    aspectRatio: "3:4",
    isHistoricalPromo: true,
    title: {
      ru: "Что входит в тур в Урумчи",
      kz: "Үрімші турына не кіреді",
    },
    caption: {
      ru: "Проезд, отель, завтраки и гид. Помощь на границе, с WeChat и VPN.",
      kz: "Жол, қонақүй, таңғы ас және гид. Шекарада, WeChat пен VPN бойынша көмек.",
    },
  },
  {
    id: "photo_15",
    src: "/assets/brand/photo_15.jpg",
    category: "poster_china_urumqi",
    destinationId: "china",
    tourId: "china-urumqi-6d",
    aspectRatio: "3:4",
    title: {
      ru: "Достопримечательности в программе Урумчи",
      kz: "Үрімші бағдарламасындағы көрікті жерлер",
    },
    caption: {
      ru: "Буддийский храм, музей, рынок Дабазар, парк Хуншань и Панда-парк.",
      kz: "Будда храмы, музей, Дабазар базары, Хуншань саябағы және Панда-парк.",
    },
  },
  {
    id: "photo_14",
    src: "/assets/brand/photo_14.jpg",
    category: "poster_china_urumqi",
    destinationId: "china",
    tourId: "china-urumqi-6d",
    aspectRatio: "3:4",
    title: {
      ru: "Вечерняя программа Урумчи",
      kz: "Үрімшінің кешкі бағдарламасы",
    },
    caption: {
      ru: "Улица Красных фонарей, спа-комплекс West и дополнительные развлечения.",
      kz: "Қызыл шамдар көшесі, West спа-кешені және қосымша ойын-сауық.",
    },
  },
  {
    id: "photo_12",
    src: "/assets/brand/photo_12.jpg",
    category: "poster_china_3d",
    destinationId: "china",
    tourId: "china-content-3d",
    aspectRatio: "3:4",
    isHistoricalPromo: true,
    title: {
      ru: "Инин (Кульджа) — 3 дня",
      kz: "Құлжа (Инин) — 3 күн",
    },
    caption: {
      ru: "Программа тура. Стоимость и даты уточните у менеджера.",
      kz: "Тур бағдарламасы. Баға мен күндерді менеджерден нақтылаңыз.",
    },
  },
  {
    id: "photo_7",
    src: "/assets/brand/photo_7.jpg",
    category: "poster_china_3d",
    destinationId: "china",
    tourId: "china-content-3d",
    aspectRatio: "3:4",
    title: {
      ru: "Что входит в тур в Инин",
      kz: "Құлжа турына не кіреді",
    },
    caption: {
      ru: "Проезд, отель, завтраки и гид. Обеды, ужины и входные билеты оплачиваются отдельно.",
      kz: "Жол, қонақүй, таңғы ас және гид. Түскі, кешкі ас және кіру билеттері бөлек төленеді.",
    },
  },
  {
    id: "photo_8",
    src: "/assets/brand/photo_8.jpg",
    category: "poster_china_3d",
    destinationId: "china",
    tourId: "china-content-3d",
    aspectRatio: "3:4",
    title: {
      ru: "Программа тура в Инин",
      kz: "Құлжа турының бағдарламасы",
    },
    caption: {
      ru: "Улица Liu Sen Jie, квартал Казанчи, Light of the Silk Road, парк аттракционов, баня и прогулка на катере.",
      kz: "Liu Sen Jie көшесі, Қазаншы ауданы, Light of the Silk Road, аттракциондар саябағы, монша және катермен серуендеу.",
    },
  },
  {
    id: "photo_11",
    src: "/assets/brand/photo_11.jpg",
    category: "poster_kyrgyzstan",
    destinationId: "kyrgyzstan",
    tourId: "kyrgyzstan-content-tour",
    aspectRatio: "3:4",
    isHistoricalPromo: true,
    title: {
      ru: "Кыргызстан: Небесный мост и Бишкек",
      kz: "Қырғызстан: Аспан көпірі және Бішкек",
    },
    caption: {
      ru: "Программа однодневного тура. Стоимость и даты уточните у менеджера.",
      kz: "Біркүндік тур бағдарламасы. Баға мен күндерді менеджерден нақтылаңыз.",
    },
  },
  {
    id: "photo_9",
    src: "/assets/brand/photo_9.jpg",
    category: "poster_kyrgyzstan",
    destinationId: "kyrgyzstan",
    tourId: "kyrgyzstan-content-tour",
    aspectRatio: "3:4",
    isHistoricalPromo: true,
    title: {
      ru: "Что входит в тур в Кыргызстан",
      kz: "Қырғызстан турына не кіреді",
    },
    caption: {
      ru: "Проезд и гид включены. Питание, входные билеты, канатная дорога и зиплайн оплачиваются отдельно.",
      kz: "Жол мен гид кіреді. Тамақтану, кіру билеттері, аспалы жол және зиплайн бөлек төленеді.",
    },
  },
  {
    id: "photo_10",
    src: "/assets/brand/photo_10.jpg",
    category: "poster_kyrgyzstan",
    destinationId: "kyrgyzstan",
    tourId: "kyrgyzstan-content-tour",
    aspectRatio: "3:4",
    title: {
      ru: "Места в программе тура",
      kz: "Тур бағдарламасындағы орындар",
    },
    caption: {
      ru: "Канатная дорога, Небесные качели, Зиплайн, Небесный мост, Мечеть Борбудук и Центральная площадь Бишкека.",
      kz: "Аспалы жол, Аспан әткеншегі, Зиплайн, Аспан көпірі, Борбудук мешіті және Бішкектің Орталық алаңы.",
    },
  },
  {
    id: "photo_2",
    src: "/assets/brand/photo_2.jpg",
    category: "reviews",
    destinationId: "china",
    tourId: "china-content-3d",
    aspectRatio: "9:16",
    title: {
      ru: "Фото группы и отзывы о поездке в Китай",
      kz: "Топ фотосы және Қытай сапары туралы пікірлер",
    },
    caption: {
      ru: "Участники поездки и сообщения из WhatsApp.",
      kz: "Сапар қатысушылары және WhatsApp хабарламалары.",
    },
  },
  {
    id: "photo_3",
    src: "/assets/brand/photo_3.jpg",
    category: "reviews",
    aspectRatio: "9:16",
    title: {
      ru: "Отзыв о поездке с ребёнком",
      kz: "Баламен сапар туралы пікір",
    },
    caption: {
      ru: "Отзыв семьи о поездке с ALL TOUR.",
      kz: "Отбасының ALL TOUR сапары туралы пікірі.",
    },
  },
  {
    id: "photo_4",
    src: "/assets/brand/photo_4.jpg",
    category: "reviews",
    aspectRatio: "9:16",
    title: {
      ru: "Отзывы из группового чата двухдневного тура",
      kz: "Екі күндік турдың топтық чатындағы пікірлер",
    },
    caption: {
      ru: "Скриншот благодарностей гиду Ардак и команде ALL TOUR от участников поездки.",
      kz: "Сапар қатысушыларынан гид Ардақ пен ALL TOUR командасына алғыс скриншоты.",
    },
  },
  {
    id: "photo_5",
    src: "/assets/brand/photo_5.jpg",
    category: "reviews",
    destinationId: "kyrgyzstan",
    tourId: "kyrgyzstan-content-tour",
    aspectRatio: "9:16",
    title: {
      ru: "Сторис из Кыргызстана",
      kz: "Қырғызстаннан сторис",
    },
    caption: {
      ru: "Репосты впечатлений об однодневном туре в Кыргызстан, прыжке с тарзанки и прогулке по площади Ала-Тоо.",
      kz: "Қырғызстанға біркүндік тур, тарзанкадан секіру және Ала-Тоо алаңындағы серуен туралы әсерлер.",
    },
  },
  {
    id: "photo_6",
    src: "/assets/brand/photo_6.jpg",
    category: "reviews",
    destinationId: "kyrgyzstan",
    tourId: "kyrgyzstan-content-tour",
    aspectRatio: "9:16",
    title: {
      ru: "Отзывы о работе гида Дильмины на маршруте в Кыргызстане",
      kz: "Қырғызстан бағытындағы гид Дильминаның жұмысы туралы пікірлер",
    },
    caption: {
      ru: "Отзывы участников из Instagram и WhatsApp.",
      kz: "Қатысушылардың Instagram және WhatsApp-тағы пікірлері.",
    },
  },
];

export function getBrandAssetsByDestination(
  destinationId: DestinationId
): BrandAssetItem[] {
  return brandAssets.filter((item) => item.destinationId === destinationId);
}

export function getBrandAssetsByTour(tourId: string): BrandAssetItem[] {
  return brandAssets.filter((item) => item.tourId === tourId);
}

export const BRAND_ASSETS = brandAssets;
export const BRAND_LOGO = OFFICIAL_LOGO;

