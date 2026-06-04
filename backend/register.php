<?php
session_start();
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/log_helper.php';

header('Content-Type: application/json; charset=utf-8');

// Перехват фатальных ошибок, чтобы всегда отдавать JSON
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Внутренняя ошибка сервера']);
        exit;
    }
});

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Доступ запрещён']);
    exit;
}
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Только администратор может регистрировать сотрудников']);
    exit;
}

$full_name = trim($_POST['full_name'] ?? '');
$email     = trim($_POST['email'] ?? '');
$password  = $_POST['password'] ?? '';
$password_confirm = $_POST['password_confirm'] ?? '';
$role      = $_POST['role'] ?? 'user';

$allowed_roles = ['user', 'admin'];
if (!in_array($role, $allowed_roles)) {
    echo json_encode(['success' => false, 'message' => 'Недопустимая роль']);
    exit;
}

if (empty($full_name) || empty($email) || empty($password) || empty($password_confirm)) {
    echo json_encode(['success' => false, 'message' => 'Пожалуйста, заполните все поля']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Некорректный email']);
    exit;
}
if (strlen($password) < 6) {
    echo json_encode(['success' => false, 'message' => 'Пароль должен быть не менее 6 символов']);
    exit;
}
if ($password !== $password_confirm) {
    echo json_encode(['success' => false, 'message' => 'Пароли не совпадают']);
    exit;
}

// Проверка уникальности email
$checkStmt = $mysqli->prepare("SELECT id FROM users WHERE email = ?");
$checkStmt->bind_param('s', $email);
$checkStmt->execute();
$checkStmt->store_result();
if ($checkStmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Пользователь с таким email уже существует']);
    $checkStmt->close();
    exit;
}
$checkStmt->close();

// Хеш пароля и вставка
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$stmt = $mysqli->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param('ssss', $full_name, $email, $hashedPassword, $role);

if ($stmt->execute()) {
    addLog($mysqli, $_SESSION['user_id'], 'Регистрация пользователя', "Добавлен пользователь $full_name ($email), роль: $role");
    echo json_encode(['success' => true, 'message' => "Пользователь $full_name успешно зарегистрирован"]);
} else {
    if ($mysqli->errno === 1062) {
        echo json_encode(['success' => false, 'message' => 'Пользователь с таким email уже существует']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Ошибка регистрации: ' . $stmt->error]);
    }
}
$stmt->close();