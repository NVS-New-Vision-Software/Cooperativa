<?php
require_once 'conexion.php';
session_start();
header('Content-Type: application/json');

// --- 1. VERIFICACIÓN DE SESIÓN ---
if (!isset($_SESSION['email']) || !isset($_SESSION['rol'])) {
    http_response_code(401); // No autorizado
    echo json_encode(['error' => 'Usuario no autenticado o rol no definido.']);
    exit;
}

$userEmail = $_SESSION['email'];
$userRol = $_SESSION['rol']; // Asume que el rol está guardado en la sesión

// --- 2. CONSTRUCCIÓN DE LA CONSULTA CON FILTROS ---
$select = "SELECT IdPago, Email, FchaPago, Monto, Comprobante, EstadoPago FROM pago ";
$where = "";
$orderBy = " ORDER BY FchaPago DESC";

if ($userRol === 'admin') {
    // Si es administrador, solo mostramos los pendientes de TODOS los usuarios.
    $where = " WHERE EstadoPago = 'pendiente'";
    $stmt = $conn->prepare($select . $where . $orderBy);
    
} else {
    // Si es un socio o cualquier otro rol, mostramos TODOS sus registros.
    // Usamos sentencia preparada para evitar inyección SQL (MEJORA DE SEGURIDAD).
    $where = " WHERE Email = ?";
    $stmt = $conn->prepare($select . $where . $orderBy);
    $stmt->bind_param("s", $userEmail);
}

// --- 3. EJECUCIÓN Y RESULTADOS ---
$pagos = [];
if ($stmt->execute()) {
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $pagos[] = $row;
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al ejecutar la consulta de pagos.']);
    exit;
}

echo json_encode($pagos);
$stmt->close();
$conn->close();
?>