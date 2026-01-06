<?php
// Test password verification
$stored_hash = '$2y$10$F2FF1cCslolLF2yk6V45YOGyZ8oajaTucs8fS6t6Y9YAOqVNVeDkS';

$test_passwords = ['password', 'password123', '123456', 'admin123', 'student123'];

foreach ($test_passwords as $pwd) {
    if (password_verify($pwd, $stored_hash)) {
        echo "Password found: " . $pwd . "\n";
        break;
    }
}

echo "Hash: " . $stored_hash . "\n";