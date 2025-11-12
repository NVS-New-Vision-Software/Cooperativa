<?php
// Ocultamos el reporte de errores leves para asegurar que la salida sea JSON limpia.
error_reporting(0); 

// Incluye tu archivo de conexión. ASUME que define la variable $conn.
include 'conexion.php'; 

session_start();
header('Content-Type: application/json');

// 1. Verificación Crítica de Conexión mysqli
// Verificamos si $conn existe y si la conexión tiene errores
if (!isset($conn) || $conn->connect_error) {
    // Si la conexión falló, devolvemos un JSON limpio de error
    echo json_encode([
        'status' => 'error',
        'error' => 'La conexión a la base de datos (variable $conn) falló o no se cargó correctamente.',
        'detalles' => 'Revisa tu archivo conexion.php'
    ]);
    exit; 
}

try {
    // Consulta SIMPLIFICADA: Solo seleccionamos campos de la tabla 'usuario'
    $sql = "
        SELECT 
            u.IdUsuario,
            u.PrimNom AS NombreUsuario, 
            u.PrimApe AS ApellidoUsuario,
            u.Email,
            u.Rol,
            u.IdSocio,
            u.FchaIngreso
        FROM 
            usuario u
        ORDER BY 
            u.IdUsuario DESC
    ";

    // 2. Ejecución de la consulta usando mysqli orientado a objetos
    $result = $conn->query($sql);

    $usuarios = [];
    if ($result) {
        // Recorrer los resultados y guardarlos en el array $usuarios
        while ($row = $result->fetch_assoc()) {
            $usuarios[] = $row;
        }
        $result->free(); // Liberar el conjunto de resultados
    } else {
        // Lanzar una excepción si la consulta SQL falla
        throw new Exception("Error al ejecutar la consulta SQL: " . $conn->error);
    }
    
    $conn->close(); // Cerrar la conexión

    // 3. Mapeo/Ajuste de resultados para compatibilidad con JavaScript
    $usuarios_gestion = array_map(function($u) {
        // Asignar 'N/A' si IdSocio es nulo/vacío
        $u['IdSocio'] = $u['IdSocio'] ?: 'N/A';
        // Añadimos 'NroVivienda' con valor fijo para compatibilidad con el JS del frontend
        $u['NroVivienda'] = 'No asignada'; 
        // Formatear fecha (solo primeros 10 caracteres)
        $u['FchaIngreso'] = $u['FchaIngreso'] ? substr($u['FchaIngreso'], 0, 10) : 'N/A';
        return $u;
    }, $usuarios);

    echo json_encode([
        'status' => 'ok',
        'usuarios' => $usuarios_gestion
    ]);

} catch (Exception $e) {
    // Manejo de errores de la solicitud o ejecución SQL
    echo json_encode([
        'status' => 'error',
        'error' => 'Error al procesar la solicitud.',
        'detalles' => $e->getMessage()
    ]);
}
?>