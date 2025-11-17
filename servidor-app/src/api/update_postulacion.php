<?php
require 'conexion.php';
header('Content-Type: application/json');
session_start(); // Necesario para verificar roles en la sección de actualización

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

// Leer cuerpo JSON
$input = json_decode(file_get_contents("php://input"), true);
if (empty($input)) {
    http_response_code(400);
    echo json_encode(["error" => "Datos de entrada vacíos"]);
    exit;
}

// ===================================================================
// === 1. Lógica de Actualización de Estado (Aprobar/Rechazar) ===
// Identificador: Si recibe 'id' y 'estado', asumimos que es una acción de administración.
// ===================================================================
if (isset($input['id']) && isset($input['estado'])) {
    
    $idPostulacion = $input['id'];
    $nuevoEstado = $input['estado'];

    // Opcional: Verificar rol de administrador
    if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
         // Puedes ajustar 'admin' al valor real de tu rol de administrador
         http_response_code(403);
         echo json_encode(["error" => "Permiso denegado para actualizar estado."]);
         exit;
    }

    // Validar datos de estado
    if (!is_numeric($idPostulacion) || !in_array($nuevoEstado, ['aprobada', 'rechazada'])) {
        http_response_code(400);
        echo json_encode(["error" => "Datos de actualización de estado inválidos."]);
        exit;
    }

    // Si se aprueba, insertar el usuario en la tabla 'usuario'
    if ($nuevoEstado === 'aprobada') {
        
        // 0. Obtener los datos necesarios de la postulación
        // NOTA: Eliminamos FchaNac del SELECT porque no existe en 'postulaciones'
        $sql_datos = "SELECT Email, password, Pnom, Pape FROM postulaciones WHERE IdPostulacion = ?";
        $stmt_datos = $conn->prepare($sql_datos);
        $stmt_datos->bind_param("i", $idPostulacion);
        $stmt_datos->execute();
        $resultado = $stmt_datos->get_result();
        $datos_postulacion = $resultado->fetch_assoc();
        $stmt_datos->close();
        
        if (!$datos_postulacion) {
            http_response_code(404);
            echo json_encode(["error" => "Postulación no encontrada para la transferencia."]);
            $conn->close();
            exit;
        }

        // --- PASO 1: INSERTAR EN LA TABLA SOCIO (Resuelve FK y NOT NULL de FchaNac) ---
        // Usamos una fecha por defecto ('1900-01-01') para FchaNac.
        $sql_socio = "INSERT INTO socio (IdSocio, PrimNom, PrimApe, FchaNac, FchaIngreso) 
                      VALUES (?, ?, ?, '1900-01-01', NOW())";
        $stmt_socio = $conn->prepare($sql_socio);

        // 'iss' -> integer (IdPostulacion), string (Pnom), string (Pape)
        $stmt_socio->bind_param("iss", 
            $idPostulacion, 
            $datos_postulacion['Pnom'], 
            $datos_postulacion['Pape']
        );

        if (!$stmt_socio->execute()) {
            $mysql_error = $stmt_socio->error;
            http_response_code(500);
            echo json_encode([
                "error" => "Error al crear el registro de socio.",
                "detalles_db" => $mysql_error
            ]);
            $stmt_socio->close();
            $conn->close();
            exit;
        }
        $stmt_socio->close();

        // --- PASO 2: INSERTAR EN LA TABLA USUARIO ---
        $sql_usuario = "INSERT INTO usuario (PrimNom, PrimApe, IdSocio, Email, Contraseña, Rol) 
                        VALUES (?, ?, ?, ?, ?, 'socio')";
        $stmt_usuario = $conn->prepare($sql_usuario);
        
        // 'ssiss' -> string, string, integer, string, string
        $stmt_usuario->bind_param("ssiss", 
            $datos_postulacion['Pnom'], 
            $datos_postulacion['Pape'], 
            $idPostulacion, // IdSocio que ahora existe en la tabla socio
            $datos_postulacion['Email'], 
            $datos_postulacion['password']
        );

        if (!$stmt_usuario->execute()) {
            $mysql_error = $stmt_usuario->error;
            http_response_code(500);
            echo json_encode([
                "error" => "Error al crear el registro de usuario.",
                "detalles_db" => $mysql_error
            ]);
            $stmt_usuario->close();
            $conn->close();
            exit;
        }
        $stmt_usuario->close();
    }

    // Actualizar el estado en la tabla 'postulaciones'
    $sql_update = "UPDATE postulaciones SET estado = ? WHERE IdPostulacion = ?";
    $stmt_update = $conn->prepare($sql_update);
    $stmt_update->bind_param("si", $nuevoEstado, $idPostulacion);

    if ($stmt_update->execute()) {
        echo json_encode(["status" => "ok"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error al actualizar el estado de la postulación en DB."]);
    }

    $stmt_update->close();
    $conn->close();
    exit; // Termina la ejecución después de la actualización de estado.
}

// ===================================================================
// === 2. Lógica de Registro Inicial (Insertar Postulación) ===
// Si llega aquí, es porque no recibió 'id'/'estado', por lo que asume registro.
// ===================================================================

$nombre = $input['nombre'] ?? '';
$apellido = $input['apellido'] ?? '';
$email = $input['email'] ?? '';
$password_raw = $input['password'] ?? '';

// Error 400: Faltan campos de registro
if (!$nombre || !$apellido || !$email || !$password_raw) {
    http_response_code(400);
    echo json_encode(["error" => "Faltan campos obligatorios para el registro"]);
    exit;
}

$password = password_hash($password_raw, PASSWORD_DEFAULT);

// Verificar si el email ya está registrado
$check = $conn->prepare("SELECT IdPostulacion FROM postulaciones WHERE Email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    http_response_code(409); // Conflicto
    echo json_encode(["error" => "Ya existe una postulación con ese correo"]);
    exit;
}

// Insertar postulación
$sql = "INSERT INTO postulaciones (Pnom, Pape, Email, password) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $nombre, $apellido, $email, $password);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Error al registrar la postulación"]);
}

$stmt->close();
$conn->close();
?>