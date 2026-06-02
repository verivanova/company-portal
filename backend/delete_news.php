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

$newsId = (int)($_POST['id'] ?? 0);
if ($newsId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Некорректный ID']);
    exit;
}

$stmt = $mysqli->prepare("SELECT author_id FROM news WHERE id = ?");
$stmt->bind_param('i', $newsId);
$stmt->execute();
$news = $stmt->get_result()->fetch_assoc();
if (!$news) {
    echo json_encode(['success' => false, 'message' => 'Новость не найдена']);
    exit;
}

if ($_SESSION['role'] !== 'admin' && (int)$_SESSION['user_id'] !== (int)$news['author_id']) {
    echo json_encode(['success' => false, 'message' => 'Недостаточно прав']);
    exit;
}

$deleteStmt = $mysqli->prepare("DELETE FROM news WHERE id = ?");
$deleteStmt->bind_param('i', $newsId);

if ($deleteStmt->execute() && $deleteStmt->affected_rows > 0) {
    addLog($mysqli, $_SESSION['user_id'], 'Удаление новости', "Удалена новость ID: $newsId");
    echo json_encode(['success' => true, 'message' => 'Новость удалена']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка удаления']);
}