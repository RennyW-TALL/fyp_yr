<?php
require_once '../../config/cors.php';
require_once '../../config/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $query = "SELECT therapist_id, full_name, gender, specialization, profile_image_url 
              FROM therapists 
              WHERE is_active = 1 
              ORDER BY full_name ASC";
    
    $result = mysqli_query($conn, $query);
    
    if (!$result) {
        throw new Exception('Database query failed: ' . mysqli_error($conn));
    }
    
    $therapists = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $therapists[] = [
            'id' => $row['therapist_id'],
            'name' => $row['full_name'],
            'gender' => $row['gender'],
            'specialization' => $row['specialization'],
            'profileImage' => $row['profile_image_url']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $therapists
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error',
        'error' => $e->getMessage()
    ]);
}

mysqli_close($conn);
?>