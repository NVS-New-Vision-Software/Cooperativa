<?php
// Ocultamos el reporte de errores leves
error_reporting(0); 

// Incluye tu archivo de conexión ($conn usando mysqli)
include 'conexion.php'; 

session_start();
header('Content-Type: application/json');

// --- ID DEL SOCIO DUMMY ---
// Este ID DEBE existir en tu tabla `socio` y ser el que uses para marcar viviendas como "desasignadas".
$DUMMY_SOCIO_ID = 0; 
// -------------------------

// 1. Verificar el método de la solicitud y la conexión
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

// 2. Obtener y validar datos JSON
$data = json_decode(file_get_contents("php://input"), true);
$nroVivienda = $data['nroVivienda'] ?? null;

if (empty($nroVivienda)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'error' => 'El número de vivienda es obligatorio.']);
    exit;
}

try {
    // 3. Verificar si la vivienda ya existe
    $stmt = $conn->prepare("SELECT NroVivienda FROM unidadvivienda WHERE NroVivienda = ?");
    $stmt->bind_param("s", $nroVivienda);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        $stmt->close();
        throw new Exception("El número de vivienda '{$nroVivienda}' ya existe.");
    }
    $stmt->close();

    // 4. Insertar la nueva vivienda, ASIGNANDO AL SOCIO DUMMY (ID 0)
    // Esto es crucial para cumplir con la restricción NOT NULL y la Foreign Key.
    $stmt = $conn->prepare("INSERT INTO unidadvivienda (NroVivienda, IdSocio) VALUES (?, ?)");
    $stmt->bind_param("si", $nroVivienda, $DUMMY_SOCIO_ID); // "si" -> string, integer
    
    if ($stmt->execute()) {
        $stmt->close();
        $conn->close();
        echo json_encode(['status' => 'ok', 'message' => "Vivienda '{$nroVivienda}' creada exitosamente."]);
    } else {
        // Incluimos el error SQL real para el diagnóstico
        throw new Exception("Error al insertar la vivienda: " . $stmt->error . 
                            ". CÓDIGO DE ERROR: " . $conn->errno); 
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'error' => 'Fallo la creación de la vivienda. Revisa si el Socio Dummy (ID 0) existe en la tabla `socio`.',
        'detalles' => $e->getMessage()
    ]);
}
?>