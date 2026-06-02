<?php
session_start();
require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Доступ запрещён']);
    exit;
}
$result = $mysqli->query("SELECT n.id, n.title, n.content, n.created_at, u.full_name AS author_name, u.id AS author_id
FROM news n JOIN users u ON n.author_id = u.id ORDER BY n.created_at DESC");
$news = [];
while ($row = $result->fetch_assoc()) {
    $news[] = [
        'id' => (int)$row['id'],
        'title' => $row['title'],
        'content' => $row['content'],
        'authorName' => $row['author_name'],
        'authorId' => (int)$row['author_id'],
        'createdAt' => date('d.m.Y H:i', strtotime($row['created_at']))
    ];
}
echo json_encode($news, JSON_UNESCAPED_UNICODE);