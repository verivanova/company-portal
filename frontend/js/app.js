document.addEventListener('DOMContentLoaded', function () {
  const newsLink = document.getElementById('news-link');
  const tasksLink = document.getElementById('tasks-link');
  const managementLink = document.getElementById('management-link');
  const actionLogLink = document.getElementById('actionLog-link');

  const newsSection = document.getElementById('news-section');
  const tasksSection = document.getElementById('tasks-section');
  const managementSection = document.getElementById('management-section');
  const actionLogSection = document.getElementById('actionLog-section');

  const taskSearch = document.getElementById('task-search');
  const statusFilter = document.getElementById('status-filter');
  const assigneeFilter = document.getElementById('assignee-filter');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskFormContainer = document.getElementById('task-form-container');
  const taskForm = document.getElementById('task-form');

  const addUserBtn = document.getElementById('add-user-btn');
  const userFormContainer = document.getElementById('user-form-container');
  const userForm = document.getElementById('user-form');
  const usersContainer = document.getElementById('users-container');

  const addNewsBtn = document.getElementById('add-news-btn');
  const publishForm = document.getElementById('publish-form');
  const newsForm = document.getElementById('news-form');

  let tasksData = [];

  function switchSection(activeSection, activeLink) {
    if (newsSection) newsSection.classList.add('hidden');
    if (tasksSection) tasksSection.classList.add('hidden');
    if (managementSection) managementSection.classList.add('hidden');
    if (actionLogSection) actionLogSection.classList.add('hidden');

    if (newsLink) newsLink.classList.remove('active');
    if (tasksLink) tasksLink.classList.remove('active');
    if (managementLink) managementLink.classList.remove('active');
    if (actionLogLink) actionLogLink.classList.remove('active');

    if (activeSection) activeSection.classList.remove('hidden');
    if (activeLink) activeLink.classList.add('active');

    if (activeSection === tasksSection) {
      loadTasks();
      populateAssigneeFilter();
    }
    if (activeSection === managementSection) {
      loadUsers();
    }
    if (activeSection === newsSection) {
      loadNews();
    }
    if (activeSection === actionLogSection) {
    loadActionLogs();
    }
  }

  if (newsLink && tasksLink && newsSection && tasksSection) {
    if (newsLink) newsLink.addEventListener('click', () => switchSection(newsSection, newsLink));
    if (tasksLink) tasksLink.addEventListener('click', () => switchSection(tasksSection, tasksLink));
    if (managementLink && managementSection) managementLink.addEventListener('click', () => switchSection(managementSection, managementLink));
    if (actionLogLink && actionLogSection) actionLogLink.addEventListener('click', () => switchSection(actionLogSection, actionLogLink));
    switchSection(newsSection, newsLink);
  }

  async function loadTasks() {
    const container = document.getElementById('tasks-container');
    if (!container) return;
    try {
      const response = await fetch('/backend/get_tasks.php');
      if (!response.ok) throw new Error('Ошибка загрузки');
      const tasks = await response.json();
      tasksData = tasks;
      applyTaskFilters();
    } catch (error) {
      console.error('Ошибка загрузки задач:', error);
    }
  }

  function applyTaskFilters() {
    const searchText = taskSearch?.value.toLowerCase() || '';
    const statusVal = statusFilter?.value || 'all';
    const assigneeVal = assigneeFilter?.value || 'all';

    const filtered = tasksData.filter(task => {
      const matchesSearch = searchText === '' ||
        task.title.toLowerCase().includes(searchText) ||
        task.description.toLowerCase().includes(searchText);
      let matchesStatus = true;
      if (statusVal === 'completed') matchesStatus = task.status === 'completed';
      else if (statusVal === 'not_completed') matchesStatus = task.status === 'not_completed';
      let matchesAssignee = true;
      if (assigneeVal !== 'all') matchesAssignee = task.assigneeId == assigneeVal;
      return matchesSearch && matchesStatus && matchesAssignee;
    });
    renderTasks(filtered, document.getElementById('tasks-container'));
  }

  async function populateAssigneeFilter() {
    try {
      const response = await fetch('/backend/get_users.php');
      const users = await response.json();
      const select = assigneeFilter;
      if (!select) return;
      const currentValue = select.value;
      select.innerHTML = '<option value="all">Все ответственные</option>';
      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.fullName;
        select.appendChild(option);
      });
      if (currentValue) select.value = currentValue;
    } catch (error) {
      console.error('Ошибка загрузки пользователей для фильтра:', error);
    }
  }

  if (taskSearch) taskSearch.addEventListener('input', applyTaskFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyTaskFilters);
  if (assigneeFilter) assigneeFilter.addEventListener('change', applyTaskFilters);

