<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"));
$postulacionId = $data->id;

$sql = "UPDATE postulaciones SET estado = 'rechazada' WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $postulacionId);

if ($stmt->execute()) {
    echo json_encode(["message" => "Postulación rechazada"]);
} else {
    echo json_encode(["error" => "Error al rechazar postulación"]);
}
?>
