<?php
// En: ../api/get_perfil.php

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

try {
    // 2. Query para obtener datos: Unir usuario -> socio -> unidadvivienda
    // Se utiliza u.IdUsuario para encontrar la fila y luego se unen las demás tablas.
    $stmt = $conn->prepare("
        SELECT 
            s.PrimNom, s.PrimApe, s.CI, s.FchaNac, s.FchaIngreso,
            uv.NroVivienda
        FROM usuario u
        JOIN socio s ON u.IdSocio = s.IdSocio
        LEFT JOIN unidadvivienda uv ON s.IdSocio = uv.IdSocio
        WHERE u.IdUsuario = ?
    ");
    
    $stmt->bind_param("i", $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Perfil de socio no encontrado para este usuario.']);
        exit;
    }

    $data = $result->fetch_assoc();
    $stmt->close();
    
    // 3. Preparar la respuesta JSON con las claves del formulario JS
    echo json_encode([
        'status' => 'ok',
        'data' => [
            // Campos de visualización
            'nombre' => $data['PrimNom'] ?? '',
            'apellido' => $data['PrimApe'] ?? '',
            'vivienda' => $data['NroVivienda'] ?? 'Sin Asignar', 
            // FchaIngreso es TIMESTAMP, se muestra solo la fecha (AAAA-MM-DD)
            'ingreso' => $data['FchaIngreso'] ? substr($data['FchaIngreso'], 0, 10) : '', 
            
            // Campos editables/visualizables
            'cedula' => $data['CI'] ?? '',      // Columna de Cédula/CI
            'fecha' => $data['FchaNac'] ?? '',  // Fecha de Nacimiento
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>