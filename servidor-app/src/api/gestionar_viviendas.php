<?php
include 'conexion.php'; // Define $conn

header('Content-Type: application/json');
$response = ['status' => 'error', 'message' => 'Petición inválida.'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['accion'])) {
    $accion = $_POST['accion'];
    
    try {
        if ($accion === 'asignar' && isset($_POST['idSocio']) && isset($_POST['idVivienda'])) {
            $idSocio = (int)$_POST['idSocio'];
            $idVivienda = (int)$_POST['idVivienda'];
            
            // 1. Desasignar la vivienda previamente asignada a otro socio (si aplica)
            // Esto es solo si permites la reasignación forzada, si no, puedes omitir esta.
            // Para simplificar, asumiremos que la vivienda estaba disponible.
            
            // 2. Asignar la vivienda al nuevo socio (actualizando la unidadvivienda)
            $stmt = $conn->prepare("UPDATE unidadvivienda SET IdSocio = ? WHERE IdVivienda = ?");
            $stmt->bind_param("ii", $idSocio, $idVivienda);
            
            if ($stmt->execute()) {
                $response = ['status' => 'success', 'message' => 'Vivienda asignada correctamente.'];
            } else {
                throw new Exception("Error al asignar la vivienda: " . $conn->error);
            }
            $stmt->close();

        } elseif ($accion === 'desasignar' && isset($_POST['idSocio'])) {
            $idSocio = (int)$_POST['idSocio'];
            
            // Desasignar la vivienda del socio (estableciendo IdSocio a NULL)
            $stmt = $conn->prepare("UPDATE unidadvivienda SET IdSocio = NULL WHERE IdSocio = ?");
            $stmt->bind_param("i", $idSocio);
            
            if ($stmt->execute()) {
                $response = ['status' => 'success', 'message' => 'Vivienda desasignada correctamente.'];
            } else {
                throw new Exception("Error al desasignar la vivienda: " . $conn->error);
            }
            $stmt->close();

        } else {
            $response['message'] = 'Parámetros de acción incompletos.';
        }
    } catch (Exception $e) {
        http_response_code(500);
        $response['message'] = 'Error en la operación: ' . $e->getMessage();
    }
}

echo json_encode($response);
// $conn->close();
?>