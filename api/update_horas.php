<?php
require 'conexion.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "Acceso denegado"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id'] ?? null;
$estado = $input['estado'] ?? null;

if (!$id || !in_array($estado, ['aprobado', 'rechazado'])) {
    http_response_code(400);
    echo json_encode(["error" => "Datos inválidos"]);
    exit;
}

$stmt = $conn->prepare("UPDATE horastrabajo SET EstadoHoras = ? WHERE IdHoras = ?");
$stmt->bind_param("si", $estado, $id);
$stmt->execute();

echo json_encode(["status" => "ok"]);
?>