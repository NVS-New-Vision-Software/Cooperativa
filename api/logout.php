<?php
session_start();

// 1. Elimina la cookie de sesión del navegador
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 2. Elimina todas las variables de sesión
session_unset(); 

// 3. Destruye la sesión
session_destroy(); 

// 4. Redirige (con código HTTP 302 temporal)
header("Location: ../Landing-page/index.html"); 
exit;
?>