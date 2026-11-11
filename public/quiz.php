<?php
require_once __DIR__ . '/../includes/bootstrap.php';
$chapter = preg_replace('/[^a-z0-9]/i', '', $_GET['chapter'] ?? '') ?: null;
$mode = $_GET['mode'] ?? 'practice';
$questions = $chapter ? load_quizzes($chapter) : load_quizzes('all');
if ($mode === 'exam' && $questions) {
    shuffle($questions);
    $questions = array_slice($questions, 0, min(25, count($questions)));
}
$meta = $chapter ? get_chapter($chapter) : null;
$pageTitle = 'Sınav Modu';
$active = 'quiz';
require __DIR__ . '/../includes/header.php';
?>
<div class="page-head">
  <h1>Sınav (Quiz)</h1>
  <p><?= $meta ? e($meta['short'] . ' · ' . $meta['title_en']) : 'Karma sınav' ?> — MCQ, boşluk doldurma, doğru/yanlış. Anında geri bildirim + açıklama.</p>
  <div class="toolbar">
    <a class="btn <?= !$chapter && $mode !== 'exam' ? 'solid' : 'outline' ?> sm" href="quiz.php">Tüm sorular</a>
    <a class="btn <?= $mode === 'exam' ? 'solid' : 'outline' ?> sm" href="quiz.php?mode=exam<?= $chapter ? '&chapter=' . e($chapter) : '' ?>">25’li Deneme</a>
    <?php foreach (chapter_meta() as $id => $ch): ?>
      <a class="btn <?= $chapter === $id ? 'solid' : 'outline' ?> sm" href="quiz.php?chapter=<?= e($id) ?>"><?= e($ch['short']) ?></a>
    <?php endforeach; ?>
  </div>
</div>

<?php if (!$questions): ?>
  <div class="panel empty">Sorular henüz yüklenmedi.</div>
<?php else: ?>
  <script type="application/json" id="quiz-data"><?= json_encode($questions, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP) ?></script>
  <div data-quiz>
    <?php foreach ($questions as $i => $q): ?>
      <article class="quiz-card" data-q="<?= e($q['id']) ?>">
        <div class="q-type"><?= e(strtoupper($q['type'] ?? 'mcq')) ?> · <?= e($q['difficulty'] ?? 'medium') ?><?= !empty($q['chapter']) ? ' · ' . e($q['chapter']) : '' ?></div>
        <h3><?= ($i + 1) . '. ' . e($q['prompt_en'] ?? '') ?></h3>
        <p class="tr">(<?= e($q['prompt_tr'] ?? '') ?>)</p>

        <?php if (($q['type'] ?? '') === 'mcq' || ($q['type'] ?? '') === 'tf'): ?>
          <div class="options">
            <?php
            $opts = $q['options'] ?? (($q['type'] ?? '') === 'tf' ? ['True', 'False'] : []);
            foreach ($opts as $opt):
            ?>
              <button type="button" class="option" data-opt="<?= e($opt) ?>"><?= e($opt) ?></button>
            <?php endforeach; ?>
          </div>
        <?php elseif (($q['type'] ?? '') === 'fill'): ?>
          <input class="fill-input" type="text" placeholder="Cevabı yaz / Type answer" autocomplete="off">
          <button type="button" class="btn solid sm" data-check>Kontrol et</button>
        <?php endif; ?>
        <div class="feedback" data-feedback></div>
      </article>
    <?php endforeach; ?>
  </div>
  <div class="scoreboard">
    <span>Skor: <strong data-score>0</strong></span>
    <span>Cevaplanan: <strong data-answered>0</strong></span>
  </div>
<?php endif; ?>
<?php require __DIR__ . '/../includes/footer.php'; ?>
