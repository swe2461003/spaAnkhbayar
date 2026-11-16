"""Regenerate the three original educational PDFs with reportlab and a Unicode TTF."""
from pathlib import Path
import os
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor

root = Path(__file__).resolve().parent.parent
font = Path(os.environ.get('LMS_PDF_FONT', 'C:/Windows/Fonts/arial.ttf'))
if not font.exists():
    raise SystemExit('Set LMS_PDF_FONT to a Unicode TTF font supporting Mongolian.')
pdfmetrics.registerFont(TTFont('Guide', str(font)))
guides = [
    ('con354-spa-guide.pdf', 'CON354', 'SPA төслийн лабораторийн удирдамж', [
        ('1 Router ба хайлт', ['Hash route бүр нээгдэж байгааг шалгана.', 'CON354 код, Монгол болон Англи нэрээр хайна.']),
        ('2 Мэргэжлийн зураглал', ['Чиглэл дээр дарж хичээлүүдийг сонгоно.', 'Сонголтоос хайлтын үр дүн рүү шилжинэ.']),
        ('3 Дүнгийн тооцоолол', ['80, 90, 85, 80 хувийн оноо оруулахад 84 гарна.', '20/30/20/30 жинг 10/40/30/20 загвартай харьцуулна.']),
        ('4 Материал ба шалгалт', ['PDF-ийг нээж, татаж аваад шалгана.', 'Хэл, refresh, mobile, алдааны төлөвүүдийг туршина.'])]),
    ('cs203-algorithm-guide.pdf', 'CS203', 'Алгоритмын дадлагын хуудас', [
        ('1 Өгөгдөл шүүх', ['Мэргэжил болон хичээлийн төрлөөр давхар шүүнэ.', 'Хоосон жагсаалтыг алдаагүй харуулна.']),
        ('2 Эрэмбэлэх', ['Хичээлийн кодоор өсөх дарааллаар эрэмбэлнэ.', 'Хэл солиход нэрийн эрэмбийг харьцуулна.']),
        ('3 Жинлэсэн нийлбэр', ['Нийт = явц*0.20 + лаб*0.30 + бие даалт*0.20 + шалгалт*0.30.', '16 + 27 + 17 + 24 = 84 оноо.']),
        ('4 Кредитээр жинлэх', ['GPA = нийлбэр(голч * кредит) / нийлбэр(кредит).', '(4*3 + 2*1) / 4 = 3.50 голч.'])]),
    ('db201-json-guide.pdf', 'DB201', 'JSON өгөгдөл зохион байгуулах', [
        ('1 Код ба түлхүүр', ['Хичээл бүр давтагдахгүй id талбартай байна.', 'Материалын course кодыг хичээлийн id-тай холбоно.']),
        ('2 Хоёр хэлний талбар', ['name: {mn: Монгол нэр, en: English name}', 'description талбарыг мөн хоёр хэлээр хадгална.']),
        ('3 Зургийн manifest', ['CON354.svg болон CON354__2.svg-ийг нэг кодод бүлэглэнэ.', 'npm run build:images командаар images.json шинэчилнэ.']),
        ('4 Өгөгдөл шалгах', ['Response.ok болон JSON бүтцийг шалгана.', 'Хэрэглэгчийн бичвэрийг HTML escape хийж харуулна.'])])
]
out = root / 'src/pdf'
out.mkdir(parents=True, exist_ok=True)
for filename, code, title, sections in guides:
    c = canvas.Canvas(str(out / filename), pagesize=(595.28, 841.89))
    c.setTitle(code + ' Learning Guide')
    c.setAuthor('CON354 LMS SPA Project')
    c.setFillColor(HexColor('#15803d')); c.rect(0, 680, 595.28, 162, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1); c.setFont('Guide', 11); c.drawString(48, 794, code + '  /  LMS SPA')
    c.setFont('Guide', 22); c.drawString(48, 743, title)
    c.setFont('Guide', 10); c.drawString(48, 711, 'Сургалтын материал · Learning resource')
    y = 633
    for heading, lines in sections:
        c.setFillColor(HexColor('#1f3b29')); c.setFont('Guide', 14); c.drawString(48, y, heading)
        y -= 31; c.setFillColor(HexColor('#64748b')); c.setFont('Guide', 10)
        for line in lines:
            c.drawString(48, y, line); y -= 22
        y -= 36
    c.setStrokeColor(HexColor('#e2e8f0')); c.line(48, 95, 547, 95)
    c.setFillColor(HexColor('#64748b')); c.setFont('Guide', 9)
    c.drawString(48, 72, 'Төсөлд зориулан бэлтгэсэн жишээ удирдамж. Албан ёсны лекцийг орлохгүй.')
    c.drawRightString(547, 44, '1 / 1'); c.save()
print('Created 3 original PDF learning guides.')
