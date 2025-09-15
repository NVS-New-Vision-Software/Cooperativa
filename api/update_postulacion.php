<?php
require 'conexion.php';
header('Content-Type: application/json');

// Verificar conexión
if (!$conn || $conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
    exit;
}

// Verificar método
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

// Leer cuerpo JSON
$input = json_decode(file_get_contents("php://input"), true);
$id = $input['id'] ?? null;
$estado = $input['estado'] ?? null;

if (!$id || !$estado) {
    http_response_code(400);
    echo json_encode(["error" => "Datos incompletos"]);
    exit;
}

if (!in_array($estado, ['aprobada', 'rechazada'])) {
    http_response_code(400);
    echo json_encode(["error" => "Estado inválido"]);
    exit;
}

// Si se aprueba, crear socio y usuario
if ($estado === 'aprobada') {
    $query = "SELECT Pnom, Pape, Email, password FROM postulaciones WHERE IdPostulacion = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => "Error en prepare SELECT: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $postulante = $result->fetch_assoc();

    if (!$postulante) {
        http_response_code(404);
        echo json_encode(["error" => "Postulante no encontrado"]);
        exit;
    }

    // Crear socio con fecha de nacimiento por defecto
    $fchaNac = '1900-01-01'; // Podés ajustar esto si capturás la fecha real en el futuro
    $crearSocio = $conn->prepare("INSERT INTO socio (PrimNom, PrimApe, FchaNac) VALUES (?, ?, ?)");
    if (!$crearSocio) {
        http_response_code(500);
        echo json_encode(["error" => "Error en prepare INSERT socio: " . $conn->error]);
        exit;
    }

    $crearSocio->bind_param("sss", $postulante['Pnom'], $postulante['Pape'], $fchaNac);
    if (!$crearSocio->execute()) {
        http_response_code(500);
        echo json_encode(["error" => "Error al insertar socio: " . $crearSocio->error]);
        exit;
    }

    $idSocio = $conn->insert_id;

    // Crear usuario vinculado al socio
    $insertUsuario = $conn->prepare("INSERT INTO usuario (PrimNom, PrimApe, IdSocio, Email, Contraseña, Rol) VALUES (?, ?, ?, ?, ?, 'socio')");
    if (!$insertUsuario) {
        http_response_code(500);
        echo json_encode(["error" => "Error en prepare INSERT usuario: " . $conn->error]);
        exit;
    }

    $insertUsuario->bind_param("ssiss", $postulante['Pnom'], $postulante['Pape'], $idSocio, $postulante['Email'], $postulante['password']);
    if (!$insertUsuario->execute()) {
        http_response_code(500);
        echo json_encode(["error" => "Error al insertar usuario: " . $insertUsuario->error]);
        exit;
    }
}

// Eliminar la postulación
$delete = $conn->prepare("DELETE FROM postulaciones WHERE IdPostulacion = ?");
if (!$delete) {
    http_response_code(500);
    echo json_encode(["error" => "Error en prepare DELETE: " . $conn->error]);
    exit;
}

$delete->bind_param("i", $id);
if ($delete->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al eliminar la postulación"]);
}
?>
