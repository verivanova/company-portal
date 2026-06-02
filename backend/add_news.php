<?php
session_start();
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/log_helper.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Доступ запрещён']);
    exit;
}
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Необходимо авторизоваться']);
    exit;
}

$title = trim($_POST['title'] ?? '');
$content = trim($_POST['content'] ?? '');
if (empty($title) || empty($content)) {
    echo json_encode(['success' => false, 'message' => 'Заголовок и содержание обязательны']);
    exit;
}

$author_id = (int)$_SESSION['user_id'];
$stmt = $mysqli->prepare("INSERT INTO news (title, content, author_id) VALUES (?, ?, ?)");
$stmt->bind_param('ssi', $title, $content, $author_id);

if ($stmt->execute()) {
    addLog($mysqli, $_SESSION['user_id'], 'Добавление новости', "Опубликована новость: $title");
    echo json_encode(['success' => true, 'message' => 'Новость опубликована']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка: ' . $stmt->error]);
}