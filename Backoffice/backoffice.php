<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Panel de Gestión </title>
  <link rel="stylesheet" href="backoffice.css">
</head>
<body>

  <header>
    <h1>Backoffice Unión Buceo</h1>
    <form method="POST" action="/Cooperativa/Backoffice/logout.html">
      <button>Cerrar sesión</button>
    </form>
  </header>

  <main>
    <section class="section-box">
      <h2>Solicitudes de ingreso</h2>
      <p>Revisá las solicitudes de nuevos socios. Aceptá o denegá según los criterios de la cooperativa.</p>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Fecha de solicitud</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Laura Sánchez</td>
            <td>laura@ejemplo.com</td>
            <td>28/07/2025</td>
            <td>
              <form method="POST" action="aceptar.php" style="display:inline;">
                <input type="hidden" name="email" value="laura@ejemplo.com">
                <button>Aceptar</button>
              </form>
              <form method="POST" action="rechazar.php" style="display:inline;">
                <input type="hidden" name="email" value="laura@ejemplo.com">
                <button>Denegar</button>
              </form>
            </td>
          </tr>

          <tr>
            <td>Carlos Gómez</td>
            <td>carlos@ejemplo.com</td>
            <td>27/07/2025</td>
            <td>
              <form method="POST" action="aceptar.php" style="display:inline;">
                <input type="hidden" name="email" value="carlos@ejemplo.com">
                <button>Aceptar</button>
              </form>
              <form method="POST" action="rechazar.php" style="display:inline;">
                <input type="hidden" name="email" value="carlos@ejemplo.com">
                <button>Denegar</button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>

</body>
</html>
