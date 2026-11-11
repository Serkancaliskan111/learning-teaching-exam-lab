<?php
// PHP built-in server router
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/');
$file = __DIR__ . '/public' . $uri;
if ($uri !== '/' && is_file($file)) {
    return false;
}
if ($uri === '/' || $uri === '') {
    require __DIR__ . '/public/index.php';
    return true;
}
$php = __DIR__ . '/public' . $uri;
if (is_file($php) && str_ends_with($php, '.php')) {
    require $php;
    return true;
}
http_response_code(404);
echo 'Not found';
return true;
