<?php
session_start();
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'user') {
    header('Location: /frontend/html/index.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Company Portal | Сотрудник</title>
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <header class="header">
    <div class="header__inner container second-header">
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
            <a id="actionLog-link" class="header__menu-link">Журнал действий</a>
          </li>
          <li class="header__menu-item">
            <button id="themeToggle" class="theme-toggle" title="Переключить тему">
              <i class="fas fa-moon"></i>
            </button>
          </li>
          <li class="header__menu-item">
            <a href="#login" class="btn header__btn-login"><?= htmlspecialchars($_SESSION['full_name']) ?></a>
          </li>
          <li class="header__menu-item">
            <a href="/backend/logout.php" class="btn header__btn-logout ">Выйти</a>
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
            <input type="text" id="news-title" name="news" required placeholder="Введите заголовок новости">
          </div>
          <div class="news__inner">
            <label for="news-content">Содержание новости</label>
            <textarea id="news-content" name="news-text" required placeholder="Введите текст новости"></textarea>
          </div>
          <button type="submit" class="btn">Опубликовать новость</button>
        </form>
        </div>
      </div>
      
      <div id="news-container">
      </div>
      
    </section>

<section id="tasks-section" class="tasks hidden">
  <div class="tasks__header">
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
        <input type="hidden" id="task-id" name="id" value="">
        <div class="news__inner">
          <label for="task-title">Название задачи</label>
          <input type="text" id="task-title" required placeholder="Введите название задачи">
        </div>
        <div class="news__inner">
          <label for="task-description">Описание задачи</label>
          <textarea id="task-description" class="tasks__descr" required placeholder="Введите описание задачи"></textarea>
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
      <p>© 2025 <span>Company Portal.</span>  Учебный проект.</p>
      <p><span>Версия</span> 1.0.0</p>
    </div>
    <div class="footer__right">
      <p>Поддержка</p>
      <a class="footer__email" href="mailto:company-portal_support@gmail.com">company-portal_support@example.com</a>
    </div>
  </footer>

  <script>
    const currentUserId = <?= json_encode($_SESSION['user_id']) ?>;
    const currentUserRole = <?= json_encode($_SESSION['role']) ?>;
    // Переключение между разделами
    document.getElementById('news-link').addEventListener('click', function() {
      document.getElementById('news-section').classList.remove('hidden');
      document.getElementById('tasks-section').classList.add('hidden');
      this.classList.add('active');
      document.getElementById('tasks-link').classList.remove('active');
    });

    document.getElementById('tasks-link').addEventListener('click', function() {
      document.getElementById('tasks-section').classList.remove('hidden');
      document.getElementById('news-section').classList.add('hidden');
      this.classList.add('active');
      document.getElementById('news-link').classList.remove('active');
    });
  </script>
  <script src="../js/app.js"></script>
</body>
</html>