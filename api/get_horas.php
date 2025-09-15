<?php
require 'conexion.php';
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403);
    echo json_encode(["error" => "Acceso denegado"]);
    exit;
}

$query = "
SELECT IdHoras, Email, FchaHoras, HoraInicio, HoraFin, Descripción, EstadoHoras
FROM horastrabajo
ORDER BY FchaHoras DESC
";

$result = $conn->query($query);
$horas = [];

while ($row = $result->fetch_assoc()) {
    $horas[] = $row;
}

echo json_encode($horas);
