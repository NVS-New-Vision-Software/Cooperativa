<?php
// En: ../api/set_metas.php

header('Content-Type: application/json');
require_once 'conexion.php'; 

session_start();

// 1. Verificar si es un administrador
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    http_response_code(403); // Prohibido
    echo json_encode(['status' => 'error', 'message' => 'Acceso denegado. Solo administradores.']);
    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // --- Lógica para OBTENER las metas actuales ---
        $stmt = $conn->prepare("SELECT HorasRequeridas, MontoPagar FROM config_metas LIMIT 1");
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($data = $result->fetch_assoc()) {
            echo json_encode(['status' => 'ok', 'data' => $data]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No se ha configurado ninguna meta.']);
        }
        $stmt->close();
        
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // --- Lógica para ACTUALIZAR las metas ---
        $horas = $_POST['horas_req'] ?? null;
        $monto = $_POST['monto_pagar'] ?? null;

        if (!is_numeric($horas) || !is_numeric($monto)) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Datos inválidos. Horas y Monto deben ser numéricos.']);
            exit;
        }

        // Usamos IdConfig=1 o la primera fila para actualizar la configuración global
        $stmt = $conn->prepare("
            UPDATE config_metas 
            SET HorasRequeridas = ?, MontoPagar = ? 
            WHERE IdConfig = 1
        "); 
        
        $stmt->bind_param("dd", $horas, $monto);
        
        if ($stmt->execute()) {
            if ($stmt->affected_rows === 0) {
                // Si la actualización falla, intenta INSERTAR (si la tabla estaba vacía)
                $conn->query("INSERT INTO config_metas (HorasRequeridas, MontoPagar) VALUES ($horas, $monto)");
            }
            echo json_encode(['status' => 'ok', 'message' => 'Configuración de metas actualizada con éxito.']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Error al actualizar: ' . $stmt->error]);
        }
        $stmt->close();
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Error del servidor: ' . $e->getMessage()]);
}

$conn->close();
?>