<?php
session_start();
require_once __DIR__ . '/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Доступ запрещён']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

$users = [];
$result = $mysqli->query("SELECT id, full_name, email, role, created_at, is_locked FROM users ORDER BY created_at DESC");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $users[] = [
            'id'          => (int)$row['id'],
            'fullName'    => $row['full_name'],
            'email'       => $row['email'],
            'role'        => ($row['role'] === 'admin') ? 'admin' : 'employee', 
            'dateCreated' => date('d.m.Y', strtotime($row['created_at'])),
            'isLocked'    => (bool)$row['is_locked'],
        ];
    }
    $result->free();
}

echo json_encode($users, JSON_UNESCAPED_UNICODE);