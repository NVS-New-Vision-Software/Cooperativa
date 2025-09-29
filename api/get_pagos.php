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

$sql = "SELECT IdPago, Email, FchaPago, Monto, Comprobante, EstadoPago 
        FROM pago 
        WHERE EstadoPago = 'pendiente'
        ORDER BY FchaPago DESC";

$result = $conn->query($sql);
$pagos = [];

while ($row = $result->fetch_assoc()) {
  $pagos[] = $row;
}

echo json_encode($pagos);
$conn->close();
?>
