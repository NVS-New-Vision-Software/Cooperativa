<?php
require 'conexion.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id'])) {
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

// Calcular cantidad de horas
$inicio_dt = DateTime::createFromFormat('H:i', $inicio);
$fin_dt = DateTime::createFromFormat('H:i', $fin);
$cantHoras = ($inicio_dt && $fin_dt) ? ($fin_dt->getTimestamp() - $inicio_dt->getTimestamp()) / 3600 : 0;

if ($cantHoras <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "La hora de fin debe ser posterior a la de inicio"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO horastrabajo (IdUsuario, CantHoras, FchaHoras, EstadoHoras) VALUES (?, ?, ?, 'pendiente')");
$stmt->bind_param("ids", $_SESSION['id'], $cantHoras, $fecha);
$stmt->execute();

echo json_encode(["status" => "ok", "horas" => $cantHoras]);
