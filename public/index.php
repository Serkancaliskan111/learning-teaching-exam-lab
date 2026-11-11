<?php
require_once __DIR__ . '/../includes/bootstrap.php';
$pageTitle = 'Learning Teaching Exam Lab';
$active = 'home';
require __DIR__ . '/../includes/header.php';
$chapters = require __DIR__ . '/../data/chapters.php';
?>
<section class="hero">
  <div class="hero-inner">
    <p class="eyebrow">Jim Scrivener · Learning Teaching</p>
    <h1>Learning Teaching<br><span>Exam Lab</span></h1>
    <p class="lead">Chapter 1, 2, 4, 5, 6, 8, 11 — İngilizce özet + Türkçe parantez, bilgi kartları, çoktan seçmeli ve boşluk doldurma. Sınav odaklı hap bilgiler.</p>
    <div class="cta-row">
      <a class="btn primary" href="chapters.php">Bölümlere Git</a>
      <a class="btn ghost" href="quiz.php">Sınav Modu</a>
      <a class="btn ghost" href="flashcards.php">Bilgi Kartları</a>
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

<section class="chapter-grid">
<?php foreach ($chapters as $id => $ch): ?>
  <a class="chapter-card" href="chapter.php?id=<?= urlencode($id) ?>">
    <span class="ch-num"><?= htmlspecialchars($ch['short']) ?></span>
    <h3><?= htmlspecialchars($ch['title_en']) ?></h3>
    <p><?= htmlspecialchars($ch['title_tr']) ?></p>
    <span class="meta"><?= count($ch['sections'] ?? []) ?> başlık · <?= (int)($ch['quiz_count'] ?? 0) ?> soru</span>
  </a>
<?php endforeach; ?>
</section>
<?php require __DIR__ . '/../includes/footer.php'; ?>
