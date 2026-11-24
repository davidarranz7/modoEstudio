<?php
session_start();
$error = $_SESSION['error_login'] ?? '';
unset($_SESSION['error_login']);
?>
<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Acceso</title></head><body>
<?php if ($error): ?><p><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p><?php endif; ?>
<form method="post" action="validar.php">
    <label>Usuario <input name="usuario" required></label>
    <label>Contraseña <input name="password" type="password" required></label>
    <button type="submit">Entrar</button>
</form>
</body></html>
