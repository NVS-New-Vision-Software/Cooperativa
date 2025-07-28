<?php
// approve-user.php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $user_id = $_POST["user_id"] ?? '';

  // Aquí actualizarías el campo "aprobado" en la base de datos
  echo "<h3>Usuario aprobado (simulado): ID $user_id</h3>";
} else {
  echo "<h3>Acceso inválido</h3>";
}
?>
