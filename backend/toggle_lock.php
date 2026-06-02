<?php
session_start();
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/log_helper.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Доступ запрещён']);
    exit;
}
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Только администратор может изменять блокировку']);
    exit;
}

$user_id = (int)($_POST['id'] ?? 0);
if ($user_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Некорректный ID пользователя']);
    exit;
}
if ($user_id === (int)$_SESSION['user_id']) {
    echo json_encode(['success' => false, 'message' => 'Нельзя заблокировать самого себя']);
    exit;
}

$stmt = $mysqli->prepare("UPDATE users SET is_locked = NOT is_locked WHERE id = ?");
$stmt->bind_param('i', $user_id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    $res = $mysqli->query("SELECT is_locked FROM users WHERE id = $user_id");
    $row = $res->fetch_assoc();
    $newStatus = $row['is_locked'] ? 'заблокирован' : 'разблокирован';
    addLog($mysqli, $_SESSION['user_id'], 'Изменение блокировки', "Пользователь ID: $user_id $newStatus");
    echo json_encode(['success' => true, 'message' => "Пользователь $newStatus", 'is_locked' => (bool)$row['is_locked']]);
} else {
    echo json_encode(['success' => false, 'message' => 'Не удалось изменить блокировку. Возможно, пользователь не найден.']);
}
$stmt->close();