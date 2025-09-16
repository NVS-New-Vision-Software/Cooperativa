<?php
session_start();
require 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $fecha = $_POST['fecha'];
  $monto = $_POST['monto'];
  $idUsuario = $_SESSION['IdUsuario'];
  $email = $_SESSION['Email'];
  $estado = 'pendiente';

  // Manejo del archivo
  $archivo = $_FILES['archivo'];
  $nombreArchivo = basename($archivo['name']);
  $rutaDestino = "uploads/" . $nombreArchivo;

  if (move_uploaded_file($archivo['tmp_name'], $rutaDestino)) {
    $sql = "INSERT INTO pago (IdUsuario, Email, FchaPago, Monto, Comprobante, EstadoPago)
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("issdss", $idUsuario, $email, $fecha, $monto, $nombreArchivo, $estado);

    if ($stmt->execute()) {
      echo "Pago registrado correctamente.";
    } else {
      echo "Error al registrar el pago.";
    }
  } else {
    echo "Error al subir el comprobante.";
  }
}
?>
