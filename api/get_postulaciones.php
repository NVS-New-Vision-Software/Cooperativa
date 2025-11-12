<?php
include 'conexion.php'; 
header('Content-Type: application/json');

$sql = "SELECT IdPostulacion, Pnom, Pape, Email, estado, FchaSolicitud FROM postulaciones  WHERE estado = 'pendiente' ORDER BY FchaSolicitud DESC";
$result = $conn->query($sql);

$postulaciones = [];

while ($row = $result->fetch_assoc()) {
    $postulaciones[] = $row;
}

echo json_encode($postulaciones);
?>
