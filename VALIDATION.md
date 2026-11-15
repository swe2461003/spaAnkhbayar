# Шалгалтын үр дүн

Огноо: 2026-11-15, Asia/Ulaanbaatar.

| Шалгалт | Үр дүн |
| --- | --- |
| `npm run check` | JavaScript syntax болон relative imports алдаагүй |
| `npm test` | 9/9 тест тэнцсэн |
| `npm run test:e2e` — src | 21/21 browser scenario тэнцсэн |
| `SERVE_DOCS=1 npm run test:e2e` — docs | 21/21 browser scenario тэнцсэн |
| `npm run build` | images.json, Sass CSS, docs статик build амжилттай |
| npm install audit | 0 vulnerabilities гэж тайлагнасан |
| PDF render | 1 хуудас render хийж нүдээр шалгасан; кирилл үсэг, мөр, зай цэвэр |
| Desktop screenshot | 1440px өргөнд Dashboard шалгасан |
| Mobile screenshot | 390px өргөнд хичээлийн хайлт/цэс шалгасан; document overflow байхгүй |

Браузерын шалгалтад демо нэвтрэлт, Dashboard, хичээл хайх/шүүх, хоосон төлөв, image modal ба Escape, CSV таталт, Монгол/Англи хэл ба шүүлтүүр хадгалах, ирц/дүн/тэмдэглэл хадгалах ба refresh, 84.00 → 88.00 жинлэсэн тооцоо, PDF modal/файл, мессежийн HTML escape, нэргүй санал/төлөв, Logs-ийн 8 мөрийн хуудаслалт/хайлт, архивын 4 таб/шүүлтүүр, бүх route/404, мэргэжлийн сонголт хадгалах, Back/Forward/refresh, keyboard skip link, loading failure/retry, удаан хуучин route шинэ page-ийг дарахгүй байх, mobile menu/overflow, оюутны засах эрхгүй горим, ердийн урсгал дахь uncaught error/дутуу asset-ийг хамруулсан.

Машинаар унших тайлан: `validation/browser-src.json`, `validation/browser-docs.json`.

Тестийг суусан Google Chrome-ийн тусгаарласан headless профайлаар хийсэн. Бодит аккаунт, олон хэрэглэгчийн сервер, бодит мессеж хүргэлт, Classroom submission, GitHub deployment шалгаагүй; төсөл тэдгээрт холбогдоогүй. Нэвтрэлт болон эрх нь зөвхөн демо. Бусад браузер болон assistive technology-гаар өргөн аудит хийгээгүй.
