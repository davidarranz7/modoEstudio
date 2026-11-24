<?php require_once __DIR__ . '/tarifas.php'; ?>
<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Talleres</title></head><body>
<form method="post" action="procesar.php">
    <label>Nombre <input name="nombre" required></label>
    <label>Taller<select name="taller">
        <?php foreach ($tarifas as $nombreTaller => $precio): ?>
            <option value="<?= htmlspecialchars($nombreTaller, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($nombreTaller, ENT_QUOTES, 'UTF-8') ?> — <?= number_format($precio, 2, ',', '.') ?> €/sesión</option>
        <?php endforeach; ?>
    </select></label>
    <label>Sesiones <input type="number" name="sesiones" min="1" max="10" required></label>
    <button type="submit">Calcular</button>
</form>
</body></html>
