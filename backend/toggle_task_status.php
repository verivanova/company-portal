<?php
session_start();
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Доступ запрещён']);
    exit;
}
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Необходимо авторизоваться']);
    exit;
}

$taskId = (int)($_POST['id'] ?? 0);
if ($taskId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Некорректный ID задачи']);
    exit;
}

$stmt = $mysqli->prepare("SELECT assignee_id, status FROM tasks WHERE id = ?");
$stmt->bind_param('i', $taskId);
$stmt->execute();
$task = $stmt->get_result()->fetch_assoc();

if (!$task) {
    echo json_encode(['success' => false, 'message' => 'Задача не найдена']);
    exit;
}

if ($_SESSION['role'] !== 'admin' && (int)$_SESSION['user_id'] !== (int)$task['assignee_id']) {
    echo json_encode(['success' => false, 'message' => 'Недостаточно прав']);
    exit;
}

$newStatus = ($task['status'] === 'completed') ? 'not_completed' : 'completed';
$updateStmt = $mysqli->prepare("UPDATE tasks SET status = ? WHERE id = ?");
$updateStmt->bind_param('si', $newStatus, $taskId);

if ($updateStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Статус обновлён', 'newStatus' => $newStatus]);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка обновления статуса']);
}