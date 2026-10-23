import type { DestinationId, LocalizedText } from "./destinations";

export type ReviewCategory = "kyrgyzstan" | "china" | "uzbekistan_family";

export interface RealReview {
  id: string;
  author: string;
  handleOrSource: LocalizedText;
  category: ReviewCategory;
  destinationId?: DestinationId;
  tourBadge: LocalizedText;
  guideName: LocalizedText;
  dateNote?: string;
  quote: string;
  featuredOnHome: boolean;
  storyScreenshot: string;
}

export interface StoryScreenshotAsset {
  id: string;
  image: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  category: ReviewCategory;
  guides: LocalizedText;
}

export const storyScreenshots: StoryScreenshotAsset[] = [
  {
    id: "story-kg-flyjump",
    image: "/assets/aistudio/image_40d22ebe.png",
    title: {
      ru: "Однодневный тур в Кыргызстан",
      kz: "Қырғызстанға біркүндік тур",
    },
    subtitle: {
      ru: "Бишкек · Ала-Тоо · Прыжки Fly Jump",
      kz: "Бішкек · Ала-Тоо · Fly Jump секірулері",
    },
    category: "kyrgyzstan",
    guides: {
      ru: "Гиды Ардак и Бекзат",
      kz: "Гидтер Ардақ пен Бекзат",
    },
  },
  {
    id: "story-kg-dilmina",
    image: "/assets/aistudio/image_fbeb45d6.png",
    title: {
      ru: "Однодневный тур в Кыргызстан · Отзывы 2",
      kz: "Қырғызстанға біркүндік тур · Пікірлер 2",
    },
    subtitle: {
      ru: "Горные панорамы и атмосфера в группе",
      kz: "Тау панорамалары және топтағы атмосфера",
    },
    category: "kyrgyzstan",
    guides: {
      ru: "Гид Дильмина",
      kz: "Гид Дильмина",
    },
  },
  {
    id: "story-china-content",
    image: "/assets/aistudio/image_eab073ae.png",
    title: {
      ru: "Контент-тур в Китае",
      kz: "Қытайдағы контент-тур",
    },
    subtitle: {
      ru: "Групповой выезд · Полное сопровождение",
      kz: "Топтық сапар · Толық сүйемелдеу",
    },
    category: "china",
    guides: {
      ru: "Гиды Шабазхан, Айхан, Гулден · Водитель Тұрсын",
      kz: "Гидтер Шабазхан, Айхан, Гүлден · Жүргізуші Тұрсын",
    },
  },
  {
    id: "story-uz-ardak",
    image: "/assets/aistudio/image_40ce7d9b.png",
    title: {
      ru: "Двухдневный тур · Чат участников",
      kz: "Екікүндік тур · Қатысушылар чаты",
    },
    subtitle: {
      ru: "Отзывы из группового чата в WhatsApp",
      kz: "WhatsApp топтық чатындағы пікірлер",
    },
    category: "uzbekistan_family",
    guides: {
      ru: "Гид Ардак",
      kz: "Гид Ардақ",
    },
  },
  {
    id: "story-family-travel",
    image: "/assets/aistudio/image_d59c76bb.png",
    title: {
      ru: "Путешествие с детьми",
      kz: "Баламен саяхаттау",
    },
    subtitle: {
      ru: "Комфортная атмосфера для всей семьи",
      kz: "Бүкіл отбасы үшін жайлы атмосфера",
    },
    category: "uzbekistan_family",
    guides: {
      ru: "Команда ALL TOUR",
      kz: "ALL TOUR командасы",
    },
  },
];

