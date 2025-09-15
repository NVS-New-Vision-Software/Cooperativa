<?php
require 'conexion.php';
header('Content-Type: application/json');

$response = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Leer cuerpo JSON si viene desde fetch()
    $input = json_decode(file_get_contents("php://input"), true);

    // Si no viene por JSON, usar $_POST como fallback
    $nombre = $input['nombre'] ?? $_POST['nombre'] ?? '';
    $apellido = $input['apellido'] ?? $_POST['apellido'] ?? '';
    $email = $input['email'] ?? $_POST['email'] ?? '';
    $password_raw = $input['password'] ?? $_POST['password'] ?? '';

    if (!$nombre || !$apellido || !$email || !$password_raw) {
        http_response_code(400);
        echo json_encode(["error" => "Faltan campos obligatorios"]);
        exit;
    }

    $password = password_hash($password_raw, PASSWORD_DEFAULT);

    // Verificar si el email ya está registrado
    $check = $conn->prepare("SELECT IdPostulacion FROM postulaciones WHERE Email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        http_response_code(409); // conflicto
        echo json_encode(["error" => "Ya existe una postulación con ese correo"]);
        exit;
    }

    // Insertar postulación
    $sql = "INSERT INTO postulaciones (Pnom, Pape, Email, password) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $nombre, $apellido, $email, $password);

    if ($stmt->execute()) {
        echo json_encode(["status" => "ok"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error al registrar la postulación"]);
    }
} else {
    http_response_code(405); // método no permitido
    echo json_encode(["error" => "Método no permitido"]);
}
?>
