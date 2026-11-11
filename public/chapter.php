<?php
require_once __DIR__ . '/../includes/bootstrap.php';
$id = preg_replace('/[^a-z0-9]/i', '', $_GET['id'] ?? '') ?: 'ch1';
$meta = get_chapter($id);
$content = load_chapter_content($id);
if (!$meta) {
    http_response_code(404);
    $pageTitle = 'Bulunamadı';
    $active = 'chapters';
    require __DIR__ . '/../includes/header.php';
    echo '<div class="empty">Bölüm bulunamadı.</div>';
    require __DIR__ . '/../includes/footer.php';
    exit;
}
$pageTitle = $meta['short'] . ' · ' . $meta['title_en'];
$active = 'chapters';
require __DIR__ . '/../includes/header.php';
?>
<div class="page-head">
  <p class="eyebrow"><?= e($meta['short']) ?></p>
  <h1><?= e($meta['title_en']) ?> <span style="color:var(--muted);font-size:.7em">(<?= e($meta['title_tr']) ?>)</span></h1>
  <p>Özet · hap bilgiler · chapter sonu tekrar. Sınav rozetli maddeler çoktan seçmeli / boşluk için kritik.</p>
  <div class="toolbar">
    <a class="btn solid sm" href="flashcards.php?chapter=<?= e($id) ?>">Bilgi Kartları</a>
    <a class="btn outline sm" href="quiz.php?chapter=<?= e($id) ?>">Bu Bölüm Sınavı</a>
    <a class="btn outline sm" href="chapters.php">Tüm Bölümler</a>
  </div>
</div>

<?php if (!$content): ?>
  <div class="panel empty">İçerik henüz yükleniyor… OCR/özet dosyası bekleniyor.</div>
<?php else: ?>
  <?php foreach ($content['sections'] ?? [] as $section): ?>
    <article class="section-block" id="<?= e($section['id'] ?? '') ?>">
      <h2><?= e($section['heading_en'] ?? '') ?></h2>
      <p class="heading-tr">(<?= e($section['heading_tr'] ?? '') ?>)</p>
      <?php foreach ($section['points'] ?? [] as $p): ?>
        <div class="point <?= !empty($p['exam']) ? 'exam' : '' ?>">
          <?php if (!empty($p['exam'])): ?><span class="badge">Sınav / Exam</span><?php endif; ?>
          <div class="en"><?= e($p['en'] ?? '') ?></div>
          <div class="tr">(<?= e($p['tr'] ?? '') ?>)</div>
        </div>
      <?php endforeach; ?>
      <?php if (!empty($section['key_terms'])): ?>
        <div class="terms">
          <?php foreach ($section['key_terms'] as $t): ?>
            <div class="term">
              <strong><?= e($t['en'] ?? '') ?> (<?= e($t['tr'] ?? '') ?>)</strong>
              <div><?= e($t['def_en'] ?? '') ?></div>
              <div class="tr">(<?= e($t['def_tr'] ?? '') ?>)</div>
            </div>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>
    </article>
  <?php endforeach; ?>

  <?php if (!empty($content['chapter_review'])): ?>
    <section class="review-box">
      <h2>Chapter Review — Tekrar (Exam Hotspots)</h2>
      <ul>
        <?php foreach ($content['chapter_review'] as $r): ?>
          <li>
            <div><?= e($r['en'] ?? '') ?></div>
            <div class="tr">(<?= e($r['tr'] ?? '') ?>)</div>
          </li>
        <?php endforeach; ?>
      </ul>
    </section>
  <?php endif; ?>
<?php endif; ?>
<?php require __DIR__ . '/../includes/footer.php'; ?>
