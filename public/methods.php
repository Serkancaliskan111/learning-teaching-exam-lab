<?php
require_once __DIR__ . '/../includes/bootstrap.php';
$methods = load_methods();
$pageTitle = 'Öğretim Metodları';
$active = 'methods';
require __DIR__ . '/../includes/header.php';
?>
<div class="page-head">
  <h1>Öğretim Metodları (Teaching Methods)</h1>
  <p>Scrivener’daki ana yaklaşımlar, teknikler ve classroom toolkit — sınavda geçen tüm metod hapları.</p>
</div>
<?php if (!$methods): ?>
  <div class="panel empty">Metod sözlüğü yükleniyor…</div>
<?php else: ?>
  <div class="method-grid">
    <?php foreach ($methods as $m): ?>
      <article class="method-card">
        <?php if (!empty($m['chapter'])): ?><span class="chip"><?= e($m['chapter']) ?></span><?php endif; ?>
        <?php if (!empty($m['family'])): ?><span class="chip"><?= e($m['family']) ?></span><?php endif; ?>
        <h3><?= e($m['name_en'] ?? '') ?></h3>
        <p class="tr">(<?= e($m['name_tr'] ?? '') ?>)</p>
        <div><?= e($m['def_en'] ?? '') ?></div>
        <div class="tr" style="margin-top:.35rem">(<?= e($m['def_tr'] ?? '') ?>)</div>
        <?php if (!empty($m['exam_tip_en'])): ?>
          <p style="margin:.7rem 0 0"><span class="badge">Sınav</span> <?= e($m['exam_tip_en']) ?> <span class="tr">(<?= e($m['exam_tip_tr'] ?? '') ?>)</span></p>
        <?php endif; ?>
      </article>
    <?php endforeach; ?>
  </div>
<?php endif; ?>
<?php require __DIR__ . '/../includes/footer.php'; ?>
