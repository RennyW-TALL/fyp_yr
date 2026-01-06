<?php
header("Access-Control-Allow-Origin: http://fyp-yr-dev-frontend-sg-78jn2k27.s3-website-ap-southeast-1.amazonaws.com");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}