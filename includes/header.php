<?php
$pageTitle = $pageTitle ?? 'Learning Teaching Exam Lab';
$active = $active ?? '';
?><!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($pageTitle) ?> · Scrivener</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Sora:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/app.css">
</head>
<body>
<div class="bg-mesh" aria-hidden="true"></div>
<header class="topbar">
  <a class="brand" href="index.php">LT<span>Exam</span></a>
  <nav>
    <a class="<?= $active === 'home' ? 'on' : '' ?>" href="index.php">Ana Sayfa</a>
    <a class="<?= $active === 'chapters' ? 'on' : '' ?>" href="chapters.php">Bölümler</a>
    <a class="<?= $active === 'cards' ? 'on' : '' ?>" href="flashcards.php">Kartlar</a>
    <a class="<?= $active === 'quiz' ? 'on' : '' ?>" href="quiz.php">Sınav</a>
    <a class="<?= $active === 'methods' ? 'on' : '' ?>" href="methods.php">Metodlar</a>
  </nav>
</header>
<main class="wrap">
