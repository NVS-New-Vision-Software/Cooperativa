<?php
// perfil/update.php
session_start();

if (!isset($_SESSION["usuario"])) {
  echo "<h3>No iniciaste sesión</h3>";
  exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $direccion = $_POST["direccion"] ?? '';
  $telefono = $_POST["telefono"] ?? '';
  $bio = $_POST["bio"] ?? '';

  echo "<h3>Datos simulados guardados:</h3>";
  echo "<ul>";
  echo "<li><strong>Dirección:</strong> " . htmlspecialchars($direccion) . "</li>";
  echo "<li><strong>Teléfono:</strong> " . htmlspecialchars($telefono) . "</li>";
  echo "<li><strong>Bio:</strong> " . htmlspecialchars($bio) . "</li>";
  echo "</ul>";
} else {
  echo "<h3>Acceso inválido</h3>";
}
?>
