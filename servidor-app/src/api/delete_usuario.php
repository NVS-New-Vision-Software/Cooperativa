<?php
// Ocultamos el reporte de errores leves
error_reporting(0); 

// Incluye tu archivo de conexión ($conn usando mysqli)
include 'conexion.php'; 

session_start();
header('Content-Type: application/json');

// 1. Verificar la conexión y el método
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

// Obtener y sanitizar datos JSON
$data = json_decode(file_get_contents("php://input"), true);
$idUsuario = $data['idUsuario'] ?? null;

if (empty($idUsuario)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'error' => 'Datos incompletos. Se requiere idUsuario.']);
    exit;
}

// ----------------------------------------------------
// --- INICIO DE LA TRANSACCIÓN PARA ELIMINACIÓN TOTAL ---
// ----------------------------------------------------
$conn->autocommit(false); // Deshabilitar autocommit
$commit = true;
$idSocio = null;

try {
    
    // PASO 1: Obtener IdSocio del usuario (si lo tiene)
    $stmt = $conn->prepare("SELECT IdSocio FROM usuario WHERE IdUsuario = ?");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $idSocio = $row['IdSocio'];
    }
    $stmt->close();
    
    // PASO 2: Eliminar registros dependientes de IdUsuario
    
    // 2.1 Eliminar Horas de Trabajo
    $stmt = $conn->prepare("DELETE FROM horastrabajo WHERE IdUsuario = ?");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $stmt->close();

    // 2.2 Eliminar Pagos
    $stmt = $conn->prepare("DELETE FROM pago WHERE IdUsuario = ?");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $stmt->close();

    // PASO 3: Eliminar registros dependientes de IdSocio (Solo si el usuario es socio)
    if (!empty($idSocio)) {
        
        // 3.1 Eliminar Unidad Vivienda
        $stmt = $conn->prepare("DELETE FROM unidadvivienda WHERE IdSocio = ?");
        $stmt->bind_param("i", $idSocio);
        $stmt->execute();
        $stmt->close();

        // 3.2 Eliminar Socio
        $stmt = $conn->prepare("DELETE FROM socio WHERE IdSocio = ?");
        $stmt->bind_param("i", $idSocio);
        $stmt->execute();
        $stmt->close();
    }

    // PASO 4: Eliminar el registro principal (Usuario)
    $stmt = $conn->prepare("DELETE FROM usuario WHERE IdUsuario = ?");
    $stmt->bind_param("i", $idUsuario);
    $stmt->execute();
    $filasAfectadas = $stmt->affected_rows;
    $stmt->close();

    // Verificar si se eliminó el usuario (debe ser 1 si todo fue bien)
    if ($filasAfectadas !== 1) {
        throw new Exception("Error al eliminar el registro principal de usuario o el usuario no existe.");
    }

} catch (Exception $e) {
    $commit = false;
    $error_msg = $e->getMessage();
}

// ----------------------------------------------------
// --- FINALIZACIÓN DE LA TRANSACCIÓN ---
// ----------------------------------------------------

if ($commit) {
    $conn->commit(); // Confirmar todos los cambios
    $conn->autocommit(true);
    $conn->close();
    echo json_encode(['status' => 'ok', 'message' => 'Usuario y todos sus registros dependientes eliminados exitosamente.']);
} else {
    $conn->rollback(); // Revertir todos los cambios si hubo un error
    $conn->autocommit(true);
    $conn->close();
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'error' => 'Fallo la eliminación total. Se revirtieron los cambios.',
        'detalles' => $error_msg
    ]);
}
?>