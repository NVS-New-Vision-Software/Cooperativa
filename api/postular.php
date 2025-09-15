<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"));

$PrimNom = $data->PrimNom;
$PrimApe = $data->PrimApe;
$FchaNac = $data->FchaNac;
$Email = $data->Email ?? null;
$Contraseña = isset($data->Contraseña) ? password_hash($data->Contraseña, PASSWORD_DEFAULT) : null;

$sql = "INSERT INTO postulaciones (PrimNom, PrimApe, FchaNac, Email, Contraseña, estado, created_at)
        VALUES (?, ?, ?, ?, ?, 'pendiente', NOW())";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $PrimNom, $PrimApe, $FchaNac, $Email, $Contraseña);

if ($stmt->execute()) {
    echo json_encode(["message" => "Tu postulación fue enviada, espera aprobación"]);
} else {
    echo json_encode(["error" => "Error en la postulación"]);
}
?>
