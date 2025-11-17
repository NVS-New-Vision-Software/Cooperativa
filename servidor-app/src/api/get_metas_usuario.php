<?php
// En: ../api/get_metas_usuario.php (CORREGIDO GLOBAL)

header('Content-Type: application/json');
require_once 'conexion.php'; 

session_start();

// 1. Verificar sesión y obtener IdUsuario
// ... (código de verificación omitido por concisión, mantener el original) ...
if (!isset($_SESSION['id']) || empty($_SESSION['id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Usuario no autenticado.']);
    exit;
}
$id_usuario = $_SESSION['id'];

try {
    // === 2. METAS REQUERIDAS Y FECHA DE CORTE (config_metas) ===
    $stmt_config = $conn->prepare("SELECT HorasRequeridas, MontoPagar, FchaCorteGlobal FROM config_metas LIMIT 1");
    $stmt_config->execute();
    $result_config = $stmt_config->get_result();
    $config = $result_config->fetch_assoc();
    $stmt_config->close();

    $monto_req = $config['MontoPagar'] ?? 0;
    $horas_req = $config['HorasRequeridas'] ?? 0;
    $fecha_corte = $config['FchaCorteGlobal'] ?? '1900-01-01'; // Obtener la fecha de corte global
    
    // ======================================================
    // === 3. PROGRESO DE PAGO (Aplicando Corte Global) ===
    // ======================================================
    $stmt_pago = $conn->prepare("
        SELECT 
            SUM(Monto) AS MontoPagado
        FROM pago
        WHERE IdUsuario = ? 
          AND EstadoPago = 'aprobado'
          AND FchaPago >= ?  -- APLICAMOS LA FECHA DE CORTE GLOBAL
    ");
    
    $stmt_pago->bind_param("is", $id_usuario, $fecha_corte);
    $stmt_pago->execute();
    $result_pago = $stmt_pago->get_result();
    $data_pago = $result_pago->fetch_assoc();
    $stmt_pago->close();

    $monto_pagado = (float)($data_pago['MontoPagado'] ?? 0);
    $monto_restante = max(0, $monto_req - $monto_pagado);

    // ======================================================
    // === 4. PROGRESO DE HORAS (Aplicando Corte Global) ===
    // ======================================================
    $stmt_horas = $conn->prepare("
        SELECT 
            SUM(
                TIME_TO_SEC(TIMEDIFF(HoraFin, HoraInicio)) + 
                IF(HoraFin < HoraInicio, 86400, 0)
            ) / 3600 AS HorasRegistradas
        FROM horastrabajo
        WHERE IdUsuario = ? 
          AND EstadoHoras = 'aprobado'
          AND FchaHoras >= ?  -- APLICAMOS LA FECHA DE CORTE GLOBAL
    ");

    $stmt_horas->bind_param("is", $id_usuario, $fecha_corte);
    $stmt_horas->execute();
    $result_horas = $stmt_horas->get_result();
    $data_horas = $result_horas->fetch_assoc();
    $stmt_horas->close();

    $horas_registradas = (float)($data_horas['HorasRegistradas'] ?? 0);
    $horas_restantes = max(0, $horas_req - $horas_registradas);
    
    // 5. Devolver el resultado combinado
    echo json_encode([
        'status' => 'ok',
        'data' => [
            'monto_requerido' => (float)$monto_req,
            'monto_pagado' => (float)$monto_pagado,
            'monto_restante' => (float)$monto_restante,
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