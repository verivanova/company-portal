<?php
session_start();
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    if (empty($email) || empty($password)) {
        die("Введите email и пароль.");
    }

    $stmt = $mysqli->prepare("SELECT id, email, password, role FROM users WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['email'] = $user['email'];
    $_SESSION['role'] = $user['role'];

    if ($user['role'] === 'admin') {
        header('Location: /frontend/html/adminFrame.html');
        exit;
    } else {
        header('Location: /frontend/html/userFrame.html');
        exit;
    }
} else {
    echo "Неверный email или пароль.";
}
$stmt->close();
} else {
    echo "Доступ запрещён.";
}