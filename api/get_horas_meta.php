<?php
// En: ../api/get_horas_meta.php

header('Content-Type: application/json');
require_once 'conexion.php'; 

session_start();

// 1. Verificar sesión y obtener IdUsuario
if (!isset($_SESSION['id']) || empty($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado.']);
    exit;
}

$id_usuario = $_SESSION['id'];

try {
    // 2. Obtener la configuración global de Horas Requeridas
    $stmt_config = $conn->prepare("SELECT HorasRequeridas FROM config_metas LIMIT 1");
    $stmt_config->execute();
    $result_config = $stmt_config->get_result();
    $config = $result_config->fetch_assoc();
    $stmt_config->close();

    $horas_req = $config['HorasRequeridas'] ?? 0;
    
    // 3. Calcular la suma de Horas Registradas (solo 'aprobado')
    // El cálculo de la diferencia de tiempo es complejo en SQL. Usaremos TIME_TO_SEC() para sumar en segundos.
    $stmt_horas = $conn->prepare("
        SELECT 
            SUM(TIME_TO_SEC(TIMEDIFF(HoraFin, HoraInicio))) AS SegundosRegistrados
        FROM horastrabajo
        WHERE IdUsuario = ? AND EstadoHoras = 'aprobado'
    ");
    
    $stmt_horas->bind_param("i", $id_usuario);
    $stmt_horas->execute();
    $result_horas = $stmt_horas->get_result();
    $data_horas = $result_horas->fetch_assoc();
    $stmt_horas->close();

    // Convertir segundos a horas (3600 segundos/hora) y redondear a 2 decimales
    $segundos_registrados = (int)($data_horas['SegundosRegistrados'] ?? 0);
    $horas_registradas = round($segundos_registrados / 3600, 2); 
    
    // 4. Calcular las Horas Restantes
    $horas_restantes = max(0, $horas_req - $horas_registradas);

    // 5. Devolver el resultado
    echo json_encode([
        'status' => 'ok',
        'data' => [
            'horas_requeridas' => (float)$horas_req,
            'horas_registradas' => (float)$horas_registradas,
            'horas_restantes' => (float)$horas_restantes
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>