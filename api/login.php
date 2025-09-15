<?php
session_start();
require 'conexion.php';

$input = json_decode(file_get_contents("php://input"), true);
$email = $input['email'];
$password = $input['password'];

$sql = "SELECT * FROM usuario WHERE Email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    if (password_verify($password, $user['Contraseña'])) {
        $_SESSION['usuario_id'] = $user['IdUsuario'];
        echo json_encode(["usuario_id" => $user['IdUsuario']]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Contraseña incorrecta"]);
    }
} else {
    http_response_code(404);
    echo json_encode(["error" => "Usuario no encontrado"]);
}
?>

