<?php
require_once __DIR__ . '/../includes/bootstrap.php';
$chapter = preg_replace('/[^a-z0-9]/i', '', $_GET['chapter'] ?? '') ?: null;
$cards = $chapter ? load_flashcards($chapter) : load_flashcards();
$meta = $chapter ? get_chapter($chapter) : null;
$pageTitle = 'Bilgi Kartları';
$active = 'cards';
require __DIR__ . '/../includes/header.php';
?>
<div class="page-head">
  <h1>Bilgi Kartları (Flashcards)</h1>
  <p><?= $meta ? e($meta['short'] . ' · ' . $meta['title_en']) : 'Tüm bölümler' ?> — karta tıkla, çevir; ezber için shuffle kullan.</p>
  <div class="toolbar">
    <a class="btn <?= !$chapter ? 'solid' : 'outline' ?> sm" href="flashcards.php">Tümü</a>
    <?php foreach (chapter_meta() as $id => $ch): ?>
      <a class="btn <?= $chapter === $id ? 'solid' : 'outline' ?> sm" href="flashcards.php?chapter=<?= e($id) ?>"><?= e($ch['short']) ?></a>
    <?php endforeach; ?>
  </div>
</div>

<?php if (!$cards): ?>
  <div class="panel empty">Kartlar henüz hazır değil.</div>
<?php else: ?>
  <script type="application/json" id="flash-data"><?= json_encode($cards, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) ?></script>
  <div class="progress-bar" data-bar><span></span></div>
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
  </div>
<?php endif; ?>
<?php require __DIR__ . '/../includes/footer.php'; ?>
