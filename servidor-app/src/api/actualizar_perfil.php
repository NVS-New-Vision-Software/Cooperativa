<?php
// En: ../api/actualizar_perfil.php

header('Content-Type: application/json');
require_once 'conexion.php'; // Asegúrate de que esta ruta es correcta

session_start();

// 1. Verificar sesión y obtener IdUsuario
if (!isset($_SESSION['id']) || empty($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado.']);
    exit;
}

$id_usuario = $_SESSION['id'];

// Obtener datos POST del formulario
$cedula = $_POST['cedula'] ?? null;
$fecha_nac = $_POST['fecha'] ?? null; // Corresponde a FchaNac

if (!$cedula || !$fecha_nac) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Faltan datos requeridos (Cédula o Fecha de Nacimiento).']);
    exit;
}

try {
    // 2. Paso intermedio: Obtener el IdSocio del usuario logueado
    $stmt_socio = $conn->prepare("SELECT IdSocio FROM usuario WHERE IdUsuario = ?");
    $stmt_socio->bind_param("i", $id_usuario);
    $stmt_socio->execute();
    $result_socio = $stmt_socio->get_result();
    $socio_data = $result_socio->fetch_assoc();
    $stmt_socio->close();

    if (!$socio_data) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Socio no asociado al usuario.']);
        exit;
    }
    
    $id_socio = $socio_data['IdSocio'];

    // 3. Query para actualizar los campos CI y FchaNac en la tabla 'socio'
    $stmt = $conn->prepare("
        UPDATE socio 
        SET CI = ?, FchaNac = ? 
        WHERE IdSocio = ?
    ");
    
    // Parámetros: s (cedula), s (fecha_nac), i (id_socio)
    $stmt->bind_param("ssi", $cedula, $fecha_nac, $id_socio);
    
    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'ok', 'message' => 'Perfil actualizado exitosamente.']);
        } else {
            echo json_encode(['status' => 'ok', 'message' => 'No se detectaron cambios en el perfil.']);
        }
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Error al ejecutar la actualización: ' . $stmt->error]);
    }
    
    $stmt->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>