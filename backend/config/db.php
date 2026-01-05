<?php
$host = "fyp-yr-dev-db.cfisqsgeui29.ap-southeast-1.rds.amazonaws.com";
$user = "admin";
$pass = "hZFM-RwHv2PSZi$=";
$db   = "yr_db_fyp";
$port = 3306;

$conn = mysqli_connect($host, $user, $pass, $db, $port);

if (!$conn) {
    http_response_code(500);
    header("Content-Type: application/json");
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed",
        "error" => mysqli_connect_error()
    ]);
    exit;
}