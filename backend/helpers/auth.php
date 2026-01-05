<?php
session_start();

function requireLogin() {
    if (!isset($_SESSION["user_id"])) {
        http_response_code(401);
        header("Content-Type: application/json");
        echo json_encode(["success" => false, "message" => "Unauthorized"]);
        exit;
    }
}

function requireRole($role) {
    if (!isset($_SESSION["role"]) || $_SESSION["role"] !== $role) {
        http_response_code(403);
        header("Content-Type: application/json");
        echo json_encode(["success" => false, "message" => "Forbidden"]);
        exit;
    }
}