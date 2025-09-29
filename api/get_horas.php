<?php
require_once 'conexion.php';

$sql = "SELECT IdHoras, Email, FchaHoras, HoraInicio, HoraFin, Descripción, EstadoHoras
        FROM horastrabajo
        WHERE EstadoHoras = 'pendiente'
        ORDER BY FchaHoras DESC";

$result = $conn->query($sql);
$horas = [];

while ($row = $result->fetch_assoc()) {
  $horas[] = $row;
}

header('Content-Type: application/json');
echo json_encode($horas);
?>
