<?php
require_once '../../config/cors.php';
header("Content-Type: application/json");
require_once("../../config/db.php");

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

$username = $input["username"] ?? "";
$email = $input["email"] ?? "";
$password = $input["password"] ?? "";
$role = $input["role"] ?? "";
$fullName = $input["fullName"] ?? "";

// Additional fields based on role
$tpNumber = $input["tpNumber"] ?? "";
$gender = $input["gender"] ?? "";
$age = $input["age"] ?? null;
$course = $input["course"] ?? "";
$yearOfStudy = $input["yearOfStudy"] ?? null;
$specialization = $input["specialization"] ?? "";

if ($username === "" || $email === "" || $password === "" || $role === "" || $fullName === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All required fields must be filled"]);
    exit;
}

// Validate role
if (!in_array($role, ['student', 'counselor', 'admin'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid role"]);
    exit;
}

// Check if username or email already exists
$checkSql = "SELECT user_id FROM users WHERE username = ? OR email = ?";
$checkStmt = mysqli_prepare($conn, $checkSql);
mysqli_stmt_bind_param($checkStmt, "ss", $username, $email);
mysqli_stmt_execute($checkStmt);
$checkResult = mysqli_stmt_get_result($checkStmt);

if (mysqli_num_rows($checkResult) > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "Username or email already exists"]);
    exit;
}

// Start transaction
mysqli_begin_transaction($conn);

try {
    // Insert into users table
    $userSql = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
    $userStmt = mysqli_prepare($conn, $userSql);
    mysqli_stmt_bind_param($userStmt, "ssss", $username, $email, $password, $role);
    mysqli_stmt_execute($userStmt);
    
    $userId = mysqli_insert_id($conn);
    
    // Insert into role-specific table
    if ($role === 'student') {
        if ($tpNumber === "") {
            throw new Exception("TP Number is required for students");
        }
        
        $studentSql = "INSERT INTO students (user_id, tp_number, full_name, gender, age, course, year_of_study) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $studentStmt = mysqli_prepare($conn, $studentSql);
        mysqli_stmt_bind_param($studentStmt, "isssssi", $userId, $tpNumber, $fullName, $gender, $age, $course, $yearOfStudy);
        mysqli_stmt_execute($studentStmt);
        
    } elseif ($role === 'counselor') {
        $therapistSql = "INSERT INTO therapists (user_id, full_name, gender, specialization) VALUES (?, ?, ?, ?)";
        $therapistStmt = mysqli_prepare($conn, $therapistSql);
        mysqli_stmt_bind_param($therapistStmt, "isss", $userId, $fullName, $gender, $specialization);
        mysqli_stmt_execute($therapistStmt);
    }
    
    // Commit transaction
    mysqli_commit($conn);
    
    echo json_encode([
        "success" => true,
        "message" => "Registration successful",
        "user" => [
            "id" => $userId,
            "username" => $username,
            "email" => $email,
            "role" => $role
        ]
    ]);
    
} catch (Exception $e) {
    // Rollback transaction
    mysqli_rollback($conn);
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Registration failed: " . $e->getMessage()]);
}