<?php
require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'];
    $apellido = $_POST['apellido'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Verificar si el email ya está registrado
    $check = $conn->prepare("SELECT IdPostulacion FROM postulaciones WHERE Email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo "Ya existe una postulación con ese correo.";
    } else {
        $sql = "INSERT INTO postulaciones (Pnom, Pape, Email, password) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $nombre, $apellido, $email, $password);

        if ($stmt->execute()) {
            echo "Postulación enviada correctamente.";
        } else {
            echo "Error al registrar la postulación.";
        }
    }
}
?>
