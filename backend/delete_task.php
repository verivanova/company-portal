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

$taskId = (int)($_POST['id'] ?? 0);
if ($taskId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Некорректный ID задачи']);
    exit;
}

$stmt = $mysqli->prepare("SELECT manager_id FROM tasks WHERE id = ?");
$stmt->bind_param('i', $taskId);
$stmt->execute();
$task = $stmt->get_result()->fetch_assoc();
if (!$task) {
    echo json_encode(['success' => false, 'message' => 'Задача не найдена']);
    exit;
}
if ($_SESSION['role'] !== 'admin' && (int)$_SESSION['user_id'] !== (int)$task['manager_id']) {
    echo json_encode(['success' => false, 'message' => 'Недостаточно прав для удаления']);
    exit;
}

$deleteStmt = $mysqli->prepare("DELETE FROM tasks WHERE id = ?");
$deleteStmt->bind_param('i', $taskId);

if ($deleteStmt->execute() && $deleteStmt->affected_rows > 0) {
    addLog($mysqli, $_SESSION['user_id'], 'Удаление задачи', "Удалена задача ID: $taskId");
    echo json_encode(['success' => true, 'message' => 'Задача удалена']);
} else {
    echo json_encode(['success' => false, 'message' => 'Не удалось удалить задачу']);
}
$deleteStmt->close();