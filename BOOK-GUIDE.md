# Номын дарааллаар төслийг судлах заавар

Энэ файл номын бүлэг, дэд хэсгийг LMS эх файлтай холбож өгнө. Номын хүнсний сэдвийг LMS болгож өөрчилсөн тул хүнс/шим тэжээлтэй холбоотой нэр, өгөгдөл, газарзүйн зураг болон томьёог шууд хуулаагүй. Доорх нь номын сурах дараалал; хавтас дотор эцсийн нийлмэл код бий. Завсрын дутуу хувилбаруудыг тус бүр ажилладаг мэтээр тэмдэглээгүй.

## 1 Программ суулгах тохируулах

1.1: Одоо суусан Node.js, npm, Git-ийг ашигласан. Хэрэглэгчийн VS Code extension, shortcuts, global Git identity-г өөрчлөөгүй. `.vscode/settings.json` нь зөвхөн төслийн UTF-8, tab, formatOnSave тохиргоо.

1.2: `package.json`, `package-lock.json`. `npm ci`, `npm run sass`. Bulma, Sass нь npm devDependencies. Build-ийн дараа app эдгээр сангийн сервер шаарддаггүй.

1.3: `src/scss/main.scss`. Номын Sass өнгөний тохиргоог Figma-ийн `#16a34a` ногоонтой тааруулсан. Хуучин `@import`-ын оронд `@use` ашигласан.

1.4: Local Git repository; эцсийн шалгасан эх кодын commit, `main` ба `lms-development` branch. GitHub repository/Pages болон push нь зөвшөөрөл хүлээх үйлдэл тул хийгдээгүй.

1.5: Font Awesome-ийг npm-ээс суулгаж, CSS ба webfonts-ийг `src/vendor/fontawesome/`-д локал оруулсан. Номын browser script хувилбарын оронд local CSS ашигласан; icons.js component-оор дуудаж байна. jQuery ашиглаагүй.

1.6: `npm run build` → `tools/build.mjs` нь `src/`-ийн браузерт хэрэгтэй файлыг `docs/` руу хуулна. SCSS ба build tools-ийг нийтлэх статик хавтсанд оруулахгүй. Нийтлэх үйлдэл хийхгүй.

## 2.1 Router бүхий SPA суурь

`src/index.html`, `src/js/router.js`, `routes.js`, `app.js`. Номын `#/overview`, `#/search`, `#/calculation`, `#/books`, `#/contact`, 404 замууд хадгалагдсан. LMS хуудсууд нэмэлт замуудтай. Hash routing учраас GitHub Pages дээр тусгай серверийн rewrite шаардлагагүй. Async render хуучин хуудасны өгөгдлөөр шинэ хуудсыг дарж бичихээс хамгаалсан.

Шалгах: sidebar-аар шилжих, URL-ийн hash солих, refresh, Back/Forward, `#/unknown`.

## 2.2 Page файлуудыг тусгаарлах

`src/js/pages/overviewPage.js`, `searchPage.js`, `calculationPage.js`, `booksPage.js`, `contactPage.js`, `notFoundPage.js`. Нэмэлт LMS хуудас тус бүр мөн энэ хавтсанд байна. `routes.js` нь зөвхөн зам → render function холбоно.

## 2.3 renderPageLayout

`src/js/layouts/pageLayout.js`: гарчиг, тайлбар, action, үндсэн агуулга. Page-үүд UI-г composition байдлаар нийлүүлдэг. Номын GitHub руу илгээх алхмыг зөвшөөрөлгүйгээр гүйцэтгээгүй.

## 2.4 Navbar

`src/js/components/navbar.js`, `src/scss/components/_navbar.scss`. Номын navbar-ийг Figma-гийн sidebar + topbar болгосон. Desktop sidebar 220px, topbar 56px; mobile-д menu товчоор нээгдэнэ. Сонгосон route нь `aria-current`-тай.

## 2.5 i18n

`src/js/i18n/translations.js`, `i18n.js`. `t()`, `getCurrentLanguage()`, `setLanguage()`, `toggleLanguage()`, `getLocalizedValue()`, `formatDate()`. MN/EN сонголт localStorage-д үлдэнэ. Хэл солиход shell болон page шинэчлэгдэнэ.

## 2.6 Services data layer

Номын `nutritions.json` → `src/data/courses.json`; `nutritionService.js` → `courseService.js`. `config.js`-ийн data base URL-ээс `dataService.js` нь JSON fetch хийж кэшлэнэ. UI нь fetch замыг мэдэхгүй. Ирц, журнал зэрэг өөрчлөлт localStorage-д тусдаа collection байдлаар хадгалагдана. Бодит API хийгээгүй; `API_BASE_URL` нь null.

## 2.7 JSON өгөгдөл шүүж харуулах

