<?php
require_once 'conexion.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $idUsuario = $_SESSION['IdUsuario']; // Asegúrate de que se setea en login
  $email = $_SESSION['Email'];
  $fecha = $_POST['fecha'];
  $horaInicio = $_POST['horaInicio'];
  $horaFin = $_POST['horaFin'];
  $descripcion = $_POST['descripcion'];

  $sql = "INSERT INTO horastrabajo (IdUsuario, Email, FchaHoras, HoraInicio, HoraFin, Descripción, EstadoHoras)
          VALUES (?, ?, ?, ?, ?, ?, 'pendiente')";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("isssss", $idUsuario, $email, $fecha, $horaInicio, $horaFin, $descripcion);

  echo $stmt->execute() ? "ok" : "error";
  $stmt->close();
  $conn->close();
}
?>
