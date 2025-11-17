<?php
require_once 'conexion.php';
session_start();
header('Content-Type: application/json');

// Validar sesión
$idUsuario = $_SESSION['id'] ?? null;
$email = $_SESSION['email'] ?? null;

if (!$idUsuario || !$email) {
    http_response_code(401);
    echo json_encode(["error" => "Sesión no válida"]);
    exit;
}

// Leer cuerpo JSON
$input = json_decode(file_get_contents("php://input"), true);
$fecha = $input['fecha'] ?? null;
$horaInicio = $input['horaInicio'] ?? null;
$horaFin = $input['horaFin'] ?? null;
$descripcion = $input['descripcion'] ?? null;

// Validar datos
if (!$fecha || !$horaInicio || !$horaFin || !$descripcion) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

// Insertar en la base
$sql = "INSERT INTO horastrabajo (IdUsuario, Email, FchaHoras, HoraInicio, HoraFin, Descripción, EstadoHoras)
        VALUES (?, ?, ?, ?, ?, ?, 'pendiente')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isssss", $idUsuario, $email, $fecha, $horaInicio, $horaFin, $descripcion);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al registrar horas"]);
}

$stmt->close();
$conn->close();
?>
