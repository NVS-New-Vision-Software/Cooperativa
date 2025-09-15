<?php
require 'conexion.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id']) || !isset($_SESSION['email'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);
$fecha = $input['fecha'] ?? null;
$inicio = $input['horaInicio'] ?? null;
$fin = $input['horaFin'] ?? null;
$descripcion = $input['descripcion'] ?? null;

if (!$fecha || !$inicio || !$fin || !$descripcion) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

$stmt = $conn->prepare("
  INSERT INTO horastrabajo (IdUsuario, Email, FchaHoras, HoraInicio, HoraFin, Descripción, EstadoHoras)
  VALUES (?, ?, ?, ?, ?, ?, 'pendiente')
");
$stmt->bind_param("isssss", $_SESSION['id'], $_SESSION['email'], $fecha, $inicio, $fin, $descripcion);
$stmt->execute();

echo json_encode(["status" => "ok"]);
