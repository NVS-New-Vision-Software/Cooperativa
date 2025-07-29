<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $Id_Usuario = $_POST["user_id"] ?? '';

  echo "<h3>Usuario aprobado (simulado): ID $Id_Usuario</h3>";
} else {
  echo "<h3>Acceso inválido</h3>";
}
?>