`sidebarPageLayout.js`, `notificationLayout.js`, `tableLayout.js`; `searchCourseSidebar.js`, `courseTables.js`; `fn/format.js`, `fn/courseSearchEvents.js`; `pages/searchPage.js`. Номын хүнсний нэр/бүлэг/төрлийн шүүлтүүр → хичээлийн нэр/мэргэжил/лекц-практик-лаб. Хайлт, шүүлтүүрийг хамтад нь ашиглана. Dynamic HTML-д raw data escape хийнэ.

Шалгах: CON354, construction, Монгол нэрээр хайх; мэргэжил болон төрлийг хавсарч сонгох; үр дүнгүй хайлт; clear; CSV.

## 2.8 Зураг шүүж харуулах

`src/tools/generate-images-json.mjs` → `src/data/images.json`; `services/imageService.js`; `components/imageModal.js`, `infoModal.js`; `scss/components/_modals.scss`. Хичээлийн кодоор SVG asset-ийг олж modal-д харуулна. Олон зураг нэмэх бол `CON354__2.svg` гэх мэт нэр ашиглаж manifest дахин үүсгэнэ. Native dialog нь focus trap, Escape, focus return-той.

## 2.9 Хайлт хэл солих

`courses.json` дотор нэр/тайлбар `{mn,en}` бүтэцтэй. `getLocalizedValue()` хүснэгт, карт, хуваарийн текстийг сонгоно. `src/tools/searchUniqueField.js` нь талбарын давтагдахгүй утгыг гаргана. `convertCoursesEnMn.js` нь урьдчилан өгсөн орчуулгын dictionary-г ашиглаж хувиргана; автоматаар зохиомол орчуулга үүсгэхгүй. Хайлт, шүүлтүүр URL query-д хадгалагдаж хэл солиход хэвээр үлдэнэ.

## 2.10 Overview

`mapService.js`, `map.js`, `infoModal.js`, `txtService.js`, `overviewText.js`, `splitPageLayout.js`, `overviewPage.js`. Номын аймаг → хүнсний холбоосыг мэргэжил → хичээлийн холбоос болгосон. Географийн Монголын зураг нь LMS-д хамаарахгүй тул чиглэлийн SVG tile-аар орлуулсан. `txt.json` нь хоёр хэлний intro. Статистик нь courses/students/attendance/grades/plan өгөгдлөөс тооцогдоно; Figma-ийн 324, 98.5 гэх мэт тоог бодит мэт хуулаагүй.

## 2.11 Calculation

Номын хүнсний хэрэгцээ/найрлага тооцох хэсгийг дүнгийн жин/оноо/голч болгосон. `gradeRequirements.json`, `gradeRequirementService.js`, `fn/gradeGetters.js`, `components/calculationTable.js`, `pages/calculationPage.js`.

Хувийн оноо × жин / 100 → нийт дүн; үсгэн үнэлгээ → GPA; GPA × кредитийн нийлбэр / нийт кредит → голч. Хоосон/сөрөг/хэтэрсэн/тоон бус оноо хүчингүй. Сонгосон хичээлийг нэмэх/хасах, хадгалах боломжтой. Журнал тусдаа бодит raw maximum (20/30/20/30)-аар оруулна. Үнэлгээний дүрэм нь төслийн жишээ, албан ёсны журам биш.

## 2.12 Books

`bookService.js`, `gridPageLayout.js`, `bookCard.js`, `pdfModal.js`, `booksPage.js`, `data/books.json`, `pdf/con354-lab-guide.pdf`. Grid card-аар сургалтын материал харуулж modal iframe-д local PDF нээнэ. Номын copyrighted PDF-үүдийг дахин оруулаагүй; өөрийн нэг хуудастай жишээ удирдамж хийж, render-ээр шалгасан. PDF үүсгэх эх код `tools/generate-guide.py`.

## 2.13 Footer

`components/footer.js`, `app.js`, `scss/components/_navbar.scss` дахь footer style, `translations.js`. Номын дарааллын үндсэн app бүрэлдэхүүн энд дуусна.

## Figma-гаас нэмсэн LMS хэсгүүд

`attendancePage`, `journalPage`, `planPage`, `messagesPage`, `feedbackPage`, `logsPage`, `archivePage`, `loginPage`, `coursePage` нь номын хүнсний төслөөс гадуурх LMS сэдвийн нэмэлтүүд. Эдгээр нь дээрх router/layout/services/components бүтцийг ашигладаг. Хэрэглэгчийн компьютер дээр нээлттэй Figma загварын бүтэц, өнгө, шаардлагыг дагасан; Figma-ийн эх React кодыг импортлоогүй.

## Шалгалт ба хүлээлгэн өгөх

`VALIDATION.md` нь гүйцэтгэсэн шалгалтын үр дүнг, `README.md` нь ажиллуулах болон хязгаарлалтыг тайлбарлана. Эцсийн бүх эх код, JSON, SCSS, CSS, assets, local docs build, тестүүд багтсан. GitHub/Classroom-д илгээх нь хэрэглэгчийн зөвшөөрөлгүй хийгдэхгүй.
