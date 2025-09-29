<?php
require_once 'conexion.php';
session_start();
header('Content-Type: application/json');

// Validar sesión de administrador
if (!isset($_SESSION['Rol']) || $_SESSION['Rol'] !== 'admin') {
  http_response_code(403);
  echo json_encode(["error" => "Acceso denegado"]);
  exit;
}

// Leer cuerpo JSON
$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id'] ?? null;
$estado = $input['estado'] ?? null;

if (!$id || !$estado) {
  http_response_code(400);
  echo json_encode(["error" => "Faltan datos"]);
  exit;
}

// Validar estado permitido
$estadosPermitidos = ['aprobado', 'rechazado'];
if (!in_array($estado, $estadosPermitidos)) {
  http_response_code(400);
  echo json_encode(["error" => "Estado inválido"]);
  exit;
}

// Actualizar estado del pago
$sql = "UPDATE pago SET EstadoPago = ? WHERE IdPago = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $estado, $id);

if ($stmt->execute()) {
  echo json_encode(["status" => "ok"]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "Error al actualizar el estado"]);
}

$stmt->close();
$conn->close();
?>
