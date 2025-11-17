<?php
require_once 'conexion.php';
session_start(); // ¡Asegúrate de que la sesión esté iniciada!
header('Content-Type: application/json');

// --- 1. VERIFICACIÓN DE SESIÓN Y ROL ---
if (!isset($_SESSION['email']) || !isset($_SESSION['rol'])) {
    http_response_code(401); // No autorizado
    echo json_encode(['error' => 'Usuario no autenticado o rol no definido.']);
    exit;
}

$userEmail = $_SESSION['email'];
$userRol = $_SESSION['rol']; // Asume que el rol está guardado en la sesión

// --- 2. CONSTRUCCIÓN DE LA CONSULTA CON FILTROS ---
$select = "SELECT IdHoras, Email, FchaHoras, HoraInicio, HoraFin, Descripción, EstadoHoras 
           FROM horastrabajo ";
$where = "";
$orderBy = " ORDER BY FchaHoras DESC";

if ($userRol === 'admin') {
    // Si es administrador, muestra solo las horas pendientes de TODOS los usuarios.
    // Asume que la columna de estado se llama 'EstadoHoras'
    $where = " WHERE EstadoHoras = 'pendiente'";
    $stmt = $conn->prepare($select . $where . $orderBy);
    
} else {
    // Si es un socio, muestra TODOS sus registros de horas (historial).
    // Usamos sentencia preparada para filtrar por el email del usuario.
    $where = " WHERE Email = ?";
    $stmt = $conn->prepare($select . $where . $orderBy);
    $stmt->bind_param("s", $userEmail);
}

// --- 3. EJECUCIÓN Y RESULTADOS ---
$horas = [];
if ($stmt->execute()) {
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $horas[] = $row;
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al ejecutar la consulta de horas.']);
    exit;
}

echo json_encode($horas);
$stmt->close();
$conn->close();
?>