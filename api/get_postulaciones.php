<?php
require 'conexion.php';

$sql = "SELECT IdPostulacion, Pnom, Pape, Email, estado, FchaSolicitud FROM postulaciones ORDER BY FchaSolicitud DESC";
$result = $conn->query($sql);

$postulaciones = [];

while ($row = $result->fetch_assoc()) {
    $postulaciones[] = $row;
}

echo json_encode($postulaciones);
?>
