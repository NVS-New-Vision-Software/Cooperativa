<?php
// En: ../api/reiniciar_progreso_global.php

header('Content-Type: application/json');
require_once 'conexion.php'; 

session_start();

// 1. Verificar Autenticación y Rol
if (!isset($_SESSION['id']) || empty($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado.']);
    exit;
}

if ($_SESSION['rol'] !== 'admin') { 
    // ASEGÚRATE de que el nombre de tu rol de admin sea correcto
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Acceso denegado. Solo administradores pueden ejecutar el reinicio global.']);
    exit;
}

try {
    // 2. Ejecutar el reinicio: Actualiza FchaCorteGlobal a la fecha actual
    $stmt = $conn->prepare("UPDATE config_metas SET FchaCorteGlobal = CURDATE() WHERE IdConfig = 1");
    // Asumo que IdConfig=1 es el único registro, ya que usas LIMIT 1 en otras consultas
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'ok', 'message' => "Reinicio global completado. El progreso de todos los usuarios cuenta desde hoy."]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Error al actualizar la tabla de configuración.']);
    }
    
    $stmt->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>