function renderTasks(tasks, container) {
    if (!container) return;
    container.innerHTML = '';
    if (tasks.length === 0) {
      container.innerHTML = '<p>Нет задач</p>';
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    tasks.forEach(task => {
      const deadlineDate = new Date(task.deadline);
      deadlineDate.setHours(0, 0, 0, 0);
      const isOverdue = (deadlineDate < today) && (task.status !== 'completed');

      const deadlineFormatted = new Date(task.deadline).toLocaleDateString('ru-RU');
      const canEditDelete = (currentUserRole === 'admin' || parseInt(task.managerId) === currentUserId);
      const canToggleStatus = canEditDelete;

      const taskHTML = `
        <div class="tasks__item ${isOverdue ? 'tasks__item--overdue' : ''}" data-id="${task.id}">
          <div class="tasks__item-header">
            <h3>${escapeHtml(task.title)}</h3>
            ${canEditDelete ? `
            <div class="tasks__actions">
              <button class="task-action-btn edit-task" title="Редактировать"><i class="fas fa-edit"></i></button>
              <button class="task-action-btn delete-task" title="Удалить"><i class="fas fa-trash"></i></button>
            </div>
            ` : ''}
          </div>
          <p>${escapeHtml(task.description)}</p>
          <div class="tasks__details">
            <div class="tasks__detail"><strong>Постановщик:</strong> ${escapeHtml(task.managerName)}</div>
            <div class="tasks__detail"><strong>Ответственный:</strong> ${escapeHtml(task.assigneeName)}</div>
            <div class="tasks__detail"><strong>Срок:</strong> ${deadlineFormatted}</div>
          </div>
          <div class="tasks__footer">
            <div class="tasks__status ${task.status === 'completed' ? 'tasks__status-completed' : 'tasks__status-not'}">
              ${task.status === 'completed' ? 'Выполнена' : (isOverdue ? 'Просрочена' : 'Не выполнена')}
            </div>
            ${canToggleStatus ? `
            <button class="btn tasks__success tasks__status-change">${task.status === 'completed' ? 'Вернуть в работу' : 'Отметить выполненной'}</button>
            ` : ''}
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', taskHTML);
    });
}

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  async function populateUserSelects() {
    try {
      const response = await fetch('/backend/get_users.php');
      const users = await response.json();
      const managerSelect = document.getElementById('task-manager');
      const assigneeSelect = document.getElementById('task-assignee');
      if (managerSelect) {
        managerSelect.innerHTML = '<option value="">Выберите постановщика</option>';
        users.forEach(user => {
          const opt = document.createElement('option');
          opt.value = user.id;
          opt.textContent = user.fullName;
          managerSelect.appendChild(opt);
        });
      }
      if (assigneeSelect) {
        assigneeSelect.innerHTML = '<option value="">Выберите ответственного</option>';
        users.forEach(user => {
          const opt = document.createElement('option');
          opt.value = user.id;
          opt.textContent = user.fullName;
          assigneeSelect.appendChild(opt);
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  }

  function getMaxDate() {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split('T')[0];
  }

  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', function () {
      taskFormContainer.classList.toggle('hidden');
      if (!taskFormContainer.classList.contains('hidden')) {
        document.getElementById('task-title').focus();
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('task-deadline').min = today;
        document.getElementById('task-deadline').max = getMaxDate();
        populateUserSelects();
      }
    });
  }

  if (taskForm) {
    taskForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const taskId = document.getElementById('task-id')?.value;
      const title = document.getElementById('task-title').value;
      const description = document.getElementById('task-description').value;
      const managerId = document.getElementById('task-manager').value;
      const assigneeId = document.getElementById('task-assignee').value;
      const deadline = document.getElementById('task-deadline').value;

      if (!title || !managerId || !assigneeId || !deadline) {
        alert('Заполните все поля');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('manager_id', managerId);
      formData.append('assignee_id', assigneeId);
      formData.append('deadline', deadline);
      if (taskId) formData.append('id', taskId);

      const url = taskId ? '/backend/update_task.php' : '/backend/add_task.php';

      try {
        const response = await fetch(url, { method: 'POST', body: formData });
        const result = await response.json();
        if (result.success) {
          taskForm.reset();
          document.getElementById('task-id').value = '';
          document.getElementById('task-form-title').textContent = 'Создание новой задачи';
          document.getElementById('task-submit-btn').textContent = 'Создать задачу';
          taskFormContainer.classList.add('hidden');
          loadTasks();
          if (typeof addActionLog === 'function') {
            addActionLog(taskId ? 'Задача обновлена' : 'Задача создана', result.message);
          }
        } else {
          alert('Ошибка: ' + result.message);
        }
      } catch (error) {
        console.error('Ошибка отправки задачи:', error);
        alert('Произошла ошибка при обращении к серверу');
      }
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.edit-task')) {
      const taskItem = e.target.closest('.tasks__item');
      editTask(taskItem);
    }
    if (e.target.closest('.delete-task')) {
      const taskItem = e.target.closest('.tasks__item');
      deleteTask(taskItem);
    }
    if (e.target.closest('.tasks__status-change')) {
      const taskItem = e.target.closest('.tasks__item');
      toggleTaskStatus(taskItem);
    }
  });

  async function editTask(taskElement) {
    const taskId = taskElement.dataset.id;
    if (!taskId) return;
    try {
      const response = await fetch('/backend/get_tasks.php');
      const tasks = await response.json();
      const task = tasks.find(t => t.id == taskId);
      if (!task) {
        alert('Задача не найдена');
        return;
      }
      document.getElementById('task-title').value = task.title;
      document.getElementById('task-description').value = task.description;
      document.getElementById('task-manager').value = task.managerId;
      document.getElementById('task-assignee').value = task.assigneeId;
      document.getElementById('task-deadline').value = task.deadline;
      document.getElementById('task-id').value = task.id;
      document.getElementById('task-form-title').textContent = 'Редактирование задачи';
      document.getElementById('task-submit-btn').textContent = 'Сохранить изменения';
      taskFormContainer.classList.remove('hidden');
      document.getElementById('task-title').focus();
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('task-deadline').min = today;
      document.getElementById('task-deadline').max = getMaxDate();
      await populateUserSelects();
    } catch (error) {
      console.error('Ошибка редактирования:', error);
    }
  }

  async function deleteTask(taskElement) {
    const taskId = taskElement.dataset.id;
    if (!taskId) return;
    if (!confirm('Удалить задачу?')) return;
    const formData = new FormData();
    formData.append('id', taskId);
    try {
      const response = await fetch('/backend/delete_task.php', { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        taskElement.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => loadTasks(), 300);
        if (typeof addActionLog === 'function') addActionLog('Задача удалена', result.message);
      } else {
        alert('Ошибка: ' + result.message);
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  }

  async function toggleTaskStatus(taskElement) {
    const taskId = taskElement.dataset.id;
    if (!taskId) return;
    const formData = new FormData();
    formData.append('id', taskId);
    try {
      const response = await fetch('/backend/toggle_task_status.php', { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        loadTasks();
        if (typeof addActionLog === 'function') addActionLog('Статус задачи изменён', result.message);
      } else {
        alert('Ошибка: ' + result.message);
      }
    } catch (error) {
      console.error('Ошибка смены статуса:', error);
    }
  }


  const newsContainer = document.getElementById('news-container');

  if (addNewsBtn) {
    addNewsBtn.addEventListener('click', function () {
      publishForm.classList.toggle('hidden');
      if (!publishForm.classList.contains('hidden')) document.getElementById('news-title').focus();
    });
  }

  if (newsForm) {
    newsForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const title = document.getElementById('news-title').value.trim();
      const content = document.getElementById('news-content').value.trim();
      if (!title || !content) {
        alert('Заполните заголовок и содержание');
        return;
      }
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      try {
        const response = await fetch('/backend/add_news.php', { method: 'POST', body: formData });
        const result = await response.json();
        if (result.success) {
          newsForm.reset();
          publishForm.classList.add('hidden');
          loadNews();
          if (typeof addActionLog === 'function') addActionLog('Новость добавлена', result.message);
        } else {
          alert('Ошибка: ' + result.message);
        }
      } catch (error) {
        console.error('Ошибка добавления новости:', error);
      }
    });
  }

  async function loadNews() {
    if (!newsContainer) return;
    try {
      const response = await fetch('/backend/get_news.php');
      if (!response.ok) throw new Error('Ошибка загрузки');
      const news = await response.json();
      renderNews(news, newsContainer);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    }
  }

  function renderNews(newsArray, container) {
    container.innerHTML = '';
    if (newsArray.length === 0) {
      container.innerHTML = '<p>Новостей пока нет</p>';
      return;
    }
    newsArray.forEach(item => {
      const canDelete = (currentUserRole === 'admin' || item.authorId === currentUserId);
      const newsHTML = `
          <div class="news__item" data-id="${item.id}">
            <div class="news__item-header">
              <h3>${escapeHtml(item.title)}</h3>
              ${canDelete ? `
              <div class="news__actions">
                <button class="news__btn btn news__delete-news" title="Удалить новость"><i class="fas fa-trash"></i></button>
              </div>
              ` : ''}
            </div>
            <p>${escapeHtml(item.content)}</p>
            <div class="news__meta">
              <span>Автор: ${escapeHtml(item.authorName)}</span>
              <span class="news__date">${item.createdAt}</span>
            </div>
          </div>
        `;
      container.insertAdjacentHTML('beforeend', newsHTML);
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.news__delete-news')) {
      const newsItem = e.target.closest('.news__item');
      deleteNewsItem(newsItem);
    }
  });

  async function deleteNewsItem(newsElement) {
    const newsId = newsElement.dataset.id;
    if (!newsId) return;
    if (!confirm('Удалить новость?')) return;
    const formData = new FormData();
    formData.append('id', newsId);
    try {
      const response = await fetch('/backend/delete_news.php', { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        newsElement.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => loadNews(), 300);
        if (typeof addActionLog === 'function') addActionLog('Новость удалена', result.message);
      } else {
        alert('Ошибка: ' + result.message);
      }
    } catch (error) {
      console.error('Ошибка удаления новости:', error);
    }
  }

  if (addUserBtn && userFormContainer) {
    addUserBtn.addEventListener('click', function () {
      userFormContainer.classList.toggle('hidden');
      if (!userFormContainer.classList.contains('hidden')) document.getElementById('user-fullname').focus();
    });
  }

  if (userForm) {
    userForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const fullName = document.getElementById('user-fullname').value;
      const email = document.getElementById('user-email').value;
      const role = document.getElementById('user-role').value;
      const password = document.getElementById('user-password').value;
      const passwordConfirm = document.getElementById('user-password-confirm').value;

      if (password !== passwordConfirm) {
        alert('Пароли не совпадают!');
        return;
      }

      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('email', email);
      formData.append('role', role);
      formData.append('password', password);
      formData.append('password_confirm', passwordConfirm);

      fetch('/backend/register.php', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            userForm.reset();
            userFormContainer.classList.add('hidden');
            loadUsers();
            if (typeof addActionLog === 'function') {
              addActionLog('Пользователь добавлен', `${fullName} (${role === 'admin' ? 'Администратор' : 'Сотрудник'})`);
            }
          } else {
            alert('Ошибка: ' + result.message);
          }
        })
        .catch(error => {
          console.error('Ошибка:', error);
          alert('Произошла ошибка');
        });
    });
  }

  function loadUsers() {
    if (!usersContainer) return;
    fetch('/backend/get_users.php', { credentials: 'same-origin' })
      .then(response => {
        if (!response.ok) throw new Error('Ошибка ' + response.status);
        return response.json();
      })
      .then(data => {
        users = data;
        renderUsers(users);
      })
      .catch(error => {
        console.error('Ошибка загрузки пользователей:', error);
        usersContainer.innerHTML = '<p style="color:red;">Ошибка загрузки</p>';
      });
  }

  function renderUsers(usersArray) {
    if (!usersContainer) return;
    usersContainer.innerHTML = '';
    if (usersArray.length === 0) {
      usersContainer.innerHTML = `
            <div class="management__empty">
              <i class="fas fa-users"></i>
              <p>Пользователи не найдены</p>
              <p style="font-size: 14px; margin-top: 8px;">Добавьте первого пользователя</p>
            </div>
          `;
      return;
    }
    usersArray.forEach(user => {
      const isLockedClass = user.isLocked ? 'locked' : '';
      const lockStatus = user.isLocked ? 'Заблокирован' : 'Активен';
      const statusClass = user.isLocked ? 'lock-status locked' : 'lock-status active';
      const lockIcon = user.isLocked ? 'fa-lock-open' : 'fa-lock';
      const lockTitle = user.isLocked ? 'Разблокировать' : 'Заблокировать';
      const lockBtnClass = user.isLocked ? 'unlock-btn' : 'lock-btn';
      const userHTML = `
            <div class="management__item ${isLockedClass}" data-id="${user.id}">
              <div class="management__item-header">
                <h3>${user.fullName}</h3>
                <div class="management__actions">
                  <button class="user-action-btn ${lockBtnClass}" title="${lockTitle}"><i class="fas ${lockIcon}"></i></button>
                  <button class="user-action-btn delete-btn" title="Удалить"><i class="fas fa-trash"></i></button>
                </div>
              </div>
              <div class="management__details">
                <div class="management__detail"><strong>Email:</strong> ${user.email}</div>
                <div class="management__detail"><strong>Роль:</strong> ${user.role === 'admin' ? 'Администратор' : 'Сотрудник'}</div>
                <div class="management__detail"><strong>Дата добавления:</strong> ${user.dateCreated}</div>
              </div>
              <div class="${statusClass}">${lockStatus}</div>
            </div>
          `;
      usersContainer.insertAdjacentHTML('beforeend', userHTML);
    });
  }

  document.addEventListener('click', function (e) {
    const lockBtn = e.target.closest('.lock-btn') || e.target.closest('.unlock-btn');
    if (lockBtn) {
      const userItem = lockBtn.closest('.management__item');
      toggleUserLock(userItem);
    }
    if (e.target.closest('.delete-btn')) {
      const userItem = e.target.closest('.management__item');
      deleteUser(userItem);
    }
  });

  async function toggleUserLock(userElement) {
    if (!userElement) return;
    const userId = parseInt(userElement.dataset.id);
    if (isNaN(userId)) return;
    const confirmText = userElement.classList.contains('locked')
      ? 'Разблокировать пользователя?'
      : 'Заблокировать пользователя?';
    if (!confirm(confirmText)) return;
    const formData = new FormData();
    formData.append('id', userId);
    try {
      const response = await fetch('/backend/toggle_lock.php', { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        loadUsers();
        if (typeof addActionLog === 'function') addActionLog('Изменение блокировки', result.message);
      } else {
        alert('Ошибка: ' + result.message);
      }
    } catch (error) {
      console.error('Ошибка блокировки:', error);
    }
  }

  async function deleteUser(userElement) {
    if (!userElement) return;
    const userId = parseInt(userElement.dataset.id);
    if (isNaN(userId)) return;
    if (!confirm('Удалить пользователя безвозвратно?')) return;
    const formData = new FormData();
    formData.append('id', userId);
    try {
      const response = await fetch('/backend/delete_user.php', { method: 'POST', body: formData });
      const result = await response.json();
      if (result.success) {
        userElement.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => loadUsers(), 300);
        if (typeof addActionLog === 'function') addActionLog('Пользователь удалён', result.message);
      } else {
        alert('Ошибка: ' + result.message);
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  }

  async function loadActionLogs() {
    const container = document.getElementById('actionLog-container');
    const emptyMessage = document.getElementById('empty-logs-message');
    if (!container) return;

    try {
        const response = await fetch('/backend/get_action_logs.php');
        if (!response.ok) throw new Error('Ошибка загрузки');
        const logs = await response.json();
        renderActionLogs(logs, container, emptyMessage);
    } catch (error) {
        console.error('Ошибка загрузки журнала:', error);
    }
}

function renderActionLogs(logs, container, emptyMessage) {
    container.innerHTML = '';
    if (logs.length === 0) {
        if (emptyMessage) emptyMessage.classList.remove('hidden');
        return;
    }
    if (emptyMessage) emptyMessage.classList.add('hidden');

    logs.forEach(log => {
        const logHTML = `
          <div class="log-item">
            <div class="log-icon"><i class="fas fa-user-cog"></i></div>
            <div class="log-content">
              <div class="log-header">
                <span class="log-action">${escapeHtml(log.action)}</span>
                <span class="log-time">${log.createdAt}</span>
              </div>
              <p class="log-details">${escapeHtml(log.description)}</p>
              <div class="log-user">Выполнил: ${escapeHtml(log.userName)}</div>
            </div>
          </div>
        `;
        container.insertAdjacentHTML('beforeend', logHTML);
    });
}

  if (newsContainer) {
    loadNews();
}
});