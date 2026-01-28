<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['apiKey' => $_ENV['GEMINI_API_KEY']]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>