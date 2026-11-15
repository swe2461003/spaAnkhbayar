"""Optional: regenerate the original sample PDF (requires reportlab)."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

root = Path(__file__).resolve().parent.parent
font = Path('C:/Windows/Fonts/arial.ttf')
if not font.exists():
    raise SystemExit('Set font to an installed Unicode TTF supporting Mongolian.')
pdfmetrics.registerFont(TTFont('Guide', str(font)))
out = root / 'src/pdf/con354-lab-guide.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
c = canvas.Canvas(str(out), pagesize=(595.28, 841.89))
c.setTitle('CON354 SPA Laboratory Guide')
c.setAuthor('CON354 LMS Demo Project')
c.setFillColor(HexColor('#15803d')); c.rect(0, 674, 595.28, 168, stroke=0, fill=1)
c.setFillColorRGB(1, 1, 1); c.setFont('Guide', 11); c.drawString(48, 792, 'CON354  /  DLMS  /  VANILLA JAVASCRIPT')
c.setFont('Guide', 25); c.drawString(48, 742, 'SPA лабораторийн удирдамж')
c.setFont('Guide', 11); c.drawString(48, 710, 'Төслийн жишээ материал · Sample learning resource')
sections = [
    ('01  Router ба Pages', ['Hash route-оор overview, search, calculation хуудсыг нээнэ.', 'Буцах, урагшлах, refresh болон 404 чиглүүлэлтийг шалгана.']),
    ('02  Services ба JSON', ['Өгөгдлийг fetch ашиглан services давхаргаар ачаална.', 'Ачаалалт, алдаа, хоосон үр дүнгийн төлөвийг харуулна.']),
    ('03  Components ба Layouts', ['Navbar, table, card, modal зэрэг хэсгийг дахин ашиглана.', 'Хэрэглэгчийн бичвэрийг HTML-д оруулахдаа escape хийнэ.']),
    ('04  Ирц, журнал, тооцоолол', ['Ирц ба дүнг хадгалаад refresh хийж шалгана.', 'Явц 20 + Лаб 30 + Бие даалт 20 + Улирал 30 = 100.']),
    ('05  Шалгах ажил', ['Монгол / Англи хэл болон гар утасны дэлгэцээр туршина.', 'npm run check · npm test · npm run test:e2e · npm run build'])
]
y = 634
for title, lines in sections:
    c.setFillColor(HexColor('#17212f')); c.setFont('Guide', 14); c.drawString(48, y, title)
    y -= 28; c.setFillColor(HexColor('#64748b')); c.setFont('Guide', 10)
    for line in lines:
        c.drawString(48, y, line); y -= 19
    y -= 27
c.setStrokeColor(HexColor('#e2e8f0')); c.line(48, 95, 547, 95)
c.setFont('Guide', 9); c.setFillColor(HexColor('#64748b'))
c.drawString(48, 73, 'Энэ PDF нь жишээ материал. Багшийн эх ном болон лекцийг орлохгүй.')
c.drawRightString(547, 44, '1 / 1')
c.save()
print(out)
