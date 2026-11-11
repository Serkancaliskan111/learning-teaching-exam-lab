(() => {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => [...el.querySelectorAll(s)];

  // Flashcards
  const stage = qs('[data-flash]');
  if (stage) {
    const cards = JSON.parse(qs('#flash-data')?.textContent || '[]');
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

  // Quiz
  const quizRoot = qs('[data-quiz]');
  if (quizRoot) {
    const questions = JSON.parse(qs('#quiz-data')?.textContent || '[]');
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
            const val = btn.dataset.opt;
            const ok = norm(val) === norm(q.answer);
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
          const val = input?.value || '';
          const ok = softMatch(val, q.answer);
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

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9ğüşıöç\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function softMatch(a, b) {
    const na = norm(a);
    const nb = norm(b);
    if (!na || !nb) return false;
    if (na === nb) return true;
    const alts = nb.split('|').map((x) => x.trim());
    return alts.some((x) => na === x || na.includes(x) || x.includes(na));
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
