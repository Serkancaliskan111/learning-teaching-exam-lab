(() => {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => [...el.querySelectorAll(s)];
  const params = new URLSearchParams(location.search);

  const escapeHtml = (str) =>
    String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const norm = (s) =>
    String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9ğüşıöç\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

  const softMatch = (a, b) => {
    const na = norm(a);
    const nb = norm(b);
    if (!na || !nb) return false;
    if (na === nb) return true;
    return nb.split('|').map((x) => x.trim()).some((x) => na === x || na.includes(x) || x.includes(na));
  };

  async function loadJSON(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    return res.json();
  }

  function shell(active, title) {
    document.title = `${title} · Scrivener`;
    const body = document.body;
    body.innerHTML = `
      <div class="bg-mesh" aria-hidden="true"></div>
      <header class="topbar">
        <a class="brand" href="index.html">LT<span>Exam</span></a>
        <nav>
          <a class="${active === 'home' ? 'on' : ''}" href="index.html">Ana Sayfa</a>
          <a class="${active === 'chapters' ? 'on' : ''}" href="chapters.html">Bölümler</a>
          <a class="${active === 'cards' ? 'on' : ''}" href="flashcards.html">Kartlar</a>
          <a class="${active === 'quiz' ? 'on' : ''}" href="quiz.html">Sınav</a>
          <a class="${active === 'methods' ? 'on' : ''}" href="methods.html">Metodlar</a>
        </nav>
      </header>
      <main class="wrap" id="app"><div class="panel empty">Yükleniyor…</div></main>
      <footer class="site-foot">
        <p>Learning Teaching · Jim Scrivener · Chapters 1 · 2 · 4 · 5 · 6 · 8 · 11</p>
        <p class="muted">Sınav labı · EN + (TR) · metodlar · kartlar · quiz</p>
      </footer>
    `;
    return qs('#app');
  }

  function chapterCards(chapters) {
    return Object.entries(chapters)
      .map(
        ([id, ch]) => `
      <a class="chapter-card" href="chapter.html?id=${encodeURIComponent(id)}">
        <span class="ch-num">${escapeHtml(ch.short)}</span>
        <h3>${escapeHtml(ch.title_en)}</h3>
        <p>${escapeHtml(ch.title_tr)}</p>
        <span class="meta">${(ch.sections || []).length} başlık · ${ch.quiz_count || 0} soru · ${ch.card_count || 0} kart</span>
      </a>`
      )
      .join('');
  }

  async function pageHome() {
    const app = shell('home', 'Learning Teaching Exam Lab');
    const chapters = await loadJSON('data/chapters.json');
    app.innerHTML = `
      <section class="hero">
        <div class="hero-inner">
          <p class="eyebrow">Jim Scrivener · Learning Teaching</p>
          <h1>Learning Teaching<br><span>Exam Lab</span></h1>
          <p class="lead">Chapter 1, 2, 4, 5, 6, 8, 11 — İngilizce özet + Türkçe parantez, bilgi kartları, çoktan seçmeli ve boşluk doldurma. Sınav odaklı hap bilgiler.</p>
          <div class="cta-row">
            <a class="btn primary" href="chapters.html">Bölümlere Git</a>
            <a class="btn ghost" href="quiz.html">Sınav Modu</a>
            <a class="btn ghost" href="flashcards.html">Bilgi Kartları</a>
          </div>
        </div>
      </section>
      <section class="panel">
        <h2>Çalışma Yolu</h2>
        <ol class="steps">
          <li><strong>Özet</strong> — Her başlık EN (TR) formatında, atlanmadan</li>
          <li><strong>Kartlar</strong> — Hap bilgi + chapter sonu tekrar</li>
          <li><strong>Quiz</strong> — MCQ + fill-in-the-blank + true/false</li>
          <li><strong>Metodlar</strong> — Tüm öğretim yöntemleri sözlüğü</li>
        </ol>
      </section>
      <section class="chapter-grid">${chapterCards(chapters)}</section>
    `;
  }

  async function pageChapters() {
    const app = shell('chapters', 'Bölümler');
    const chapters = await loadJSON('data/chapters.json');
    app.innerHTML = `
      <div class="page-head">
        <h1>Bölümler (Chapters)</h1>
        <p>Her bölümde tüm başlıklar İngilizce, ardından parantez içinde Türkçe. Hap bilgiler sınav rozetiyle işaretli; chapter sonunda tekrar kutusu var.</p>
      </div>
      <section class="chapter-grid">${chapterCards(chapters)}</section>
    `;
  }

  async function pageChapter() {
    const id = (params.get('id') || 'ch1').replace(/[^a-z0-9]/gi, '') || 'ch1';
    const app = shell('chapters', 'Bölüm');
    const chapters = await loadJSON('data/chapters.json');
    const meta = chapters[id];
    if (!meta) {
      app.innerHTML = `<div class="empty">Bölüm bulunamadı.</div>`;
      return;
    }
    document.title = `${meta.short} · ${meta.title_en} · Scrivener`;
    let content = null;
    try {
      content = await loadJSON(`data/content/${id}.json`);
    } catch {
      content = null;
    }
    let html = `
      <div class="page-head">
        <p class="eyebrow">${escapeHtml(meta.short)}</p>
        <h1>${escapeHtml(meta.title_en)} <span style="color:var(--muted);font-size:.7em">(${escapeHtml(meta.title_tr)})</span></h1>
        <p>Özet · hap bilgiler · chapter sonu tekrar. Sınav rozetli maddeler çoktan seçmeli / boşluk için kritik.</p>
        <div class="toolbar">
          <a class="btn solid sm" href="flashcards.html?chapter=${encodeURIComponent(id)}">Bilgi Kartları</a>
          <a class="btn outline sm" href="quiz.html?chapter=${encodeURIComponent(id)}">Bu Bölüm Sınavı</a>
          <a class="btn outline sm" href="chapters.html">Tüm Bölümler</a>
        </div>
      </div>`;
    if (!content) {
      html += `<div class="panel empty">İçerik henüz yüklenmedi.</div>`;
      app.innerHTML = html;
      return;
    }
    for (const section of content.sections || []) {
      html += `<article class="section-block" id="${escapeHtml(section.id || '')}">
        <h2>${escapeHtml(section.heading_en || '')}</h2>
        <p class="heading-tr">(${escapeHtml(section.heading_tr || '')})</p>`;
      for (const p of section.points || []) {
        html += `<div class="point ${p.exam ? 'exam' : ''}">
          ${p.exam ? '<span class="badge">Sınav / Exam</span>' : ''}
          <div class="en">${escapeHtml(p.en || '')}</div>
          <div class="tr">(${escapeHtml(p.tr || '')})</div>
        </div>`;
      }
      if (section.key_terms?.length) {
        html += `<div class="terms">`;
        for (const t of section.key_terms) {
          html += `<div class="term">
            <strong>${escapeHtml(t.en || '')} (${escapeHtml(t.tr || '')})</strong>
            <div>${escapeHtml(t.def_en || '')}</div>
            <div class="tr">(${escapeHtml(t.def_tr || '')})</div>
          </div>`;
        }
        html += `</div>`;
      }
      html += `</article>`;
    }
    if (content.chapter_review?.length) {
      html += `<section class="review-box"><h2>Chapter Review — Tekrar (Exam Hotspots)</h2><ul>`;
      for (const r of content.chapter_review) {
        html += `<li><div>${escapeHtml(r.en || '')}</div><div class="tr">(${escapeHtml(r.tr || '')})</div></li>`;
      }
      html += `</ul></section>`;
    }
    app.innerHTML = html;
  }

  async function loadAllCards(chapter) {
    const chapters = await loadJSON('data/chapters.json');
    if (chapter) return loadJSON(`data/flashcards/${chapter}.json`);
    const all = [];
    for (const id of Object.keys(chapters)) {
      const cards = await loadJSON(`data/flashcards/${id}.json`);
      cards.forEach((c) => all.push({ ...c, chapter: id }));
    }
    return all;
  }

  async function pageFlashcards() {
    const chapter = (params.get('chapter') || '').replace(/[^a-z0-9]/gi, '') || null;
    const app = shell('cards', 'Bilgi Kartları');
    const chapters = await loadJSON('data/chapters.json');
    const meta = chapter ? chapters[chapter] : null;
    let cards = [];
    try {
      cards = await loadAllCards(chapter);
    } catch {
      cards = [];
    }
    const toolbar = [
      `<a class="btn ${!chapter ? 'solid' : 'outline'} sm" href="flashcards.html">Tümü</a>`,
      ...Object.entries(chapters).map(
        ([id, ch]) =>
          `<a class="btn ${chapter === id ? 'solid' : 'outline'} sm" href="flashcards.html?chapter=${encodeURIComponent(id)}">${escapeHtml(ch.short)}</a>`
      ),
    ].join('');
    app.innerHTML = `
      <div class="page-head">
        <h1>Bilgi Kartları (Flashcards)</h1>
        <p>${meta ? escapeHtml(meta.short + ' · ' + meta.title_en) : 'Tüm bölümler'} — karta tıkla, çevir; ezber için shuffle kullan.</p>
        <div class="toolbar">${toolbar}</div>
      </div>
      ${
        !cards.length
          ? '<div class="panel empty">Kartlar henüz hazır değil.</div>'
          : `<div class="progress-bar" data-bar><span></span></div>
             <div class="flash-stage" data-flash>
               <div>
                 <div class="tag" data-tag></div>
                 <div data-front></div>
                 <div data-back hidden></div>
                 <p class="tr" style="margin-top:1rem">Tıkla / çevir</p>
               </div>
             </div>
             <div class="toolbar" style="justify-content:center">
               <button class="btn outline" type="button" data-prev>← Önceki</button>
               <span data-counter style="align-self:center;color:var(--muted)"></span>
               <button class="btn outline" type="button" data-next>Sonraki →</button>
               <button class="btn solid" type="button" data-shuffle>Karıştır</button>
             </div>`
      }`;
    if (cards.length) initFlash(cards);
  }

  function initFlash(cards) {
    const stage = qs('[data-flash]');
    let i = 0;
    let flipped = false;
    const front = qs('[data-front]', stage);
    const back = qs('[data-back]', stage);
    const tag = qs('[data-tag]', stage);
    const counter = qs('[data-counter]');
    const bar = qs('[data-bar] span');
    const render = () => {
      const c = cards[i];
      if (!c) return;
      flipped = false;
      stage.classList.remove('flipped');
      tag.textContent = c.tag || 'concept';
      front.innerHTML = `<h2>${escapeHtml(c.front_en)}</h2><div class="tr">(${escapeHtml(c.front_tr || '')})</div>`;
      back.innerHTML = `<h2>${escapeHtml(c.back_en)}</h2><div class="tr">(${escapeHtml(c.back_tr || '')})</div>`;
      front.hidden = false;
      back.hidden = true;
      if (counter) counter.textContent = `${i + 1} / ${cards.length}`;
      if (bar) bar.style.width = `${((i + 1) / cards.length) * 100}%`;
    };
    stage.addEventListener('click', () => {
      flipped = !flipped;
      stage.classList.toggle('flipped', flipped);
      front.hidden = flipped;
      back.hidden = !flipped;
    });
    qs('[data-prev]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      i = (i - 1 + cards.length) % cards.length;
      render();
    });
    qs('[data-next]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      i = (i + 1) % cards.length;
      render();
    });
    qs('[data-shuffle]')?.addEventListener('click', (e) => {
      e.stopPropagation();
      for (let a = cards.length - 1; a > 0; a--) {
        const b = Math.floor(Math.random() * (a + 1));
        [cards[a], cards[b]] = [cards[b], cards[a]];
      }
      i = 0;
      render();
    });
    render();
  }

  async function loadQuizzes(chapter) {
    const chapters = await loadJSON('data/chapters.json');
    if (chapter) {
      const q = await loadJSON(`data/quizzes/${chapter}.json`);
      return q.map((item) => ({ ...item, chapter }));
    }
    const all = [];
    for (const id of Object.keys(chapters)) {
      const q = await loadJSON(`data/quizzes/${id}.json`);
      q.forEach((item) => all.push({ ...item, chapter: id }));
    }
    return all;
  }

  async function pageQuiz() {
    const chapter = (params.get('chapter') || '').replace(/[^a-z0-9]/gi, '') || null;
    const mode = params.get('mode') || 'practice';
    const app = shell('quiz', 'Sınav Modu');
    const chapters = await loadJSON('data/chapters.json');
    const meta = chapter ? chapters[chapter] : null;
    let questions = await loadQuizzes(chapter);
    if (mode === 'exam' && questions.length) {
      for (let a = questions.length - 1; a > 0; a--) {
        const b = Math.floor(Math.random() * (a + 1));
        [questions[a], questions[b]] = [questions[b], questions[a]];
      }
      questions = questions.slice(0, Math.min(25, questions.length));
    }
    const toolbar = [
      `<a class="btn ${!chapter && mode !== 'exam' ? 'solid' : 'outline'} sm" href="quiz.html">Tüm sorular</a>`,
      `<a class="btn ${mode === 'exam' ? 'solid' : 'outline'} sm" href="quiz.html?mode=exam${chapter ? '&chapter=' + encodeURIComponent(chapter) : ''}">25’li Deneme</a>`,
      ...Object.entries(chapters).map(
        ([id, ch]) =>
          `<a class="btn ${chapter === id ? 'solid' : 'outline'} sm" href="quiz.html?chapter=${encodeURIComponent(id)}">${escapeHtml(ch.short)}</a>`
      ),
    ].join('');
    let body = `
      <div class="page-head">
        <h1>Sınav (Quiz)</h1>
        <p>${meta ? escapeHtml(meta.short + ' · ' + meta.title_en) : 'Karma sınav'} — MCQ, boşluk doldurma, doğru/yanlış. Anında geri bildirim + açıklama.</p>
        <div class="toolbar">${toolbar}</div>
      </div>`;
    if (!questions.length) {
      app.innerHTML = body + `<div class="panel empty">Sorular henüz yüklenmedi.</div>`;
      return;
    }
    body += `<div data-quiz>`;
    questions.forEach((q, i) => {
      body += `<article class="quiz-card" data-q="${escapeHtml(q.id)}">
        <div class="q-type">${escapeHtml(String(q.type || 'mcq').toUpperCase())} · ${escapeHtml(q.difficulty || 'medium')}${q.chapter ? ' · ' + escapeHtml(q.chapter) : ''}</div>
        <h3>${i + 1}. ${escapeHtml(q.prompt_en || '')}</h3>
        <p class="tr">(${escapeHtml(q.prompt_tr || '')})</p>`;
      if (q.type === 'mcq' || q.type === 'tf') {
        const opts = q.options || (q.type === 'tf' ? ['True', 'False'] : []);
        body += `<div class="options">${opts
          .map((opt) => `<button type="button" class="option" data-opt="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`)
          .join('')}</div>`;
      } else if (q.type === 'fill') {
        body += `<input class="fill-input" type="text" placeholder="Cevabı yaz / Type answer" autocomplete="off">
          <button type="button" class="btn solid sm" data-check>Kontrol et</button>`;
      }
      body += `<div class="feedback" data-feedback></div></article>`;
    });
    body += `</div>
      <div class="scoreboard">
        <span>Skor: <strong data-score>0</strong></span>
        <span>Cevaplanan: <strong data-answered>0</strong></span>
      </div>`;
    app.innerHTML = body;
    initQuiz(questions);
  }

  function initQuiz(questions) {
    const quizRoot = qs('[data-quiz]');
    let score = 0;
    let answered = 0;
    const scoreEl = qs('[data-score]');
    const answeredEl = qs('[data-answered]');
    const updateScore = () => {
      if (scoreEl) scoreEl.textContent = String(score);
      if (answeredEl) answeredEl.textContent = `${answered} / ${questions.length}`;
    };
    qsa('[data-q]', quizRoot).forEach((card) => {
      const id = card.dataset.q;
      const q = questions.find((x) => x.id === id);
      if (!q) return;
      const feedback = qs('[data-feedback]', card);
      let locked = false;
      const showFeedback = (ok, extra = '') => {
        feedback.className = `feedback show ${ok ? 'ok' : 'bad'}`;
        feedback.innerHTML = `<strong>${ok ? 'Doğru' : 'Yanlış'}</strong> — ${escapeHtml(q.explain_en || '')}<br><span class="tr">(${escapeHtml(q.explain_tr || '')})</span>${extra}`;
      };
      if (q.type === 'mcq' || q.type === 'tf') {
        qsa('[data-opt]', card).forEach((btn) => {
          btn.addEventListener('click', () => {
            if (locked) return;
            locked = true;
            answered += 1;
            const ok = norm(btn.dataset.opt) === norm(q.answer);
            if (ok) {
              score += 1;
              btn.classList.add('correct');
            } else {
              btn.classList.add('wrong');
              qsa('[data-opt]', card).forEach((b) => {
                if (norm(b.dataset.opt) === norm(q.answer)) b.classList.add('correct');
              });
            }
            showFeedback(ok);
            updateScore();
          });
        });
      }
      if (q.type === 'fill') {
        const input = qs('input', card);
        const check = qs('[data-check]', card);
        check?.addEventListener('click', () => {
          if (locked) return;
          locked = true;
          answered += 1;
          const ok = softMatch(input?.value || '', q.answer);
          if (ok) score += 1;
          showFeedback(ok, `<div style="margin-top:.4rem">Cevap / Answer: <strong>${escapeHtml(q.answer)}</strong></div>`);
          updateScore();
        });
        input?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') check?.click();
        });
      }
    });
    updateScore();
  }

  async function pageMethods() {
    const app = shell('methods', 'Öğretim Metodları');
    const methods = await loadJSON('data/methods.json');
    app.innerHTML = `
      <div class="page-head">
        <h1>Öğretim Metodları (Teaching Methods)</h1>
        <p>Scrivener’daki ana yaklaşımlar, teknikler ve classroom toolkit — sınavda geçen tüm metod hapları.</p>
      </div>
      <div class="method-grid">
        ${methods
          .map(
            (m) => `<article class="method-card">
            ${m.chapter ? `<span class="chip">${escapeHtml(m.chapter)}</span>` : ''}
            ${m.family ? `<span class="chip">${escapeHtml(m.family)}</span>` : ''}
            <h3>${escapeHtml(m.name_en || '')}</h3>
            <p class="tr">(${escapeHtml(m.name_tr || '')})</p>
            <div>${escapeHtml(m.def_en || '')}</div>
            <div class="tr" style="margin-top:.35rem">(${escapeHtml(m.def_tr || '')})</div>
            ${
              m.exam_tip_en
                ? `<p style="margin:.7rem 0 0"><span class="badge">Sınav</span> ${escapeHtml(m.exam_tip_en)} <span class="tr">(${escapeHtml(m.exam_tip_tr || '')})</span></p>`
                : ''
            }
          </article>`
          )
          .join('')}
      </div>`;
  }

  const page = document.body.dataset.page || 'home';
  const routes = {
    home: pageHome,
    chapters: pageChapters,
    chapter: pageChapter,
    flashcards: pageFlashcards,
    quiz: pageQuiz,
    methods: pageMethods,
  };
  (routes[page] || pageHome)().catch((err) => {
    console.error(err);
    const app = qs('#app') || shell('home', 'Hata');
    app.innerHTML = `<div class="panel empty">Yükleme hatası: ${escapeHtml(err.message)}</div>`;
  });
})();
