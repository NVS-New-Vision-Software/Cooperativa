<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"));
$postulacionId = $data->id;

// 1. Buscar postulante pendiente
$sql = "SELECT * FROM postulaciones WHERE id = ? AND estado = 'pendiente'";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $postulacionId);
$stmt->execute();
$result = $stmt->get_result();
$postulante = $result->fetch_assoc();

if (!$postulante) {
    echo json_encode(["error" => "Postulación no encontrada o ya procesada"]);
    exit;
}

// 2. Insertar en Socio
$sqlInsertSocio = "INSERT INTO Socio (PrimNom, PrimApe, FchaNac, FchaIngreso)
                   VALUES (?, ?, ?, NOW())";
$stmtInsertSocio = $conn->prepare($sqlInsertSocio);
$stmtInsertSocio->bind_param("sss", $postulante['PrimNom'], $postulante['PrimApe'], $postulante['FchaNac']);
$stmtInsertSocio->execute();
$IdSocio = $conn->insert_id;

// 3. Insertar en Usuario (rol usuario)
$sqlInsertUsuario = "INSERT INTO Usuario (PrimNom, PrimApe, IdSocio, Email, Contraseña, Rol, FchaIngreso)
                     VALUES (?, ?, ?, ?, ?, 'usuario', NOW())";
$stmtInsertUsuario = $conn->prepare($sqlInsertUsuario);
$stmtInsertUsuario->bind_param(
    "ssiss",
    $postulante['PrimNom'],
    $postulante['PrimApe'],
    $IdSocio,
    $postulante['Email'],
    $postulante['Contraseña']
);
$stmtInsertUsuario->execute();

// 4. Actualizar estado de la postulación
$sqlUpdate = "UPDATE postulaciones SET estado = 'aprobada' WHERE id = ?";
$stmtUpdate = $conn->prepare($sqlUpdate);
$stmtUpdate->bind_param("i", $postulacionId);
$stmtUpdate->execute();

echo json_encode(["message" => "Postulación aprobada, socio y usuario creados"]);
?>
