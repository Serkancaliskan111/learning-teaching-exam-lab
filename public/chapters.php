<?php
require_once __DIR__ . '/../includes/bootstrap.php';
$pageTitle = 'Bölümler';
$active = 'chapters';
require __DIR__ . '/../includes/header.php';
$chapters = chapter_meta();
?>
<div class="page-head">
  <h1>Bölümler (Chapters)</h1>
  <p>Her bölümde tüm başlıklar İngilizce, ardından parantez içinde Türkçe. Hap bilgiler sınav rozetiyle işaretli; chapter sonunda tekrar kutusu var.</p>
</div>
<section class="chapter-grid">
<?php foreach ($chapters as $id => $ch): ?>
  <a class="chapter-card" href="chapter.php?id=<?= urlencode($id) ?>">
    <span class="ch-num"><?= e($ch['short']) ?></span>
    <h3><?= e($ch['title_en']) ?></h3>
    <p><?= e($ch['title_tr']) ?></p>
    <span class="meta"><?= count($ch['sections'] ?? []) ?> başlık · <?= (int)($ch['quiz_count'] ?? 0) ?> soru · <?= (int)($ch['card_count'] ?? 0) ?> kart</span>
  </a>
<?php endforeach; ?>
</section>
<?php require __DIR__ . '/../includes/footer.php'; ?>
