<?php
require_once __DIR__ . '/tarifas.php';
require_once __DIR__ . '/funciones.php';
$errores = [];
$nombre = $_POST['nombre'] ?? '';
$taller = $_POST['taller'] ?? '';
$sesiones = filter_input(INPUT_POST, 'sesiones', FILTER_VALIDATE_INT);
if (!is_string($nombre) || trim($nombre) === '') $errores[] = 'Nombre obligatorio';
if (!is_string($taller) || !array_key_exists($taller, $tarifas)) $errores[] = 'Taller inválido';
if ($sesiones === false || $sesiones === null || $sesiones < 1 || $sesiones > 10) $errores[] = 'Sesiones inválidas';
if ($errores) {
    foreach ($errores as $error) echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8') . '<br>';
} else {
    $precio = $tarifas[$taller];
    $importe = calcularImporte($precio, $sesiones);
    $descuento = calcularDescuento($importe, $sesiones);
    $total = calcularTotal($importe, $descuento);
    echo htmlspecialchars(trim($nombre), ENT_QUOTES, 'UTF-8') . '<br>';
    echo htmlspecialchars($taller, ENT_QUOTES, 'UTF-8') . '<br>';
    echo 'Importe: ' . number_format($importe, 2, ',', '.') . ' €<br>';
    echo 'Descuento: ' . number_format($descuento, 2, ',', '.') . ' €<br>';
    echo 'Total: ' . number_format($total, 2, ',', '.') . ' €';
}
