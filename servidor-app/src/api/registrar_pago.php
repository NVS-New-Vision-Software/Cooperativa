<?php
require_once 'conexion.php';
session_start();
header('Content-Type: application/json');


$IdUsuario = $_SESSION['id'];
$Email = $_SESSION['email'];

// Validar campos
$fecha = $_POST['fecha'] ?? null;
$monto = $_POST['monto'] ?? null;
$archivo = $_FILES['archivo'] ?? null;

if (!$fecha || !$monto || !$archivo) {
  http_response_code(400);
  echo json_encode(["error" => "Faltan datos"]);
  exit;
}

// Validar archivo PDF
if ($archivo['type'] !== 'application/pdf') {
  http_response_code(400);
  echo json_encode(["error" => "El archivo debe ser PDF"]);
  exit;
}

// Guardar archivo
$nombreArchivo = uniqid('pago_') . '.pdf';
$rutaDestino = '../Backoffice/comprobantes/' . $nombreArchivo;

if (!move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
  http_response_code(500);
  echo json_encode(["error" => "Error al guardar el archivo"]);
  exit;
}

// Insertar en la base de datos
$sql = "INSERT INTO pago (IdUsuario, Email, FchaPago, Monto, Comprobante, EstadoPago)
        VALUES (?, ?, ?, ?, ?, 'pendiente')";
$stmt = $conn->prepare($sql);
$stmt->bind_param("issds", $IdUsuario, $Email, $fecha, $monto, $nombreArchivo);

if ($stmt->execute()) {
  echo json_encode(["status" => "ok"]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "Error al registrar el pago"]);
}

$stmt->close();
$conn->close();
?>
