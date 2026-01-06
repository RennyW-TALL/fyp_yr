<?php
require_once '../../config/cors.php';
header("Content-Type: application/json");
session_start();
session_destroy();

echo json_encode(["success" => true, "message" => "Logged out"]);