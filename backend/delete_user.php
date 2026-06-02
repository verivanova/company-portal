<?php
session_start();
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Доступ запрещён']);
    exit;
}
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Только администратор может удалять пользователей']);
    exit;
}

$user_id = (int)($_POST['id'] ?? 0);
if ($user_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Некорректный ID пользователя']);
    exit;
}

if ($user_id === (int)$_SESSION['user_id']) {
    echo json_encode(['success' => false, 'message' => 'Нельзя удалить самого себя']);
    exit;
}

$stmt = $mysqli->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param('i', $user_id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    require_once __DIR__ . '/log_helper.php';
    addLog($mysqli, $_SESSION['user_id'], 'Удаление пользователя', "Удалён пользователь ID: $user_id");

    echo json_encode(['success' => true, 'message' => 'Пользователь удалён']);
} else {
    echo json_encode(['success' => false, 'message' => 'Пользователь не найден или уже удалён']);
}
$stmt->close();