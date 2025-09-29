<?php
require_once 'conexion.php';

$sql = "SELECT IdHoras, Email, FchaHoras, HoraInicio, HoraFin, Descripción, EstadoHoras FROM horastrabajo ORDER BY FchaHoras DESC";
$result = $conn->query($sql);

$datos = [];
while ($row = $result->fetch_assoc()) {
  $datos[] = $row;
}

header('Content-Type: application/json');
echo json_encode($datos);
?>
