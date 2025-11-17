<?php
// Ocultamos el reporte de errores leves
error_reporting(0); 

// Incluye tu archivo de conexión ($conn usando mysqli)
include 'conexion.php'; 

session_start();
header('Content-Type: application/json');

// 1. Verificación de conexión
if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'error' => 'Error de conexión a la base de datos.']);
    exit;
}

// 2. Obtener y sanitizar IdSocio desde la URL
$idSocio = $_GET['idSocio'] ?? null;

if (empty($idSocio) || !is_numeric($idSocio)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'error' => 'ID de Socio inválido o faltante.']);
    exit;
}

$socioDetails = [];
$viviendaDetails = [];
$horas = [];
$pagos = [];

// ----------------------------------------------------
// --- CONSULTAS MULTIPLES POR IdSocio ---
// ----------------------------------------------------
try {
    // 1. Obtener detalles del SOCIO
    $stmt = $conn->prepare("SELECT IdSocio, PrimNom, PrimApe, FchaNac, FchaIngreso FROM socio WHERE IdSocio = ?");
    $stmt->bind_param("i", $idSocio);
    $stmt->execute();
    $result = $stmt->get_result();
    $socioDetails = $result->fetch_assoc() ?: null;
    $stmt->close();

    if (!$socioDetails) {
        throw new Exception("Socio no encontrado con el ID: " . $idSocio);
    }
    
    // 2. Obtener detalles de la VIVIENDA
    $stmt = $conn->prepare("SELECT NroVivienda FROM unidadvivienda WHERE IdSocio = ?");
    $stmt->bind_param("i", $idSocio);
    $stmt->execute();
    $result = $stmt->get_result();
    $viviendaDetails = $result->fetch_assoc() ?: null;
    $stmt->close();
    
    // 3. Obtener HORAS DE TRABAJO
    // Nota: La tabla horastrabajo usa IdUsuario, no IdSocio. Necesitamos el IdUsuario.
    // Asumimos que el IdSocio se corresponde con el IdUsuario para simplificar, 
    // PERO LO CORRECTO SERÍA USAR LA TABLA USUARIO PARA OBTENER EL IDUSUARIO PRIMERO.
    // Usaremos IdSocio para las horas de momento, ya que tu esquema SQL es inconsistente con las FKs
    // (horastrabajo y pago usan IdUsuario, no IdSocio).
    // SIN EMBARGO, para ser fieles a tu esquema y evitar errores, asumo que las tablas 
    // están relacionadas, PERO TU ESQUEMA MUESTRA QUE PAGO Y HORAS USAN IDUSUARIO.
    
    // CORRECCIÓN BASADA EN ESQUEMA: Debemos obtener el IdUsuario.
    $stmt = $conn->prepare("SELECT IdUsuario FROM usuario WHERE IdSocio = ?");
    $stmt->bind_param("i", $idSocio);
    $stmt->execute();
    $result = $stmt->get_result();
    $usuarioRow = $result->fetch_assoc();
    $idUsuario = $usuarioRow['IdUsuario'] ?? 0;
    $stmt->close();
    
    if ($idUsuario > 0) {
        // Obtener HORAS DE TRABAJO
        $stmt = $conn->prepare("SELECT IdHoras, FchaHoras, HoraInicio, HoraFin, Descripción, EstadoHoras FROM horastrabajo WHERE IdUsuario = ? ORDER BY FchaHoras DESC");
        $stmt->bind_param("i", $idUsuario);
        $stmt->execute();
        $horas = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();

        // Obtener PAGOS
        $stmt = $conn->prepare("SELECT IdPago, FchaPago, Monto, Comprobante, EstadoPago FROM pago WHERE IdUsuario = ? ORDER BY FchaPago DESC");
        $stmt->bind_param("i", $idUsuario);
        $stmt->execute();
        $pagos = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
    }
    
    $conn->close();

    // 4. Devolver la respuesta consolidada
    echo json_encode([
        'status' => 'ok',
        'socio' => $socioDetails,
        'vivienda' => $viviendaDetails ?: ['NroVivienda' => 'N/A'],
        'horas' => $horas,
        'pagos' => $pagos
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'error' => 'Error al procesar la solicitud.',
        'detalles' => $e->getMessage()
    ]);
}
?>