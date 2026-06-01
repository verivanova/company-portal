<?php
session_start();
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Доступ запрещён']);
    exit;
}

$result = $mysqli->query("
    SELECT t.id, t.title, t.description, t.deadline, t.status, t.created_at,
        m.full_name AS manager_name, m.id AS manager_id,
        a.full_name AS assignee_name, a.id AS assignee_id
    FROM tasks t
    JOIN users m ON t.manager_id = m.id
    JOIN users a ON t.assignee_id = a.id
    ORDER BY t.created_at DESC
");

$tasks = [];
while ($row = $result->fetch_assoc()) {
    $tasks[] = [
        'id'          => (int)$row['id'],
        'title'       => $row['title'],
        'description' => $row['description'],
        'managerName' => $row['manager_name'],
        'managerId'   => (int)$row['manager_id'],
        'assigneeName'=> $row['assignee_name'],
        'assigneeId'  => (int)$row['assignee_id'],
        'deadline'    => $row['deadline'],
        'status'      => $row['status'],
        'dateCreated' => date('d.m.Y', strtotime($row['created_at'])),
    ];
}

echo json_encode($tasks, JSON_UNESCAPED_UNICODE);