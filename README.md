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

Запуск автоматических тестов (22 теста):

```bash
npm test
```

Проверка типов TypeScript:

```bash
npm run lint
```

## Үздіксіз интеграция (CI / GitHub Actions)

Жобада GitHub Actions негізінде автоматтандырылған CI бапталған (`.github/workflows/ci.yml`). Ол `main` тармағына push жасалғанда, Pull Request ашылғанда немесе жаңартылғанда, сондай-ақ қолмен (`workflow_dispatch`) іске қосылады.

CI `ubuntu-latest` ортасында (Node.js 22.x) мына қадамдарды қатаң ретпен тексереді:
1. **Таза орнату (Clean install)**: `npm ci` (`package.json` және `package-lock.json` үйлесімділігін кэш арқылы тексеру).
2. **TypeScript тексерісі**: `npm run lint` (`tsc --noEmit`).
3. **Автоматтандырылған тесттер**: `npm test` (22 тест: брондау сценарийлері, ұзақтық сүзгісі, таңдаулылар, бағыттар тұтастығы, WhatsApp хабарламалары, i18n сөздіктер паритеті және Montserrat қарпіндегі қазақша глифтер).
4. **Өндірістік құрастыру**: `npm run build` (`vite build`).

CI нәтижелері мен логтарын репозиторийдің **Actions** қосымша бетінен көруге болады:
[https://github.com/Honored-Karma/All_tour/actions](https://github.com/Honored-Karma/All_tour/actions)

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
