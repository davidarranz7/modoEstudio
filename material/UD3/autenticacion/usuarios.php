<?php
function getUsuarioByUserName(string $username): ?array {
    $ruta = __DIR__ . '/usuarios.json';
    $contenido = file_get_contents($ruta);
    if ($contenido === false) return null;
    $usuarios = json_decode($contenido, true);
    if (!is_array($usuarios)) return null;
    foreach ($usuarios as $usuario) {
        if (isset($usuario['usuario']) && $usuario['usuario'] === $username) {
            return $usuario;
        }
    }
    return null;
}
