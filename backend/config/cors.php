<?php
header("Access-Control-Allow-Origin: http://fyp-yr-dev-frontend-sg-78jn2k27.s3-website-ap-southeast-1.amazonaws.com");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// testing the connection
// Also allow the EC2 IP for testing
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $allowed_origins = [
        'http://fyp-yr-dev-frontend-sg-78jn2k27.s3-website-ap-southeast-1.amazonaws.com',
        'http://13.251.172.57',
        'http://localhost:3000',
        'http://localhost:5173'
    ];
    
    if (in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
        header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}