<?php
session_start();
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    if (empty($email) || empty($password)) {
        die("Введите email и пароль.");
    }
}
$stmt = $mysqli->prepare("SELECT id, email, password, role, full_name, is_locked FROM users WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    if ($user['is_locked'] == 1) {
        echo "Ваша учетная запись заблокирована. Обратитесь к администратору.";
        exit;
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['role'] = $user['role'];
    $_SESSION['full_name'] = $user['full_name'];

    if ($user['role'] === 'admin') {
        header('Location: /frontend/html/adminFrame.php');
        exit;
    } else {
        header('Location: /frontend/html/userFrame.php');
        exit;
    }
} else {
    echo "Неверный email или пароль.";
}