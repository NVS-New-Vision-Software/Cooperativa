<?php
require 'conexion.php';
header('Content-Type: application/json');
session_start();

// Leer cuerpo JSON
$input = json_decode(file_get_contents("php://input"), true);
$email = $input['email'] ?? null;
$password = $input['password'] ?? null;

// Validar entrada
if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Email y contraseña requeridos"]);
    exit;
}

// Buscar usuario por email
$query = "SELECT IdUsuario, Contraseña, Rol FROM usuario WHERE Email = ?";
$stmt = $conn->prepare($query);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Error en prepare: " . $conn->error]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Verificar credenciales
if (!$user || !password_verify($password, $user['Contraseña'])) {
    http_response_code(401);
    echo json_encode(["error" => "Credenciales inválidas"]);
    exit;
}

// Guardar sesión
$_SESSION['id'] = $user['IdUsuario'];
$_SESSION['rol'] = $user['Rol'];

echo json_encode(["status" => "ok", "rol" => $user['Rol']]);
?>