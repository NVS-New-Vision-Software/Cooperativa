<?php
error_reporting(0); 
include 'conexion.php'; 
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'error' => 'Método no permitido.']);
    exit;
}

if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'error' => 'Error de conexión a la base de datos.']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$idVivienda = $data['idVivienda'] ?? null;

if (empty($idVivienda)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'error' => 'Se requiere idVivienda.']);
    exit;
}

// El ID 0 es el socio dummy (permite la eliminación)
$DUMMY_SOCIO_ID = 0; 

try {
    // 1. Verificar si la vivienda está asignada a un socio real
    $stmt = $conn->prepare("SELECT NroVivienda, IdSocio FROM unidadvivienda WHERE IdVivienda = ?");
    $stmt->bind_param("i", $idVivienda);
    $stmt->execute();
    $result = $stmt->get_result();
    $vivienda = $result->fetch_assoc();
    $stmt->close();

    if (!$vivienda) {
        throw new Exception("Vivienda no encontrada.");
    }

    if ($vivienda['IdSocio'] != $DUMMY_SOCIO_ID) {
         // Si está asignada a un socio REAL, lanzamos un error de negocio
         throw new Exception("Error: La vivienda {$vivienda['NroVivienda']} debe ser desasignada antes de poder eliminarla (actualmente asignada a IdSocio: {$vivienda['IdSocio']}).");
    }

    // 2. Eliminar la vivienda (está desasignada al socio dummy)
    $stmt = $conn->prepare("DELETE FROM unidadvivienda WHERE IdVivienda = ?");
    $stmt->bind_param("i", $idVivienda);
    
    if ($stmt->execute()) {
        $filasAfectadas = $stmt->affected_rows;
        $stmt->close();
        $conn->close();

        if ($filasAfectadas > 0) {
            echo json_encode(['status' => 'ok', 'message' => "Vivienda '{$vivienda['NroVivienda']}' eliminada exitosamente."]);
        } else {
            throw new Exception("No se eliminó ninguna vivienda (posiblemente ya eliminada).");
        }
    } else {
        throw new Exception("Error al ejecutar la eliminación: " . $stmt->error);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'error' => 'Fallo la eliminación de la vivienda.',
        'detalles' => $e->getMessage()
    ]);
}
?>