<?php
// Incluye el archivo de conexión que debe definir $conexion (objeto mysqli)
include 'conexion.php';

header('Content-Type: application/json');
$viviendas = [];
$response = [];

// Consulta SQL actualizada para obtener el Nombre Completo del Socio (PrimNom + PrimApe)
$sql = "
    SELECT 
        uv.IdVivienda, 
        uv.NroVivienda, 
        uv.IdSocio,
        CONCAT(s.PrimNom, ' ', s.PrimApe) AS NombreSocio 
    FROM 
        unidadvivienda uv
    LEFT JOIN 
        socio s ON uv.IdSocio = s.IdSocio
    ORDER BY 
        uv.IdVivienda
";

// 2. Ejecutar la consulta
$resultado = $conn->query($sql);

if ($resultado) {
    // 3. Procesar los resultados
    if ($resultado->num_rows > 0) {
        while ($fila = $resultado->fetch_assoc()) {
            $viviendas[] = $fila;
        }
        $response = [
            'status' => 'success',
            'data' => $viviendas
        ];
    } else {
        $response = [
            'status' => 'success',
            'data' => [],
            'message' => 'No se encontraron viviendas.'
        ];
    }
    
    // Liberar el conjunto de resultados
    $resultado->free();
    
} else {
    // 4. Manejo de errores de consulta
    http_response_code(500); 
    $response = [
        'status' => 'error',
        'message' => 'Error en la consulta SQL: ' . $conexion->error
    ];
}

// 5. Devolver la respuesta en JSON
echo json_encode($response);

?>