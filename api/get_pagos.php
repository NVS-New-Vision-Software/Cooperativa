<?php
require 'conexion.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "Acceso denegado"]);
    exit;
}

$query = "SELECT IdPago, Email, FchaPago, Monto, Comprobante, EstadoPago
FROM pago
ORDER BY FchaPago DESC
";

$result = $conn->query($query);
$pagos = [];

while ($row = $result->fetch_assoc()) {
    $pagos[] = $row;
}

echo json_encode($pagos);
