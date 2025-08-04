<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $email = $_POST["email"] ?? '';
  $password = $_POST["password"] ?? '';

  if ($password === "123456") {
    $_SESSION["usuario"] = $email;

    if ($email === "admin@gmail.com") {
      $_SESSION["rol"] = "coordinador";
    header("Location: /Cooperativa/Backoffice/backoffice.html");

    } elseif ($email === "socio@gmail.com") {
      $_SESSION["rol"] = "socio";
      header("Location: registro.php");
    }    
    exit;
  } else {
    $error = "Credenciales incorrectas";
  }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h2>Iniciar sesión</h2>
  <?php if (isset($error)) echo "<p style='color:red;'>$error</p>"; ?>
  <form method="POST">
    <input type="email" name="email" placeholder="Correo electrónico" required>
    <input type="password" name="password" placeholder="Contraseña" required>
    <button type="submit">Ingresar</button>
  </form>
</body>
</html>
