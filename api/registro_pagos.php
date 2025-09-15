<?php
require 'conexion.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(["error" => "No autenticado"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

$fecha = $_POST['fecha'] ?? null;
$monto = $_POST['monto'] ?? null;
$archivo = $_FILES['archivo'] ?? null;

if (!$fecha || !$monto || !$archivo) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan datos"]);
    exit;
}

// Guardar archivo
$nombre = uniqid() . ".pdf";
$ruta = "../comprobantes/" . $nombre;
if (!move_uploaded_file($archivo['tmp_name'], $ruta)) {
    http_response_code(500);
    echo json_encode(["error" => "Error al subir el comprobante"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO pago (IdUsuario, FchaPago, Monto, Comprobante, EstadoPago) VALUES (?, ?, ?, ?, 'pendiente')");
$stmt->bind_param("isds", $_SESSION['id'], $fecha, $monto, $nombre);
$stmt->execute();

echo json_encode(["status" => "ok", "archivo" => $nombre]);
