<?php
$errores = [];
$nombre = $_POST['nombre'] ?? '';
$sesiones = filter_input(INPUT_POST, 'sesiones', FILTER_VALIDATE_INT);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!is_string($nombre) || trim($nombre) === '') {
        $errores[] = 'El nombre es obligatorio';
    }
    if ($sesiones === false || $sesiones === null || $sesiones < 1 || $sesiones > 10) {
        $errores[] = 'Sesiones: entero entre 1 y 10';
    }
}
?>
<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Inscripción</title></head><body>
<form method="post" action="">
    <label>Nombre <input name="nombre" required></label>
    <label>Sesiones <input type="number" name="sesiones" min="1" max="10" required></label>
    <button type="submit">Enviar</button>
</form>
<?php foreach ($errores as $error): ?>
    <p><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
<?php endforeach; ?>
</body></html>
