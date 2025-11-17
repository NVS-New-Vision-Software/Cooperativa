<?php
require_once 'conexion.php';
header('Content-Type: application/json');

// Leer cuerpo JSON
$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id'] ?? null;
$estado = $input['estado'] ?? null;

if (!$id || !$estado) {
  http_response_code(400);
  echo json_encode(["error" => "Faltan datos"]);
  exit;
}

$sql = "UPDATE horastrabajo SET EstadoHoras = ? WHERE IdHoras = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $estado, $id);

if ($stmt->execute()) {
  echo json_encode(["status" => "ok"]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "Error al actualizar"]);
}

$stmt->close();
$conn->close();
?>
