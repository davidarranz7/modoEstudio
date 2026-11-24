<?php
require_once __DIR__ . '/usuarios.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: login.php');
    exit;
}
$username = $_POST['usuario'] ?? null;
$password = $_POST['password'] ?? null;
if (!is_string($username) || !is_string($password)) {
    header('Location: login.php');
    exit;
}
$usuario = getUsuarioByUserName($username);
session_start();
if ($usuario !== null && password_verify($password, $usuario['password'])) {
    session_regenerate_id(true);
    $_SESSION['id_usuario'] = $usuario['id'];
    $_SESSION['usuario'] = $usuario['usuario'];
    header('Location: privada.php');
    exit;
}
$_SESSION['error_login'] = 'Usuario o contraseña incorrectos.';
header('Location: login.php');
exit;
