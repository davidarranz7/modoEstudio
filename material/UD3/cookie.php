<?php
setcookie('idioma', 'es', [
    'expires' => time() + 3600,
    'path' => '/',
    'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Lax'
]);
$idioma = $_COOKIE['idioma'] ?? 'sin preferencia recibida';
echo htmlspecialchars($idioma, ENT_QUOTES, 'UTF-8');
