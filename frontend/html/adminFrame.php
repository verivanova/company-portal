<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    header('Location: /frontend/html/index.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ru">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Company Portal - Внутренний портал компании</title>
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>

<body>
  <header class="header">
    <div class="header__inner container">
      <h2 class="header__logo"> Company Portal </h2>
      <nav class="header__menu">
        <ul class="header__menu-list">
          <li class="header__menu-item">
            <a id="news-link" class="header__menu-link active">Лента новостей</a>
          </li>
          <li class="header__menu-item">
            <a id="tasks-link" class="header__menu-link">Задачи</a>
          </li>
          <li class="header__menu-item">
            <a id="management-link" class="header__menu-link">Управление</a>
          </li>
          <li class="header__menu-item">
            <a id="actionLog-link" class="header__menu-link">Журнал действий</a>
          </li>
          <li class="header__menu-item">
            <button id="themeToggle" class="theme-toggle" title="Переключить тему">
              <i class="fas fa-moon"></i>
            </button>
          </li>
          <li class="header__menu-item">
            <a href="#login" class="btn header__btn-login">Администратор<?= htmlspecialchars($_SESSION['email']) ?></a>
          </li>
          <li class="header__menu-item">
            <a href="/backend/logout.php" class="btn header__btn-logout">Выйти</a>
          </li>

        </ul>
      </nav>
    </div>

  </header>

  <main class="main">
    <section id="news-section" class="news">
      <div class="news__header container">
        <h2 class="news__title">Лента новостей</h2>
        <button class="news__add btn" id="add-news-btn">
          <i class="fas fa-plus"></i>
          Добавить новость
        </button>
      </div>
      <div id="publish-form" class="news__form hidden">
        <div class="news__form-card">
          <h3>Публикация новой новости</h3>
          <form id="news-form">
            <div class="news__inner">
              <label for="news-title">Заголовок новости</label>
              <input type="text" id="news-title" required placeholder="Введите заголовок новости">
            </div>
            <div class="news__inner">
              <label for="news-content">Содержание новости</label>
              <textarea id="news-content" required placeholder="Введите текст новости"></textarea>
            </div>
            <button type="submit" class="btn">Опубликовать новость</button>
          </form>
        </div>
      </div>

      <div id="news-container">
        <div class="news__item">
          <div class="news__item-header">
            <h3>Корпоративное мероприятие</h3>
            <div class="news__actions">
              <button class="news__btn btn news__delete-news" title="Удалить задачу">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
          <p>Напоминаем о предстоящем корпоративном мероприятии в эту пятницу. Регистрация обязательна для всех
            сотрудников.</p>
          <div class="news__date">25.11.2025</div>
        </div>
      </div>

    </section>

    <section id="tasks-section" class="tasks hidden">
      <div class="tasks__header container">
        <h2 class="tasks__title">Задачи</h2>
      </div>

      <button class="tasks__add btn" id="add-task-btn">
        <i class="fas fa-plus"></i>
        Создать задачу
      </button>

      <div id="task-form-container" class="tasks__container hidden">
        <div class="tasks__container-card">
          <h3 id="task-form-title">Создание новой задачи</h3>
          <form id="task-form" class="news">
            <div class="news__inner">
              <label for="task-title">Название задачи</label>
              <input type="text" id="task-title" required placeholder="Введите название задачи">
            </div>
            <div class="news__inner">
              <label for="task-description">Описание задачи</label>
              <textarea id="task-description" class="tasks__descr" required
                placeholder="Введите описание задачи"></textarea>
            </div>
            <div class="news__inner">
              <label for="task-manager">Постановщик</label>
              <select id="task-manager" required>
                <option value="">Выберите постановщика</option>
                <option value="Иванов Иван Иванович">Иванов Иван Иванович</option>
                <option value="Петров Петр Петрович">Петров Петр Петрович</option>
                <option value="Сидорова Мария Сергеевна">Сидорова Мария Сергеевна</option>
                <option value="Козлов Алексей Дмитриевич">Козлов Алексей Дмитриевич</option>
              </select>
            </div>
            <div class="news__row">
              <div class="news__inner">
                <label for="task-assignee">Ответственный</label>
                <select id="task-assignee" required>
                  <option value="">Выберите ответственного</option>
                  <option value="Иванов Иван Иванович">Иванов Иван Иванович</option>
                  <option value="Петров Петр Петрович">Петров Петр Петрович</option>
                  <option value="Сидорова Мария Сергеевна">Сидорова Мария Сергеевна</option>
                  <option value="Козлов Алексей Дмитриевич">Козлов Алексей Дмитриевич</option>
                </select>
              </div>
              <div class="news__inner">
                <label for="task-deadline">Срок выполнения</label>
                <input type="date" id="task-deadline" required>
              </div>
            </div>
            <div class="news__actions">
              <button type="submit" class="btn" id="task-submit-btn">Создать задачу</button>
            </div>
          </form>
        </div>
      </div>

      <div class="tasks__controls">
        <div class="tasks__box">
          <i class="fas fa-search"></i>
          <input type="text" id="task-search" placeholder="Поиск по задачам...">
        </div>
        <div class="tasks__filter">
          <select id="status-filter">
            <option value="all">Все статусы</option>
            <option value="completed">Выполненные</option>
            <option value="not-completed">Не выполненные</option>
          </select>
          <select id="assignee-filter">
            <option value="all">Все ответственные</option>
            <option value="Иванов Иван Иванович">Иванов И.И.</option>
            <option value="Петров Петр Петрович">Петров П.П.</option>
            <option value="Сидорова Мария Сергеевна">Сидорова М.С.</option>
            <option value="Козлов Алексей Дмитриевич">Козлов А.Д.</option>
          </select>
        </div>
      </div>

      <div id="tasks-container" class="tasks__ready">

      </div>
    </section>

    <section id="management-section" class="management hidden">
      <div class="management__header container">
        <h2 class="management__title">Управление пользователями</h2>
        <button class="management__add btn" id="add-user-btn">
          <i class="fas fa-plus"></i>
          Добавить пользователя
        </button>
      </div>

      <div id="user-form-container" class="management__container hidden">
        <div class="management__container-card">
          <h3>Добавление нового пользователя</h3>
          <form id="user-form" action="/backend/register.php" method="post">
            <div class="management__inner">
              <label for="user-fullname">ФИО пользователя</label>
              <input type="text" id="user-fullname" required placeholder="Введите ФИО пользователя">
            </div>
            <div class="management__inner">
              <label for="user-email">Email</label>
              <input type="email" id="user-email" required placeholder="Введите email пользователя">
            </div>
            <div class="management__inner">
              <label for="user-role">Роль</label>
              <select id="user-role" required>
                <option value="">Выберите роль</option>
                <option value="employee">Сотрудник</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
            <div class="management__inner">
              <label for="user-password">Пароль</label>
              <input type="password" id="user-password" required placeholder="Введите пароль">
            </div>
            <div class="management__inner">
              <label for="user-password-confirm">Подтверждение пароля</label>
              <input type="password" id="user-password-confirm" required placeholder="Подтвердите пароль">
            </div>
            <div class="management__actions">
              <button type="submit" class="btn">Создать пользователя</button>
            </div>
          </form>
        </div>
      </div>

      <div id="users-container">
      </div>
    </section>

    <section id="actionLog-section" class="actionLog hidden">
      <div class="actionLog__header">
        <h2 class="actionLog__title">Журнал действий</h2>
      </div>

      <div id="actionLog-container">
        <div class="actionlog__empty" id="empty-logs-message">
          <i class="fas fa-clipboard-list"></i>
          <p>Журнал действий пуст</p>
          <p>Здесь будут отображаться все действия в системе</p>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer container">
    <div class="footer__left">
      <p>© 2025 <span>Company Portal.</span> Учебный проект.</p>
      <p><span>Версия</span> 1.0.0</p>
    </div>
    <div class="footer__right">
      <p>Поддержка</p>
      <a class="footer__email" href="mailto:company-portal_support@gmail.com">company-portal_support@example.com</a>
    </div>
  </footer>

  <script src="../js/app.js"></script>
</body>

</html>