# ALL TOUR — BEYOND BORDERS (MVP)

Кинематографический интерактивный сайт путешествий из Алматы по направлениям **Кыргызстан**, **Грузия** и **Китай** для компании **ALL TOUR (@all_tour.kz)**.

## Быстрый старт

```bash
npm install
npm run dev
```

Сборка для production (Vercel / Netlify):

```bash
npm run build
npm run preview
```

Запуск модульных тестов бизнес-логики:

```bash
npx tsx --test src/lib/appLogic.test.ts
```

## Поля, которые необходимо подтвердить и заполнить реальными данными компании перед релизом

Все конфигурационные данные вынесены в отдельные файлы для быстрой замены без правок UI-компонентов:

1. **`src/config/business.ts`**:
   - `whatsappNumber` и `whatsappDisplay` — подтвердить финальный рабочий номер WhatsApp (сейчас установлен предварительный `+7 771 143 42 68`, `whatsappRequiresConfirmation: true`). После подтверждения установите `whatsappRequiresConfirmation: false`.
   - `instagramUrl` — `https://www.instagram.com/all_tour.kz/`.

2. **`src/data/tours.ts`**:
   - `priceKzt` — актуальная стоимость каждого тура в тенге (пока `undefined`, интерфейс корректно выводит «Уточнить стоимость»).
   - `departureDates` — подтверждённые даты ближайших выездов/вылетов из Алматы (пока `[]`, интерфейс выводит «Ближайшие даты — по запросу»).
   - `duration` — подтверждённая длительность каждого маршрута.
   - `itinerary`, `included`, `excluded`, `documentsInfo` — точное расписание по дням и состав каждого пакета.

3. **`public/media/` и `src/data/destinations.ts`**:
   - При наличии собственных фото- или видеоматериалов компании поместите файлы в `public/media/` и обновите пути в `src/data/destinations.ts` и `src/data/tours.ts`.
