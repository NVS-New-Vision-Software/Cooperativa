<?php
// Ocultamos el reporte de errores leves para asegurar que la salida sea JSON limpia.
error_reporting(0); 

// Incluye tu archivo de conexión. ASUME que define la variable $conn.
include 'conexion.php'; 

session_start();
header('Content-Type: application/json');

// 1. Verificación Crítica de Conexión mysqli
if (!isset($conn) || $conn->connect_error) {
    echo json_encode([
        'status' => 'error',
        'error' => 'La conexión a la base de datos (variable $conn) falló o no se cargó correctamente.',
        'detalles' => 'Revisa tu archivo conexion.php'
    ]);
    exit; 
}

try {
    // 1. Consulta para obtener Usuarios y su Vivienda Asignada (si la tienen)
    $sql_usuarios = "
        SELECT 
            u.IdUsuario,
            u.IdSocio,
            u.PrimNom AS NombreUsuario, 
            u.PrimApe AS ApellidoUsuario,
            u.Email,
            u.Rol,
            u.FchaIngreso,
            uv.IdVivienda AS IdViviendaAsignada,
            uv.NroVivienda AS NroViviendaAsignada
        FROM 
            usuario u
        LEFT JOIN
            unidadvivienda uv ON u.IdSocio = uv.IdSocio -- LEFT JOIN para obtener la vivienda asignada
        ORDER BY 
            u.IdUsuario DESC
    ";

    $result_usuarios = $conn->query($sql_usuarios);
    $usuarios = [];
    if ($result_usuarios) {
        while ($row = $result_usuarios->fetch_assoc()) {
            $usuarios[] = $row;
        }
        $result_usuarios->free();
    } else {
        throw new Exception("Error al ejecutar la consulta SQL de usuarios: " . $conn->error);
    }

    // 2. Consulta para obtener las Viviendas Disponibles (IdSocio IS NULL)
    // NOTA: Recuerda que IdSocio debe permitir NULL en la tabla unidadvivienda para que esto funcione.
    $sql_disponibles = "
        SELECT 
            IdVivienda, NroVivienda 
        FROM 
            unidadvivienda 
        WHERE 
            IdSocio IS NULL
        ORDER BY
            NroVivienda";

    $result_disponibles = $conn->query($sql_disponibles);
    $viviendas_disponibles = [];
    if ($result_disponibles) {
        while ($row = $result_disponibles->fetch_assoc()) {
            $viviendas_disponibles[] = $row;
        }
        $result_disponibles->free();
    }
    
    $conn->close(); // Cerrar la conexión

    // 3. Devolver ambos resultados
    echo json_encode([
        'status' => 'ok',
        'usuarios' => $usuarios,
        'viviendas_disponibles' => $viviendas_disponibles
    ]);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'error' => 'Error al procesar la solicitud.',
        'detalles' => $e->getMessage()
    ]);
}
?>