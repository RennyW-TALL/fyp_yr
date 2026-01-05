<?php
header("Content-Type: application/json");
require_once("../../config/db.php");
require_once("../../helpers/auth.php");

requireLogin();
requireRole("student");

$userId = $_SESSION["user_id"];

/*
We need the student_id linked to this user_id
students.user_id → users.user_id
*/
$q1 = mysqli_prepare($conn, "SELECT student_id FROM students WHERE user_id = ?");
mysqli_stmt_bind_param($q1, "i", $userId);
mysqli_stmt_execute($q1);
$r1 = mysqli_stmt_get_result($q1);
$s = mysqli_fetch_assoc($r1);

if (!$s) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Student profile not found"]);
    exit;
}

$studentId = $s["student_id"];

$q2 = mysqli_prepare($conn, "
    SELECT appointment_id, appointment_date, start_time, end_time, status, booking_mode
    FROM appointments
    WHERE student_id = ?
    ORDER BY appointment_date DESC, start_time DESC
");
mysqli_stmt_bind_param($q2, "i", $studentId);
mysqli_stmt_execute($q2);
$r2 = mysqli_stmt_get_result($q2);

$data = [];
while ($row = mysqli_fetch_assoc($r2)) {
    $data[] = $row;
}

echo json_encode(["success" => true, "data" => $data]);