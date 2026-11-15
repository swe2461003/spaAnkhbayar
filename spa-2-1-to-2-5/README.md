# CON354 LMS SPA 2.1–2.5

“Хүнсний найрлагын мэдээллийн сангаар Single Page Application бүтээх төсөл” номын зөвхөн **2.1–2.5** хэсгийг **сургалтын удирдлагын систем буюу LMS** сэдвээр өөрчилсөн, бие даасан төсөл.

Өмнө хийсэн бүрэн LMS төсөлтэй код, session болон хэлний тохиргоо хуваалцахгүй. Энэ хавтас нь шинэ ажил бөгөөд хуучин төслийг орлохгүй.

## Ажиллуулах

Node.js 20 буюу түүнээс дээш хувилбарт:

```sh
npm ci
npm start
```

**http://127.0.0.1:4175** хаягийг нээнэ. Бэлэн CSS хавсаргасан тул зөвхөн харах бол `node tools/serve.mjs` эсвэл `START-SPA.cmd` ажиллуулахад болно. `src/index.html`-ийг file:// хаягаар нээхгүй, HTTP сервер ашиглана.

```sh
npm run sass   # SCSS өөрчлөлтийг автоматаар хөрвүүлэх
npm run build  # CSS үүсгэх
npm run check  # Syntax ба import шалгах
```

## Номын дараалал

| Хэсэг | Хийсэн ажил | Гол файлууд |
| --- | --- | --- |
| 2.1 | Hash router бүхий SPA суурь | index.html, app.js, router.js, routes.js |
| 2.2 | Хуудас бүрийг тусдаа файл болгох | src/js/pages/ дотор 6 файл |
| 2.3 | Нийтлэг renderPageLayout | src/js/layouts/pageLayout.js |
| 2.4 | Navbar, mobile burger, идэвхтэй холбоос | components/navbar.js, scss/main.scss |
| 2.5 | Монгол Англи хэл солих, хадгалах | i18n/translations.js, i18n/i18n.js |

Номын үндсэн замуудыг хадгалж, агуулгыг өөрчилсөн:

- `#/overview` — LMS танилцуулга.
- `#/search` — хичээлийн жагсаалтын танилцуулга.
- `#/calculation` — үнэлгээний бүтцийн танилцуулга.
- `#/books` — сургалтын материалын ангилал.
- `#/contact` — холбоо барих мэдээллийн хуудас.
- `#/404` болон танигдаагүй зам — хуудас олдсонгүй.

## Кодын бүтэц

```text
src/
  index.html
  js/
    app.js
    router.js
    routes.js
    pages/
      overviewPage.js
      searchPage.js
      calculationPage.js
      booksPage.js
      contactPage.js
      notFoundPage.js
    layouts/pageLayout.js
    components/navbar.js
    i18n/
      i18n.js
      translations.js
  scss/main.scss
  css/main.css
tools/
  serve.mjs
  check.mjs
```

`app.js` navbar-ийг холбож router-ийг эхлүүлнэ. `routes.js` замыг page function-той холбодог. `router.js` hash өөрчлөгдөхөд тохирох page-ийг зурна. Page бүр `renderPageLayout()` ашиглаж ижил байрлалтай гарна. `navbar.js` нь цэс болон хэл солих товчийг удирдана. `t('nav.overview')` зэрэг dot path нь орчуулгын объектын утгыг авна. Хэл солиход номын жишээтэй адил хуудас дахин ачаалж, одоогийн hash хэвээр үлдэнэ.

Өмнөх төслийн хэлний түлхүүрт хүрэхгүйгээр `con354.chapters21to25.language` түлхүүр ашиглана. Bulma 1.0.4, Sass 1.93.2-ыг ашигласан. Хуучирсан Sass `@import`-ын оронд `@use` хэрэглэсэн.

## Энэ хувилбарын хүрээ

Хуудасны агуулга нь тогтмол мэдээлэл. 2.6–2.13 хэсгийн services, JSON fetch, хайлтын шүүлтүүр, зураг/PDF modal, дүн бодох, ирц/журнал, мессеж, архив, footer component нэмээгүй. Үнэлгээ болон материалын хуудсууд дээр ажиллагаагүй form эсвэл татах товч байрлуулаагүй.

## GitHub дахь тусгаарлалт

Шинэ эх кодыг repository-ийн `spa-2-1-to-2-5/` хавтаст, браузерт ажиллах хувилбарыг `docs/spa-2-1-to-2-5/` хавтаст **шинээр нэмнэ**. Өмнө байсан файлуудыг сольж бичихгүй.

Эх заавар: Дэмбэрэлийн Оргил, 2026/06/01. Номын хүнсний өгөгдөл, нэршил, хуудасны агуулгыг LMS сэдвээр өөрчилсөн. Bulma-ийн MIT лицензийг `licenses/BULMA-LICENSE` файлд хадгалсан.
