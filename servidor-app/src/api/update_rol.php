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

$idUsuario = $data['idUsuario'] ?? null;
$nuevoRol = $data['nuevoRol'] ?? null;

if (empty($idUsuario) || empty($nuevoRol)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'error' => 'Datos incompletos. Se requiere idUsuario y nuevoRol.']);
    exit;
}

// Opcional: Validar que el rol sea uno de los permitidos
$roles_permitidos = ['usuario', 'socio', 'admin'];
if (!in_array($nuevoRol, $roles_permitidos)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'error' => 'Rol no válido.']);
    exit;
}

try {
    // Usamos sentencias preparadas para seguridad
    $stmt = $conn->prepare("UPDATE usuario SET Rol = ? WHERE IdUsuario = ?");
    
    if ($stmt === false) {
        throw new Exception("Error al preparar la consulta: " . $conn->error);
    }

    // "si" -> string, integer
    $stmt->bind_param("si", $nuevoRol, $idUsuario); 
    
    if ($stmt->execute()) {
        $filasAfectadas = $stmt->affected_rows;
        $stmt->close();
        $conn->close();

        if ($filasAfectadas >= 0) { // >= 0 cubre el caso donde el rol ya era el mismo
            echo json_encode(['status' => 'ok', 'message' => 'Rol procesado exitosamente.']);
        }
    } else {
        throw new Exception("Error al ejecutar la actualización: " . $stmt->error);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'error' => 'Error al procesar la solicitud.',
        'detalles' => $e->getMessage()
    ]);
}
?>