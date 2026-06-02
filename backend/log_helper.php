<?php
function addLog($mysqli, $userId, $action, $description = '') {
    $stmt = $mysqli->prepare("INSERT INTO action_logs (user_id, action, description) VALUES (?, ?, ?)");
    $stmt->bind_param('iss', $userId, $action, $description);
    $stmt->execute();
    $stmt->close();
}