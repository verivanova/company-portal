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
$description = trim($_POST['description'] ?? '');
$manager_id = (int)($_POST['manager_id'] ?? 0);
$assignee_id = (int)($_POST['assignee_id'] ?? 0);
$deadline = $_POST['deadline'] ?? '';

if (empty($title) || empty($deadline) || $manager_id <= 0 || $assignee_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Заполните все поля']);
    exit;
}

$today = date('Y-m-d');
$maxDate = date('Y-m-d', strtotime('+1 year'));
if ($deadline < $today || $deadline > $maxDate) {
    echo json_encode(['success' => false, 'message' => 'Дата выполнения должна быть в диапазоне от сегодня до ' . date('d.m.Y', strtotime($maxDate))]);
    exit;
}

$checkStmt = $mysqli->prepare("SELECT id FROM users WHERE id IN (?, ?)");
$checkStmt->bind_param('ii', $manager_id, $assignee_id);
$checkStmt->execute();
$checkStmt->store_result();
if ($checkStmt->num_rows < 2) {
    echo json_encode(['success' => false, 'message' => 'Указанные постановщик или ответственный не найдены']);
    exit;
}
$checkStmt->close();

$stmt = $mysqli->prepare("INSERT INTO tasks (title, description, manager_id, assignee_id, deadline) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param('ssiis', $title, $description, $manager_id, $assignee_id, $deadline);

if ($stmt->execute()) {
    addLog($mysqli, $_SESSION['user_id'], 'Создание задачи', "Создана задача: $title");
    echo json_encode(['success' => true, 'message' => 'Задача успешно создана']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при создании задачи: ' . $stmt->error]);
}
$stmt->close();