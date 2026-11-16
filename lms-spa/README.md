# CON354 LMS SPA 2.1–2.13

**[Веб системийг нээх](https://swe2461003.github.io/spaAnkhbayar/lms-spa/#/search)**

Номын 2.1-ээс 2.13 хүртэлх хэсгийг нэг LMS SPA төсөлд дарааллаар хэрэгжүүлсэн. Хавтасны нэрийг `lms-spa` болгож шинэчилсэн бөгөөд одоогийн код 2.13 хүртэлх ажлыг агуулна. Repository-ийн үндсэн бүрэн LMS төсөлд өөрчлөлт оруулаагүй. Өмнөх 2.1–2.5 код Git history-д хадгалагдана.

Бүлэг бүрийн хэрэгжүүлэлт болон файлын жагсаалт: [CHAPTERS-2.1-2.13.md](CHAPTERS-2.1-2.13.md).

## Шинээр хийсэн ажил

| Хэсэг | LMS сэдэвт тохируулсан ажил | Гол файл |
| --- | --- | --- |
| 2.6 | JSON өгөгдөл, config, кэштэй service, loading/error/retry | config.js, services/courseService.js |
| 2.7 | Нэр/код/багшийн хайлт, мэргэжил/төрөл, багана, эрэмбэ, хоосон төлөв, mobile sidebar | pages/searchPage.js, fn/courseSearchEvents.js, components/search* |
| 2.8 | Зургийн manifest үүсгэх, кодоор зураг олох, олон зурагтай modal, өмнөх/дараах/Escape | tools/generate-images-json.mjs, services/imageService.js, components/imageModal.js |
| 2.9 | MN/EN JSON хувиргалт, localized нэр/тайлбар/огноо, хайлтын төлөв хадгалах | tools/convertCoursesEnMn.js, i18n/i18n.js |

## Ажиллуулах

Node.js 20+ суусан орчинд:

```sh
npm ci
npm run build
npm start
```

http://127.0.0.1:4175/#/search хаягийг нээнэ. Хөрвүүлсэн CSS, өгөгдөл, зургийн manifest бэлэн тул зөвхөн харах бол `node tools/serve.mjs` ажиллуулж болно.

```sh
npm run sass          # SCSS watch
npm run build:data    # courses.json + courseTranslations.json → coursesEnMn.json
npm run build:images  # img/courses → images.json
npm run check        # Syntax, module import
node src/tools/searchUniqueField.js department
```

## Өгөгдөл ба шүүлтүүр

6 жишээ хичээлтэй. Хүнсний нэрийг хичээлийн нэр, бүлгийг мэргэжил, найрлагын төрлийн сонголтыг харагдах баганууд болгон өөрчилсөн. Хоёр мэргэжлийг зэрэг сонгож болно; мэргэжил сонгоогүй бол бүгдийг харуулна. Нэрийн хайлт Монгол, Англи нэр, код болон багшийн нэрийг шалгана. Үр дүнг код эсвэл сонгосон хэлний нэрээр эрэмбэлнэ.

Хайлтын нөхцөл URL query-д хадгалагдана. Хэл солиход одоогийн хайлт, багана, шүүлтүүр үлдэнэ. Хэлний сонголт `con354.chapters21to25.language` түлхүүрт хадгалагддаг тул өмнөх бүрэн LMS-ийн тохиргоонд хүрэхгүй.

JSON эх өгөгдөл `courses.json`, гар аргаар бэлдсэн хоёр хэлний dictionary `courseTranslations.json`, үүссэн файл `coursesEnMn.json`. Орчуулгын мэдээлэл дутуу бол converter алдаа өгдөг. Автоматаар зохиомол орчуулга үүсгэхгүй. Өөрийн сервертэй холбох бол config.js дэх DATA_MODE ба API_COURSES_URL-ийг тохируулна; одоогийн төсөл local JSON ашиглана.

Зургийг `src/img/courses/CON354.svg`, `CON354__2.svg` гэх мэт кодоор нэрлээд `npm run build:images` ажиллуулна. 6 хичээлд 7 SVG зураг хавсаргасан. SVG-үүд нь төслийн хичээлийн дүрслэл, бодит лекцийн screenshot биш. Зургийн цонх өмнөх/дараах товч, сумтай товчлуур, Escape, focus буцаах боломжтой.

## Кодын урсгал

`router → searchPage → courseService/imageService → filterCourses → courseTables/tableLayout`.

Page нь өгөгдлийн замыг шууд fetch хийхгүй. Services нь JSON ба кэшийг удирдана. Layout/component нь дүрслэл, fn нь хайлтын дүрэм болон HTML escape-ийг хариуцна. Async route солигдсон үед хуучин хүсэлтийн үр дүн шинэ page-ийг дарахгүй. Хэрэглэгчийн бичвэрийг HTML болгон ажиллуулахгүй.

## Хүрээ ба шалгалт

2.1–2.5-ын router, таван page, 404, layout, navbar хэвээр. 2.10–2.13-ын нэмэлтүүдийг өмнөх төсөлд үргэлжлүүлэн хэрэгжүүлсэн.

`VALIDATION-2.6-2.9.json` файлд 2026-11-16-нд гүйцэтгэсэн 11 браузерын шалгалтын үр дүн бий. Шинэ хайлт, давхар шүүлтүүр, багана, зураг, хэл/огноо, refresh, өмнөх pages, mobile sidebar, error/retry, async route болон asset-ийг хамруулсан. Хэрэглэгчийн хүсэлтээр screenshot аваагүй.

Эх заавар: Дэмбэрэлийн Оргилын 2026/06/01-ний SPA бүтээх төслийн ном. Bulma 1.0.4 (MIT), Sass 1.93.2 (MIT). Bulma лиценз `licenses/BULMA-LICENSE`-д бий.

## 2.10–2.13 нэмэлт

| Хэсэг | Хэрэгжүүлэлт | Гол файлууд |
| --- | --- | --- |
| 2.10 | Тэнхимийн SVG зураг, хичээл сонгох цонх, хайлт руу шилжүүлэх, JSON танилцуулга | overviewPage.js, map.js, infoModal.js, mapService.js, txtService.js |
| 2.11 | Дөрвөн бүрэлдэхүүний жинлэсэн дүн, хоёр схем, үсгэн дүн, кредитээр жинлэсэн GPA, хадгалалт | calculationPage.js, gradeGetters.js, calculationTable.js, gradeRequirements.json |
| 2.12 | Материалын хайлт, гурван карт, гурван бодит PDF, үзэх болон татах цонх | booksPage.js, bookService.js, bookCard.js, pdfModal.js, books.json |
| 2.13 | MN/EN footer, таван хуудасны холбоос, GitHub, responsive Sass | footer.js, app.js, index.html, scss/components/_footer.scss |

Энэ нь номын хүнсний сэдвийг LMS болгон өөрчилсөн хувилбар. Газрын зургийг тэнхимийн зураг, хүнсний тооцоог хичээлийн дүн, номын санг сургалтын PDF материал болгосон.

Дүнгийн стандарт жин 20/30/20/30, төслийн жин 10/40/30/20. Эдгээр болон A–F босго нь төслийн жишээ дүрэм, сургуулийн албан ёсны журам биш. Оноо 0–100 байна. localStorage-ийн `lms-spa.calculation.v1` түлхүүрт зөвхөн сонгосон хичээл, оноо, схем хадгална. Серверийн бүртгэл, бодит хэрэглэгчийн нэвтрэлт байхгүй.

Гурван PDF нь төсөлд зориулан шинээр бичсэн товч гарын авлага. Эх үүсгэгч `tools/generate-materials.py`; дахин үүсгэхэд Python, reportlab болон Arial фонт шаардлагатай. Бэлэн PDF-үүдийг шууд ашиглаж болно.

`npm test` — тооцооны таван автомат шалгалт. `VALIDATION-2.10-2.13.json` — хөтчийн 15 шалгалтын үр дүн. Өмнөх хайлт, зураг, хэлний боломжууд мөн шалгагдсан. Screenshot агуулаагүй.

