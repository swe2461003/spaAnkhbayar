# Номын 2.1–2.13 хэсгийн LMS хэрэгжүүлэлт

Энэ хавтас нь 2.1-ээс эхэлсэн ижил төслийн эцсийн нэгтгэсэн хувилбар. Дараагийн бүлэгт өмнөх файлыг шинэчилдэг тул бүлэг бүрээр тусдаа app үүсгээгүй. Номын хүнсний өгөгдлийг LMS-ийн хичээл, тэнхим, дүн, сургалтын материалаар сольсон.

| Бүлэг | Хийсэн ажил | Эх файлууд |
| --- | --- | --- |
| 2.1 | HTML эхлэл, hash router, routes, app холболт | src/index.html, src/js/router.js, routes.js, app.js |
| 2.2 | Ерөнхий мэдээлэл, хайлт, тооцоолол, материал, холбоо, 404 хуудас | src/js/pages/*.js, routes.js |
| 2.3 | Дахин ашиглах хуудасны layout | src/js/layouts/pageLayout.js, pages/*.js |
| 2.4 | Bulma navbar, идэвхтэй холбоос, жижиг дэлгэцийн цэс, Sass | src/js/components/navbar.js, app.js, src/scss/main.scss |
| 2.5 | Монгол Англи UI орчуулга, хэл хадгалах | src/js/i18n/i18n.js, translations.js, navbar.js |
| 2.6 | Хичээлийн JSON, config, кэштэй service, loading, error, retry | src/data/courses.json, src/js/config.js, services/courseService.js, pages/searchPage.js |
| 2.7 | Хайлт, тэнхим ба төрлийн шүүлтүүр, багана сонголт, эрэмбэ, хүснэгт, sidebar | components/search*.js, courseTables.js, fn/courseSearchEvents.js, sidebarEvents.js, layouts/sidebarPageLayout.js, tableLayout.js, notificationLayout.js |
| 2.8 | Зургийн manifest, хичээлийн кодоор зураг олох, олон зурагтай modal | src/tools/generate-images-json.mjs, src/data/images.json, services/imageService.js, components/imageModal.js |
| 2.9 | Өгөгдлийн MN EN хувиргалт, хоёр хэлээр хайх, localized нэр ба огноо | src/tools/searchUniqueField.js, convertCoursesEnMn.js, src/data/courseTranslations.json, coursesEnMn.json, i18n/*.js |
| 2.10 | Тэнхимийн SVG зураглал, сонголтын modal, хайлт руу шилжилт, танилцуулга | src/img/department-map.svg, services/mapService.js, txtService.js, components/map.js, infoModal.js, overviewText.js, layouts/splitPageLayout.js, pages/overviewPage.js |
| 2.11 | Жинлэсэн оноо, үсгэн дүн, кредитийн GPA, схем ба хадгалалт | src/data/gradeRequirements.json, services/gradeRequirementService.js, fn/gradeGetters.js, components/calculationInfo.js, calculationTable.js, pages/calculationPage.js |
| 2.12 | Материалын service, grid, карт, хайлт, PDF үзэх ба татах | src/data/books.json, src/pdf/*.pdf, services/bookService.js, layouts/gridPageLayout.js, components/bookCard.js, pdfModal.js, pages/booksPage.js |
| 2.13 | Footer, орчуулга, app ба HTML холболт, responsive Sass | components/footer.js, app.js, src/index.html, i18n/translations.js, src/scss/components/_footer.scss |

Хүснэгт дэх components, services, pages, layouts, fn, i18n замууд нь src/js дотор байна. Sass-ийн зарим дүрэм main.scss-д нэгтгэгдсэн, шинэ дөрвөн хэсэг src/scss/components дотор байна. Файлын нэрийг LMS сэдэвт тааруулсан тул nutritionService нь courseService, nutrientGetters нь gradeGetters болсон.

## Ажиллуулах

```sh
npm ci
npm run build
npm run check
npm test
npm start
```

http://127.0.0.1:4175/#/overview хаягийг нээнэ. Бэлэн CSS болон JSON хавсаргасан тул харахдаа зөвхөн `npm start` ашиглаж болно.

## Хүрээ

6 жишээ хичээл, хоёр тэнхим, гурван өөрийн бэлтгэсэн PDF материалтай. Дүнгийн жин ба босго нь жишээ тохиргоо. Энэ нь frontend SPA; серверийн бүртгэл, жинхэнэ хэрэглэгчийн нэвтрэлт, сургуулийн албан ёсны дүнгийн санг хэрэгжүүлээгүй.

Шалгалтын үр дүн VALIDATION-2.6-2.9.json болон VALIDATION-2.10-2.13.json-д, тооцооллын давтагдах тест tests/grades.test.mjs-д бий.

[GitHub](https://github.com/swe2461003/spaAnkhbayar/tree/main/lms-spa)

[Веб](https://swe2461003.github.io/spaAnkhbayar/lms-spa/#/overview)
