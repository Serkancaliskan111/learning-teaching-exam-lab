<?php
declare(strict_types=1);

session_start();

define('ROOT', dirname(__DIR__));
define('DATA', ROOT . '/data');

function e(?string $s): string
{
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function load_json(string $file): array
{
    $path = DATA . '/' . ltrim($file, '/');
    if (!is_file($path)) {
        return [];
    }
    $raw = file_get_contents($path);
    $data = json_decode($raw ?: '[]', true);
    return is_array($data) ? $data : [];
}

function chapter_meta(): array
{
    static $meta = null;
    if ($meta === null) {
        $meta = require DATA . '/chapters.php';
    }
    return $meta;
}

function get_chapter(string $id): ?array
{
    $all = chapter_meta();
    return $all[$id] ?? null;
}

function load_chapter_content(string $id): array
{
    return load_json("content/{$id}.json");
}

function load_quizzes(string $id = 'all'): array
{
    if ($id === 'all') {
        $out = [];
        foreach (array_keys(chapter_meta()) as $cid) {
            $q = load_json("quizzes/{$cid}.json");
            foreach ($q as &$item) {
                $item['chapter'] = $cid;
            }
            $out = array_merge($out, $q);
        }
        return $out;
    }
    return load_json("quizzes/{$id}.json");
}

function load_flashcards(?string $id = null): array
{
    if ($id) {
        return load_json("flashcards/{$id}.json");
    }
    $out = [];
    foreach (array_keys(chapter_meta()) as $cid) {
        $cards = load_json("flashcards/{$cid}.json");
        foreach ($cards as &$c) {
            $c['chapter'] = $cid;
        }
        $out = array_merge($out, $cards);
    }
    return $out;
}

function load_methods(): array
{
    return load_json('methods.json');
}
