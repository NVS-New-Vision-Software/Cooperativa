<?php
$host = 'localhost';
$usuario = 'root';
$contraseña = ''; // Por defecto en XAMPP, sin contraseña
$base_datos = 'nvs_new_vision_software_';

$conn = new mysqli($host, $usuario, $contraseña, $base_datos);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Opcional: establecer codificación UTF-8
$conn->set_charset("utf8mb4");
?>

