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
$title = trim($_POST['title'] ?? '');
$description = trim($_POST['description'] ?? '');
$manager_id = (int)($_POST['manager_id'] ?? 0);
$assignee_id = (int)($_POST['assignee_id'] ?? 0);
$deadline = $_POST['deadline'] ?? '';

if (empty($title) || empty($deadline) || $manager_id <= 0 || $assignee_id <= 0 || $taskId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Заполните все поля']);
    exit;
}

$today = date('Y-m-d');
$maxDate = date('Y-m-d', strtotime('+1 year'));
if ($deadline < $today || $deadline > $maxDate) {
    echo json_encode(['success' => false, 'message' => 'Дата должна быть в диапазоне от сегодня до ' . date('d.m.Y', strtotime($maxDate))]);
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
    echo json_encode(['success' => false, 'message' => 'Недостаточно прав для редактирования']);
    exit;
}

$checkUsers = $mysqli->prepare("SELECT id FROM users WHERE id IN (?, ?)");
$checkUsers->bind_param('ii', $manager_id, $assignee_id);
$checkUsers->execute();
$checkUsers->store_result();
if ($checkUsers->num_rows < 2) {
    echo json_encode(['success' => false, 'message' => 'Указанные пользователи не найдены']);
    exit;
}
$checkUsers->close();

$updateStmt = $mysqli->prepare("UPDATE tasks SET title=?, description=?, manager_id=?, assignee_id=?, deadline=? WHERE id=?");
$updateStmt->bind_param('ssiisi', $title, $description, $manager_id, $assignee_id, $deadline, $taskId);

if ($updateStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Задача обновлена']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка обновления: ' . $updateStmt->error]);
}