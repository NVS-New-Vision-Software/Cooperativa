<?php
require_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $idHoras = $_POST['id'];
  $estado = $_POST['estado']; // 'aprobado' o 'rechazado'

  $sql = "UPDATE horastrabajo SET EstadoHoras = ? WHERE IdHoras = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("si", $estado, $idHoras);

  echo $stmt->execute() ? "actualizado" : "error";
  $stmt->close();
  $conn->close();
}
?>