export const realReviews: RealReview[] = [
  {
    id: "rev-theleilalight",
    author: "theleilalight",
    handleOrSource: {
      ru: "Instagram · @all_tour.kz",
      kz: "Instagram · @all_tour.kz",
    },
    category: "kyrgyzstan",
    destinationId: "kyrgyzstan",
    tourBadge: {
      ru: "Однодневный тур в Кыргызстан",
      kz: "Қырғызстанға біркүндік тур",
    },
    guideName: {
      ru: "Гид Бекзат",
      kz: "Гид Бекзат",
    },
    dateNote: "23 марта",
    quote:
      "Ехала 23-го марта с гидом Бекзат. Поездка в Кыргызстан выдалась отличной. Всё было интересно: во время дороги играли в игры, прыжок с тарзанки был очень захватывающим, а дальше мы уже спокойно посмотрели площадь Ала-Тоо и мечеть. Мы побывали в таких разных локациях, что не успеваешь соскучиться. Спасибо гиду Бекзат за сопровождение и All Tour за организацию ❤️",
    featuredOnHome: true,
    storyScreenshot: "/assets/aistudio/image_40d22ebe.png",
  },
  {
    id: "rev-evelina-china",
    author: "Эвелина Брауер",
    handleOrSource: {
      ru: "WhatsApp чат тура",
      kz: "Турдың WhatsApp чаты",
    },
    category: "china",
    destinationId: "china",
    tourBadge: {
      ru: "Контент-тур в Китае",
      kz: "Қытайдағы контент-тур",
    },
    guideName: {
      ru: "Команда ALL TOUR",
      kz: "ALL TOUR командасы",
    },
    quote:
      "Хочу сказать огромное спасибо за тур в Китай! 🇨🇳 Это был мой первый тур, и он превзошёл все ожидания! Организация на высоте, впечатлений море, всё было интересно, красиво и комфортно. Спасибо за заботу и незабываемые моменты! 🌟",
    featuredOnHome: true,
    storyScreenshot: "/assets/aistudio/image_eab073ae.png",
  },
  {
    id: "rev-dilmina-long",
    author: "Участница тура",
    handleOrSource: {
      ru: "WhatsApp · Выезд в Кыргызстан",
      kz: "WhatsApp · Қырғызстанға сапар",
    },
    category: "kyrgyzstan",
    destinationId: "kyrgyzstan",
    tourBadge: {
      ru: "Однодневный тур в Кыргызстан",
      kz: "Қырғызстанға біркүндік тур",
    },
    guideName: {
      ru: "Гид Дильмина",
      kz: "Гид Дильмина",
    },
    quote:
      "Я побывала во многих турах, но такого гида как вы, честно говоря, впервые встречаю! Вы отдаётесь своей работе — это видно, всегда на позитиве, и шутки у вас смешные. Информацию чётко и ясно доносите, это понравилось. Ещё побываю в турах там, где ведёте, спасибо 💐💛",
    featuredOnHome: true,
    storyScreenshot: "/assets/aistudio/image_fbeb45d6.png",
  },
  {
    id: "rev-china-detailed-kz",
    author: "Участник контент-тура",
    handleOrSource: {
      ru: "WhatsApp чат группы",
      kz: "Топтың WhatsApp чаты",
    },
    category: "china",
    destinationId: "china",
    tourBadge: {
      ru: "Контент-тур в Китае",
      kz: "Қытайдағы контент-тур",
    },
    guideName: {
      ru: "Гиды Шабазхан и Айхан",
      kz: "Гидтер Шабазхан мен Айхан",
    },
    quote:
      "Сәлем тағы да! All tour-ға алғысымды білдіремін, осындай тиімді бағада Қытайдың бар көркін көрсете алды. Шабазханға за настроение, за эмоции, Айханға за комфорт рахмет айтам — жігіттер ерінбей бәрін түсіндіріп, әрқайсымызға көңіл бөлді. Істеріңіз алға бассын, сіздермен тағы ел аралау бұйырсын 🤲",
    featuredOnHome: true,
    storyScreenshot: "/assets/aistudio/image_eab073ae.png",
  },
  {
    id: "rev-makbalin",
    author: "m.akbalin",
    handleOrSource: {
      ru: "Instagram · @all_tour.kz",
      kz: "Instagram · @all_tour.kz",
    },
    category: "kyrgyzstan",
    destinationId: "kyrgyzstan",
    tourBadge: {
      ru: "Кыргызстан · Бишкек и Fly Jump",
      kz: "Қырғызстан · Бішкек және Fly Jump",
    },
    guideName: {
      ru: "Гид Ардак",
      kz: "Гид Ардақ",
    },
    dateNote: "6 апреля",
    quote:
      "6 апреля съездил с all.tour.kz в Кыргызстан, Бишкек. Ощущения непередаваемые, особенно прыжки fly jump. И хочу отметить и поблагодарить МегаПозитивную МегаГид Ардак!! Удачи!!",
    featuredOnHome: true,
    storyScreenshot: "/assets/aistudio/image_40d22ebe.png",
  },
  {
    id: "rev-family-kids",
    author: "Участница семейного тура",
    handleOrSource: {
      ru: "Instagram Direct · Семейный выезд",
      kz: "Instagram Direct · Отбасылық сапар",
    },
    category: "uzbekistan_family",
    tourBadge: {
      ru: "Путешествие с детьми",
      kz: "Баламен саяхат",
    },
    guideName: {
      ru: "Команда ALL TOUR",
      kz: "ALL TOUR командасы",
    },
    quote:
      "Сәлеметсіз бе? Баламен саяхаттау мүлде қиын емес, если рядом хороший муж, который помогает 😊 Бала да үйренеді соған, біз кішкентай кезінен киноға, барлық жерге алып жүре береміз. Поездка күшті болды, рахмет. Группа бәрі көңілді, Ерсайынмен билеп қарап жүрді 😍❤️",
    featuredOnHome: true,
    storyScreenshot: "/assets/aistudio/image_d59c76bb.png",
  },
  {
    id: "rev-almas-baimuratov",
    author: "almas_baimuratov",
    handleOrSource: {
      ru: "Instagram · @all_tour.kz",
      kz: "Instagram · @all_tour.kz",
    },
    category: "kyrgyzstan",
    destinationId: "kyrgyzstan",
    tourBadge: {
      ru: "Однодневный тур в Кыргызстан",
      kz: "Қырғызстанға біркүндік тур",
    },
    guideName: {
      ru: "Гид Ардак",
      kz: "Гид Ардақ",
    },
    dateNote: "06.04.2024",
    quote:
      "Нет слов, одни эмоции 🔥🔥🔥 06.04.2024 прыгали. Благодарю всю команду и нашего гида, прекрасную и неповторимую Ардак!",
    featuredOnHome: false,
    storyScreenshot: "/assets/aistudio/image_40d22ebe.png",
  },
  {
    id: "rev-idyn",
    author: "@IDYN",
    handleOrSource: {
      ru: "WhatsApp чат группы",
      kz: "Топтың WhatsApp чаты",
    },
    category: "kyrgyzstan",
    destinationId: "kyrgyzstan",
    tourBadge: {
      ru: "Однодневный тур в Кыргызстан",
      kz: "Қырғызстанға біркүндік тур",
    },
    guideName: {
      ru: "Гид Дильмина",
      kz: "Гид Дильмина",
    },
    quote:
      "@Dil'mina спасибо за проведённый тур, за неиссякаемый позитив и оптимизм, исходящий от вас, за подаренное нам крутое настроение во время поездки ❤️",
    featuredOnHome: false,
    storyScreenshot: "/assets/aistudio/image_fbeb45d6.png",
  },
  {
    id: "rev-anastasia-china",
    author: "Анастасия",
    handleOrSource: {
      ru: "WhatsApp чат тура",
      kz: "Турдың WhatsApp чаты",
    },
    category: "china",
    destinationId: "china",
    tourBadge: {
      ru: "Контент-тур в Китае",
      kz: "Қытайдағы контент-тур",
    },
    guideName: {
      ru: "Гиды Шабазхан, Айхан, Гулден",
      kz: "Гидтер Шабазхан, Айхан, Гүлден",
    },
    quote:
      "Спасибо большое всем за приятную компанию! Всё было отлично 👍 Спасибо организаторам и нашим гидам — вы супер ребята! 🌟 Спасибо водителю за комфортное и безопасное вождение. Всем удачи и хорошего настроения! ✊💗",
    featuredOnHome: false,
    storyScreenshot: "/assets/aistudio/image_eab073ae.png",
  },
  {
    id: "rev-samat-china",
    author: "Самат",
    handleOrSource: {
      ru: "WhatsApp чат тура",
      kz: "Турдың WhatsApp чаты",
    },
    category: "china",
    destinationId: "china",
    tourBadge: {
      ru: "Контент-тур в Китае",
      kz: "Қытайдағы контент-тур",
    },
    guideName: {
      ru: "Гиды Шабазхан, Айхан, Гулден",
      kz: "Гидтер Шабазхан, Айхан, Гүлден",
    },
    quote:
      "Кеш жарық! Есімім Самат болады. Отзыв жазып кетейін дегем! Тур өте күшті өтті, көңілді болды 💃, особенно баня ұнады маған, көп рахмет Шабазханға, Айханға, Гүлденге және водительге! 👏 Алла жазса келесі кездескенше!",
    featuredOnHome: false,
    storyScreenshot: "/assets/aistudio/image_eab073ae.png",
  },
  {
    id: "rev-tursyn-team-china",
    author: "Участница тура в Китай",
    handleOrSource: {
      ru: "WhatsApp чат группы",
      kz: "Топтың WhatsApp чаты",
    },
    category: "china",
    destinationId: "china",
    tourBadge: {
      ru: "Контент-тур в Китае",
      kz: "Қытайдағы контент-тур",
    },
    guideName: {
      ru: "Шабазхан, Айхан, Гулден · Водитель Тұрсын",
      kz: "Шабазхан, Айхан, Гүлден · Жүргізуші Тұрсын",
    },
    quote:
      "Тұрсын шопырға, гид жігіттерге — Шәкеңе, Айтханға, Гүлденге үлкен рахмет! Барлығыңызға ақ жол!! Керемет қызықты сапар болды! Бізге де бәрі ұнады 😍 Максималды комфорт үшін алғыс 🔥 Гидтерге деген алғысымыз бір бөлек, аз күнде көп эмоция сыйладыңыздар, All tour ❤️",
    featuredOnHome: false,
    storyScreenshot: "/assets/aistudio/image_eab073ae.png",
  },
  {
    id: "rev-ardak-return",
    author: "Участница тура",
    handleOrSource: {
      ru: "WhatsApp чат группы",
      kz: "Топтың WhatsApp чаты",
    },
    category: "uzbekistan_family",
    destinationId: "kyrgyzstan",
    tourBadge: {
      ru: "Двухдневный тур · Выезд с гидом",
      kz: "Екікүндік тур · Гидпен сапар",
    },
    guideName: {
      ru: "Гид Ардак",
      kz: "Гид Ардақ",
    },
    quote:
      "Ардақ қоштаспады деп ренжімеңіз, мен қоштаспаймын — сіздерге тағы да келемін, дәл сізге тағы жазыламын, тағы Бишкекті сіздермен аралаймын! Бүгінгі күн керемет өтті 🫶 Рақмет сіздерге үлкен 💐💐💐",
    featuredOnHome: false,
    storyScreenshot: "/assets/aistudio/image_40ce7d9b.png",
  },
  {
    id: "rev-tansholpan",
    author: "Таңшолпан Маратқызы",
    handleOrSource: {
      ru: "WhatsApp чат группы",
      kz: "Топтың WhatsApp чаты",
    },
    category: "uzbekistan_family",
    tourBadge: {
      ru: "Двухдневный тур в Узбекистан",
      kz: "Өзбекстанға екікүндік тур",
    },
    guideName: {
      ru: "Гид Ардак",
      kz: "Гид Ардақ",
    },
    quote:
      "Күшті болды бәрі, Ардаққа рахмет ❤️ Иә, бәрі ұнады! Лучший гидымыздың бірі ғой Ардашка!",
    featuredOnHome: false,
    storyScreenshot: "/assets/aistudio/image_40ce7d9b.png",
  },
  {
    id: "rev-zhazira",
    author: "Zhazira",
    handleOrSource: {
      ru: "WhatsApp чат группы",
      kz: "Топтың WhatsApp чаты",
    },
    category: "kyrgyzstan",
    destinationId: "kyrgyzstan",
    tourBadge: {
      ru: "Однодневный тур в Кыргызстан",
      kz: "Қырғызстанға біркүндік тур",
    },
    guideName: {
      ru: "Гид Дильмина",
      kz: "Гид Дильмина",
    },
    quote:
      "Дильмина, спасибо за хорошее настроение 🥰 Желаю тебе дальнейшего роста и оставаться такой же красоткой 😘",
    featuredOnHome: false,
    storyScreenshot: "/assets/aistudio/image_fbeb45d6.png",
  },
  {
    id: "rev-dilmina-best",
    author: "Участница выезда",
    handleOrSource: {
      ru: "Instagram Direct",
      kz: "Instagram Direct",
    },
    category: "kyrgyzstan",
    destinationId: "kyrgyzstan",
    tourBadge: {
      ru: "Однодневный тур в Кыргызстан",
      kz: "Қырғызстанға біркүндік тур",
    },
    guideName: {
      ru: "Гид Дильмина",
      kz: "Гид Дильмина",
    },
    quote:
      "Дильмин, спасибо большое за тур, ты правда лучшая! Желаю успехов и продвижения 🫶🫶",
    featuredOnHome: false,
    storyScreenshot: "/assets/aistudio/image_fbeb45d6.png",
  },
  {
    id: "rev-saltanat",
    author: "yntybaevasaltanat",
    handleOrSource: {
      ru: "Instagram · @all_tour.kz",
      kz: "Instagram · @all_tour.kz",
    },
    category: "kyrgyzstan",
    destinationId: "kyrgyzstan",
    tourBadge: {
      ru: "Однодневный тур в Кыргызстан",
      kz: "Қырғызстанға біркүндік тур",
    },
    guideName: {
      ru: "Команда ALL TOUR",
      kz: "ALL TOUR командасы",
    },
    quote:
      "Буквально вчера съездили, мне очень понравилось! Эмоции не передать словами! Всем советую 😍",
    featuredOnHome: false,
    storyScreenshot: "/assets/aistudio/image_40d22ebe.png",
  },
];
