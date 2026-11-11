# Learning Teaching Exam Lab

Jim Scrivener — *Learning Teaching* (Ch 1, 2, 4, 5, 6, 8, 11) için PHP tabanlı sınav hazırlık sitesi.

## Özellikler

- Her başlık: **English (Türkçe)** özet
- Sınav rozetli hap bilgiler + chapter sonu tekrar
- Bilgi kartları (flashcards)
- Quiz: çoktan seçmeli, boşluk doldurma, doğru/yanlış
- Tüm öğretim metodları sözlüğü

## Çalıştırma

```bash
cd /Users/serkancaliskan/Desktop/civciv
php -S 127.0.0.1:8765 -t public
```

Tarayıcı: http://127.0.0.1:8765

## Klasörler

- `public/` — PHP arayüz
- `data/content/` — bölüm özetleri
- `data/flashcards/` — kartlar
- `data/quizzes/` — sorular
- `data/methods.json` — metod sözlüğü
- `ocr_text/` — kitaptan OCR metinleri
