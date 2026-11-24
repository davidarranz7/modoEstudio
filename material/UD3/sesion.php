<?php
session_start();
$_SESSION['visitas'] = ($_SESSION['visitas'] ?? 0) + 1;
echo 'Visitas en esta sesión: ' . $_SESSION['visitas'];
