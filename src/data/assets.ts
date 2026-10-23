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
  groupChinaPhoto: "/assets/brand/group-china-tour.jpg",
};

export const brandAssets: BrandAssetItem[] = [
  {
    id: "photo_16",
    src: "/assets/brand/photo_16.jpg",
    category: "logo",
    aspectRatio: "1:1",
    title: {
      ru: "Официальный логотип ALL TOUR · CONTENT TOUR",
      kz: "ALL TOUR · CONTENT TOUR ресми логотипі",
    },
    caption: {
      ru: "Фирменный знак компании: авиационное и автобусное направления, горный мотив и центральный символ A.",
      kz: "Компанияның фирмалық белгісі: әуе және автобус бағыттары, тау мотиві және орталық A символы.",
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
      ru: "Контент-тур в Урумчи — Главная афиша (6 дней / 5 ночей)",
      kz: "Үрімшіге контент-тур — Басты афиша (6 күн / 5 түн)",
    },
    caption: {
      ru: "Оригинальный промо-постер тура в Урумчи (на материале: 6 дней / 5 ночей, 145 000 ₸). Актуальность цены и дат уточняйте у менеджера.",
      kz: "Үрімші турының түпнұсқа промо-постері (материалда: 6 күн / 5 түн, 145 000 ₸). Өзекті баға мен күндерді менеджерден нақтылаңыз.",
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
      ru: "Условия поездки Алматы — Урумчи — Алматы",
      kz: "Алматы — Үрімші — Алматы сапар шарттары",
    },
    caption: {
      ru: "Что входит в тур в Урумчи: транспорт Алматы — Урумчи — Алматы, гостиница (5 дней / 4 ночи), завтраки, гид, помощь на границе, WeChat и VPN.",
      kz: "Үрімші турына кіретін қызметтер: Алматы — Үрімші — Алматы көлігі, қонақүй (5 күн / 4 түн), таңғы ас, гид, шекарада көмек, WeChat және VPN.",
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
      ru: "Буддийский храм, Новый музей Урумчи, Международный рынок Дабазар, торговый квартал Шао-си-мыр, парк Хуншань (Красная гора), Панда-парк и зоопарк.",
      kz: "Будда храмы, Үрімші жаңа музейі, Дабазар халықаралық базары, Шао-си-мыр сауда кварталы, Хуншань саябағы (Қызыл тау), Панда-парк және хайуанаттар бағы.",
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
      ru: "Вечерняя и дополнительная программа Урумчи",
      kz: "Үрімшінің кешкі және қосымша бағдарламасы",
    },
    caption: {
      ru: "Знаменитая улица Красных фонарей и Spa-комплекс «West», а также локации по желанию: Океанариум, Парк аттракционов, Императорский ужин и ночной Урумчи.",
      kz: "Атақты Қызыл шамдар көшесі мен «West» Spa-кешені, сондай-ақ қалауыңыз бойынша: Океанариум, Аттракциондар саябағы, Императорлық кешкі ас және түнгі Үрімші.",
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
      ru: "Контент-тур в Китай — 3 дня / 2 ночи (промо-афиша)",
      kz: "Қытайға контент-тур — 3 күн / 2 түн (промо-афиша)",
    },
    caption: {
      ru: "Отдельная 3-дневная программа (на архивной афише: 85 000 ₸, даты октября). Не смешивается с 6-дневным туром в Урумчи. Актуальные даты уточняйте.",
      kz: "Бөлек 3 күндік бағдарлама (мұрағаттық афишада: 85 000 ₸, қазан күндері). Үрімшідегі 6 күндік турмен араласпайды. Өзекті күндерді нақтылаңыз.",
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
      ru: "Условия и состав контент-тура в Китай",
      kz: "Қытайға контент-турдың шарттары мен құрамы",
    },
    caption: {
      ru: "Включено: транспорт, проживание, завтраки, трансферы, гид, помощь на границе и с документами, миграционная карта, VPN и WeChat. Питание и входные билеты не входят.",
      kz: "Кіреді: көлік, тұру, таңғы ас, трансферлер, гид, шекарада және құжаттармен көмек, көші-қон картасы, VPN және WeChat. Тамақтану мен кіру билеттері кірмейді.",
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
      ru: "Программа контент-тура в Китай (Инин / Кульджа)",
      kz: "Қытайға контент-тур бағдарламасы (Құлжа / Инин)",
    },
    caption: {
      ru: "Локации программы: Liu Sen Jie, Китайский храм, Light of the Silk Road, Китайский парк аттракционов, Qazanchi, Китайская баня, катание на катере, шопинг.",
      kz: "Бағдарлама локациялары: Liu Sen Jie, Қытай храмы, Light of the Silk Road, Қытай аттракциондар саябағы, Qazanchi, Қытай моншасы, катермен серуендеу, шопинг.",
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
      ru: "Контент-тур в Кыргызстан — Главная афиша",
      kz: "Қырғызстанға контент-тур — Басты афиша",
    },
    caption: {
      ru: "Промо-постер однодневного выезда: Небесный мост, Зиплайн, Канатная дорога, Небесные качели и сити-тур по Бишкеку (на афише: 25 000 ₸).",
      kz: "Біркүндік турдың промо-постері: Аспан көпірі, Зиплайн, Аспалы жол, Аспан әткеншегі және Бішкек бойынша сити-тур (афишада: 25 000 ₸).",
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
      ru: "Условия и дополнительные расходы по Кыргызстану",
      kz: "Қырғызстан турының шарттары мен қосымша шығындары",
    },
    caption: {
      ru: "Входит: трансфер на протяжении всего тура и сопровождение гида. Не входит: питание, входные билеты, канатная дорога + зиплайн (1000 сом ≈ 6000 ₸).",
      kz: "Кіреді: тур бойы трансфер және кәсіби гид сүйемелдеуі. Кіремейді: тамақтану, кіру билеттері, аспалы жол + зиплайн (1000 сом ≈ 6000 ₸).",
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
      ru: "Локации контент-тура в Кыргызстане",
      kz: "Қырғызстандағы контент-тур локациялары",
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
      ru: "Отзывы и общее фото группы в Китае",
      kz: "Қытайдағы топтың ортақ фотосы мен пікірлері",
    },
    caption: {
      ru: "Реальный отчёт «Завершили очередной контент-тур в Китае» и сообщения участников из группового чата WhatsApp.",
      kz: "«Қытайдағы кезекті контент-турды аяқтадық» атты шынайы есеп және WhatsApp топтық чатындағы қатысушылардың хабарламалары.",
    },
  },
  {
    id: "photo_3",
    src: "/assets/brand/photo_3.jpg",
    category: "reviews",
    aspectRatio: "9:16",
    title: {
      ru: "История семейного путешествия с ребёнком",
      kz: "Баламен отбасылық саяхат тарихы",
    },
    caption: {
      ru: "Подлинный отзыв туристов о комфортной поездке с ребёнком в сопровождении команды ALL TOUR.",
      kz: "ALL TOUR командасымен бірге баламен жайлы саяхат туралы туристердің шынайы пікірі.",
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
      ru: "Сторис участников после выезда в Кыргызстан (гиды Бекзат и Ардак)",
      kz: "Қырғызстанға сапардан кейінгі қатысушылар сторисі (гидтер Бекзат пен Ардақ)",
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
      ru: "Сообщения из Direct и WhatsApp с благодарностью за организацию и позитивную атмосферу.",
      kz: "Ұйымдастыру мен көтеріңкі көңіл-күй үшін алғыс білдірілген Direct және WhatsApp хабарламалары.",
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

