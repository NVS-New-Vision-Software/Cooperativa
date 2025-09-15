<?php
require '../conexion.php';

$input = json_decode(file_get_contents("php://input"), true);
$nombre = $input['nombre'];
$apellido = $input['apellido'];
$email = $input['email'];
$password = password_hash($input['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO postulaciones (Pnom, Pape, Email, password) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $nombre, $apellido, $email, $password);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al registrar"]);
}
?>
