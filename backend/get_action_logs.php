<?php
session_start();
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Доступ запрещён']);
    exit;
}

$query = "SELECT a.id, a.action, a.description, a.created_at, u.full_name AS user_name
          FROM action_logs a
          JOIN users u ON a.user_id = u.id
          WHERE a.created_at >= NOW() - INTERVAL 14 DAY
          ORDER BY a.created_at DESC";
$result = $mysqli->query($query);
$logs = [];
while ($row = $result->fetch_assoc()) {
    $logs[] = [
        'id' => (int)$row['id'],
        'action' => $row['action'],
        'description' => $row['description'],
        'userName' => $row['user_name'],
        'createdAt' => date('d.m.Y H:i', strtotime($row['created_at']))
    ];
}
echo json_encode($logs, JSON_UNESCAPED_UNICODE);