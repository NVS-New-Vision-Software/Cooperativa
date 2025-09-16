<?php
session_start();
require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $fecha = $_POST['fecha'];
  $horaInicio = $_POST['horaInicio'];
  $horaFin = $_POST['horaFin'];
  $descripcion = $_POST['descripcion'];

  // Suponiendo que el usuario está logueado y su ID y email están en sesión
  $idUsuario = $_SESSION['IdUsuario'];
  $email = $_SESSION['Email'];

  $estado = 'pendiente'; // o 'registrado', según tu lógica

  $sql = "INSERT INTO horastrabajo (IdUsuario, Email, FchaHoras, HoraInicio, HoraFin, Descripción, EstadoHoras)
          VALUES (?, ?, ?, ?, ?, ?, ?)";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("issssss", $idUsuario, $email, $fecha, $horaInicio, $horaFin, $descripcion, $estado);

  if ($stmt->execute()) {
    echo "Horas registradas correctamente.";
  } else {
    echo "Error al registrar horas.";
  }
}
?>
