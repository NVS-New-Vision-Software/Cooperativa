<?php
require_once 'conexion.php';
session_start();
header('Content-Type: application/json');


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
