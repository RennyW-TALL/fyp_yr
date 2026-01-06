<?php
require_once '../../config/cors.php';
header("Content-Type: application/json");
require_once("../../config/db.php");
session_start();

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$username = $input["username"] ?? "";
$password = $input["password"] ?? "";

if ($username === "" || $password === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Username and password required"]);
    exit;
}

$sql = "SELECT user_id, username, email, password, role, is_active FROM users WHERE username = ? AND is_active = 1";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "s", $username);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);

if (!$user || $password !== $user["password"]) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    exit;
}

$_SESSION["user_id"] = $user["user_id"];
$_SESSION["role"] = $user["role"];

// Determine redirect URL based on role
$redirectUrl = "/";
switch ($user["role"]) {
    case "student":
        $redirectUrl = "/student/dashboard";
        break;
    case "counselor":
        $redirectUrl = "/counselor/dashboard";
        break;
    case "admin":
        $redirectUrl = "/admin/dashboard";
        break;
}

echo json_encode([
    "success" => true,
    "message" => "Login successful",
    "redirectUrl" => $redirectUrl,
    "user" => [
        "id" => $user["user_id"],
        "username" => $user["username"],
        "email" => $user["email"],
        "role" => $user["role"]
    ]
]);