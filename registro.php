<?php
session_start();

if (!isset($_SESSION["usuario"])) {
  header("Location: login.php");
  exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $direccion = $_POST["direccion"] ?? '';
  $telefono = $_POST["telefono"] ?? '';
  $bio = $_POST["bio"] ?? '';

  $mensaje = "<h3>✅ Datos simulados guardados</h3>
              <ul>
                <li><strong>Dirección:</strong> " . htmlspecialchars($direccion) . "</li>
                <li><strong>Teléfono:</strong> " . htmlspecialchars($telefono) . "</li>
                <li><strong>Bio:</strong> " . htmlspecialchars($bio) . "</li>
              </ul>";
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Registro de Datos Personales</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h2>Registro de datos de <?= htmlspecialchars($_SESSION["usuario"]) ?></h2>

  <?php if (isset($mensaje)) echo $mensaje; ?>

  <form method="POST">
    <input type="text" name="direccion" placeholder="Dirección">
    <input type="text" name="telefono" placeholder="Teléfono">
    <textarea name="bio" placeholder="Descripción personal"></textarea>
    <button type="submit">Guardar datos</button>
  </form>

  <form method="POST" action="logout.php">
    <button type="submit">Cerrar sesión</button>
  </form>
</body>
</html>
