<?php
include 'config.php';
$link = @mysqli_connect($host, $user, $password, $database);
if ($link) {
    echo "Подключение к MySQL успешно!";
    mysqli_close($link);
} else {
    echo "Ошибка: " . mysqli_connect_error();
}
?>