<?php
require_once '../../config/cors.php';
header("Content-Type: application/json");

require_once("../../config/db.php");

try {
    $sql = "SELECT user_id, username, email, role, is_active, created_at FROM users ORDER BY user_id";
    $result = mysqli_query($conn, $sql);
    
    if (!$result) {
        throw new Exception("Query failed: " . mysqli_error($conn));
    }
    
    $users = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $users[] = $row;
    }
    
    echo json_encode(["success" => true, "data" => $users]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>