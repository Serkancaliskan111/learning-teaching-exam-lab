# Learning Teaching Exam Lab

Jim Scrivener — *Learning Teaching* (Ch 1, 2, 4, 5, 6, 8, 11) sınav hazırlık sitesi.

Mor-beyaz arayüz · EN + (TR) özetler · bilgi kartları · quiz · metod sözlüğü

## Vercel deploy

1. [Vercel](https://vercel.com) → **Add New Project** → bu GitHub reposunu import et  
   `Serkancaliskan111/learning-teaching-exam-lab`
2. Framework preset: **Other**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy

`vercel.json` bu ayarları zaten içerir; Import sonrası Deploy yeterli.

CLI ile:

```bash
npm i -g vercel
vercel
```

## Yerel çalıştırma

```bash
npm run dev
# http://127.0.0.1:8765
```

veya:

```bash
npx serve public -p 8765
```

## Klasörler

- `public/` — statik site (HTML/CSS/JS + data)
- `data/` — kaynak JSON (build sırasında `dist/data`’ya kopyalanır)
- `scripts/vercel-build.mjs` — Vercel build
- `includes/` + `*.php` — isteğe bağlı yerel PHP sürümü
