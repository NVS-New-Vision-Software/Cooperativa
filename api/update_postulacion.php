<?php
require 'conexion.php';

$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id'];
$estado = $input['estado'];

if (!in_array($estado, ['aprobada', 'rechazada'])) {
    http_response_code(400);
    echo json_encode(["error" => "Estado inválido"]);
    exit;
}

// Si se aprueba, primero obtener datos del postulante
if ($estado === 'aprobada') {
    $sql = "SELECT Pnom, Pape, Email, password FROM postulaciones WHERE IdPostulacion = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $postulante = $res->fetch_assoc();

    // Insertar en tabla usuario
    $sql = "INSERT INTO usuario (PrimNom, PrimApe, IdSocio, Email, Contraseña, Rol) VALUES (?, ?, 0, ?, ?, 'socio')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $postulante['Pnom'], $postulante['Pape'], $postulante['Email'], $postulante['password']);
    $stmt->execute();
}

// Eliminar la postulación
$sql = "DELETE FROM postulaciones WHERE IdPostulacion = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["status" => "ok"]);
?>
