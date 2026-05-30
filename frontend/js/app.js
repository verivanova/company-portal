document.addEventListener('DOMContentLoaded', function() {
  const newsLink = document.getElementById('news-link');
  const tasksLink = document.getElementById('tasks-link');
  const managementLink = document.getElementById('management-link');
  const actionLogLink = document.getElementById('actionLog-link');
  
  const newsSection = document.getElementById('news-section');
  const tasksSection = document.getElementById('tasks-section');
  const managementSection = document.getElementById('management-section');
  const actionLogSection = document.getElementById('actionLog-section');

if (newsLink && tasksLink && newsSection && tasksSection) {
    
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

    if (activeSection === managementSection) {
        loadUsers();
    }
}
    
    if (newsLink) {
        newsLink.addEventListener('click', function() {
            switchSection(newsSection, newsLink);
        });
    }
    
    if (tasksLink) {
        tasksLink.addEventListener('click', function() {
            switchSection(tasksSection, tasksLink);
        });
    }

    if (managementLink && managementSection) {
        managementLink.addEventListener('click', function() {
            switchSection(managementSection, managementLink);
        });
    }
    
    if (actionLogLink && actionLogSection) {
        actionLogLink.addEventListener('click', function() {
            switchSection(actionLogSection, actionLogLink);
        });
    }
    
    switchSection(newsSection, newsLink);
}  const addNewsBtn = document.getElementById('add-news-btn');
  const publishForm = document.getElementById('publish-form');

  addNewsBtn.addEventListener('click', function() {
    publishForm.classList.toggle('hidden');
    
    if (!publishForm.classList.contains('hidden')) {
      document.getElementById('news-title').focus();
    }
  });

  const addTaskBtn = document.getElementById('add-task-btn');
  const taskFormContainer = document.getElementById('task-form-container');
  const taskForm = document.getElementById('task-form');
  const taskSearch = document.getElementById('task-search');
  const statusFilter = document.getElementById('status-filter');
  const assigneeFilter = document.getElementById('assignee-filter');

  addTaskBtn.addEventListener('click', function() {
    taskFormContainer.classList.toggle('hidden');
    
    if (!taskFormContainer.classList.contains('hidden')) {
      document.getElementById('task-title').focus();
      
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('task-deadline').min = today;
    }
  });

  taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const manager = document.getElementById('task-manager').value;
    const assignee = document.getElementById('task-assignee').value;
    const deadline = document.getElementById('task-deadline').value;
    
    createNewTask(title, description, manager, assignee, deadline);
    
    taskFormContainer.classList.add('hidden');
    taskForm.reset();
  });

  taskSearch.addEventListener('input', filterTasks);
  statusFilter.addEventListener('change', filterTasks);
  assigneeFilter.addEventListener('change', filterTasks);

  function filterTasks() {
    const searchText = taskSearch.value.toLowerCase();
    const statusValue = statusFilter.value;
    const assigneeValue = assigneeFilter.value;
    
    const tasks = document.querySelectorAll('.tasks__item');
    
    tasks.forEach(task => {
      const title = task.querySelector('h3').textContent.toLowerCase();
      const description = task.querySelector('p').textContent.toLowerCase();
      const assigneeElement = task.querySelector('.tasks__detail:nth-child(2)');
      const assignee = assigneeElement ? assigneeElement.textContent.replace('Ответственный:', '').trim().toLowerCase() : '';
      const deadlineElement = task.querySelector('.tasks__detail:nth-child(3)');
      const deadline = deadlineElement ? deadlineElement.textContent.replace('Срок:', '').trim().toLowerCase() : '';
      const status = task.querySelector('.tasks__status').textContent.toLowerCase();
      
      const matchesSearch = searchText === '' || 
        title.includes(searchText) || 
        description.includes(searchText) ||
        assignee.includes(searchText) ||
        deadline.includes(searchText);
      
      let matchesStatus = true;
      if (statusValue === 'completed') {
        matchesStatus = status === 'выполнена'; 
      } else if (statusValue === 'not-completed') {
        matchesStatus = status === 'не выполнена';
      }
      
      let matchesAssignee = true;
      if (assigneeValue !== 'all') {
        matchesAssignee = assignee.includes(assigneeValue.toLowerCase());
      }
      
      if (matchesSearch && matchesStatus && matchesAssignee) {
        task.style.display = 'block';
      } else {
        task.style.display = 'none';
      }
    });
  }

  function createNewTask(title, description, manager, assignee, deadline) {
    const taskId = Date.now().toString(); 
    const formattedDeadline = new Date(deadline).toLocaleDateString('ru-RU');
    
    const taskHTML = `
      <div class="tasks__item" data-id="${taskId}">
        <div class="tasks__item-header">
          <h3>${title}</h3>
          <div class="tasks__actions">
            <button class="task-action-btn edit-task" title="Редактировать задачу">
              <i class="fas fa-edit"></i>
            </button>
            <button class="task-action-btn delete-task" title="Удалить задачу">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <p>${description}</p>
        <div class="tasks__details">
          <div class="tasks__detail">
            <strong>Постановщик:</strong> ${manager}
          </div>
          <div class="tasks__detail">
            <strong>Ответственный:</strong> ${assignee}
          </div>
          <div class="tasks__detail">
            <strong>Срок:</strong> ${formattedDeadline}
          </div>
        </div>
        <div class="tasks__footer">
          <div class="tasks__status tasks__status-not">Не выполнена</div>
          <button class="btn tasks__success tasks__status-change">Отметить выполненной</button>
        </div>
      </div>
    `;
    
    document.getElementById('tasks-container').insertAdjacentHTML('afterbegin', taskHTML);
    
    filterTasks();
  }

  document.addEventListener('click', function(e) {
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

  function editTask(taskElement) {
    const title = taskElement.querySelector('h3').textContent;
    const description = taskElement.querySelector('p').textContent;
    const manager = taskElement.querySelector('.tasks__detail:nth-child(1)').textContent.replace('Постановщик: ', '');
    const assignee = taskElement.querySelector('.tasks__detail:nth-child(2)').textContent.replace('Ответственный: ', '');
    const deadline = taskElement.querySelector('.tasks__detail:nth-child(3)').textContent.replace('Срок: ', '');
    
    const [day, month, year] = deadline.split(' ');
    const months = {
      'января': '01', 'февраля': '02', 'марта': '03', 'апреля': '04',
      'мая': '05', 'июня': '06', 'июля': '07', 'августа': '08',
      'сентября': '09', 'октября': '10', 'ноября': '11', 'декабря': '12'
    };

    const deadlineDate = `${year}-${months[month]}-${day.padStart(2, '0')}`;

    document.getElementById('task-form-title').textContent = 'Редактирование задачи';
    document.getElementById('task-submit-btn').textContent = 'Сохранить изменения';

    document.getElementById('task-title').value = title;
    document.getElementById('task-description').value = description;
    document.getElementById('task-manager').value = manager;
    document.getElementById('task-assignee').value = assignee;
    document.getElementById('task-deadline').value = deadlineDate;
    
    taskFormContainer.classList.remove('hidden');
    document.getElementById('task-title').focus();
    
    taskForm.onsubmit = function(e) {
      e.preventDefault();
      
      const newTitle = document.getElementById('task-title').value;
      const newDescription = document.getElementById('task-description').value;
      const newManager = document.getElementById('task-manager').value;
      const newAssignee = document.getElementById('task-assignee').value;
      const newDeadline = document.getElementById('task-deadline').value;
      
      updateTask(taskElement, newTitle, newDescription, newManager, newAssignee, newDeadline);
      
      taskFormContainer.classList.add('hidden');
      taskForm.reset();
      document.getElementById('task-form-title').textContent = 'Создание новой задачи';
      document.getElementById('task-submit-btn').textContent = 'Создать задачу';
      
      taskElement.remove();
    };
  }

  function updateTask(taskElement, title, description, manager, assignee, deadline) {
    const formattedDeadline = new Date(deadline).toLocaleDateString('ru-RU');
    
    taskElement.querySelector('h3').textContent = title;
    taskElement.querySelector('p').textContent = description;
    taskElement.querySelector('.tasks__detail:nth-child(1)').innerHTML = `<strong>Постановщик:</strong> ${manager}`;
    taskElement.querySelector('.tasks__detail:nth-child(2)').innerHTML = `<strong>Ответственный:</strong> ${assignee}`;
    taskElement.querySelector('.tasks__detail:nth-child(3)').innerHTML = `<strong>Срок:</strong> ${formattedDeadline}`;
    
    filterTasks();
  }

  function deleteTask(taskElement) {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      taskElement.remove();
    }
  }

  function toggleTaskStatus(taskElement) {
    const statusElement = taskElement.querySelector('.tasks__status');
    const buttonElement = taskElement.querySelector('.tasks__status-change');
    
    if (statusElement.classList.contains('tasks__status-not')) {
      statusElement.textContent = 'Выполнена';
      statusElement.className = 'tasks__status tasks__status-completed';
      buttonElement.textContent = 'Вернуть в работу';
      buttonElement.className = 'btn btn-secondary  tasks__status-change';
    } else {
      statusElement.textContent = 'Не выполнена';
      statusElement.className = 'tasks__status tasks__status-not';
      buttonElement.textContent = 'Отметить выполненной';
      buttonElement.className = 'btn tasks__success tasks__status-change';
    }
    
    filterTasks();
  };

  const newsForm = document.getElementById('news-form');

  newsForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('news-title').value;
    const content = document.getElementById('news-content').value;
    
    if (title.trim() && content.trim()) {
      createNewsItem(title, content);
      
      newsForm.reset();
      publishForm.classList.add('hidden');
    }
  });

  function createNewsItem(title, content) {
    const newsId = Date.now().toString();
    const currentDate = new Date().toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    
    const newsHTML = `
      <div class="news__item" data-id="${newsId}">
        <div class="news__item-header">
          <h3>${title}</h3>
          <div class="news__actions">
            <button class="news__btn btn news__delete-news" title="Удалить новость">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <p>${content}</p>
        <div class="news__date">${currentDate}</div>
      </div>
    `;
    
    document.getElementById('news-container').insertAdjacentHTML('afterbegin', newsHTML);
  }

  document.addEventListener('click', function(e) {
    if (e.target.closest('.news__delete-news')) {
      const newsItem = e.target.closest('.news__item');
      deleteNews(newsItem);
    }
  });

  function deleteNews(newsElement) {
    if (confirm('Вы уверены, что хотите удалить эту новость?')) {
      newsElement.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        newsElement.remove();
      }, 300);
    }
  }

  const addUserBtn = document.getElementById('add-user-btn');
  const userFormContainer = document.getElementById('user-form-container');
  const userForm = document.getElementById('user-form');
  const usersContainer = document.getElementById('users-container');

function loadUsers() {
    if (!usersContainer) return;
    fetch('/backend/get_users.php')
        .then(response => response.json())
        .then(data => {
            users = data; 
            renderUsers(users);
        })
        .catch(error => {
            console.error('Ошибка загрузки пользователей:', error);
            usersContainer.innerHTML = '<p style="color:red;">Ошибка загрузки списка пользователей</p>';
        });
}

function renderUsers(usersArray) {
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
        const lockTitle = user.isLocked ? 'Разблокировать пользователя' : 'Заблокировать пользователя';
        const lockBtnClass = user.isLocked ? 'unlock-btn' : 'lock-btn';

        const userHTML = `
          <div class="management__item ${isLockedClass}" data-id="${user.id}">
            <div class="management__item-header">
              <h3>${user.fullName}</h3>
              <div class="management__actions">
                <button class="user-action-btn ${lockBtnClass}" title="${lockTitle}">
                  <i class="fas ${lockIcon}"></i>
                </button>
                <button class="user-action-btn delete-btn" title="Удалить пользователя">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="management__details">
              <div class="management__detail">
                <strong>Email:</strong> ${user.email}
              </div>
              <div class="management__detail">
                <strong>Роль:</strong> ${user.role === 'admin' ? 'Администратор' : 'Сотрудник'}
              </div>
              <div class="management__detail">
                <strong>Дата добавления:</strong> ${user.dateCreated}
              </div>
            </div>
            <div class="${statusClass}">${lockStatus}</div>
          </div>
        `;
        usersContainer.insertAdjacentHTML('beforeend', userHTML);
    });
}
  if (addUserBtn && userFormContainer) {
    addUserBtn.addEventListener('click', function() {
      userFormContainer.classList.toggle('hidden');
      
      if (!userFormContainer.classList.contains('hidden')) {
        document.getElementById('user-fullname').focus();
      }
    });
  }

if (userForm) {
    userForm.addEventListener('submit', function(e) {
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

        fetch('/backend/register.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                userForm.reset();
                userFormContainer.classList.add('hidden');

                loadUsers();

                if (typeof addActionLog === 'function') {
                    addActionLog('Пользователь добавлен', `Добавлен новый пользователь: ${fullName} (${role === 'admin' ? 'Администратор' : 'Сотрудник'})`);
                }
            } else {
                alert('Ошибка: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при отправке данных');
        });
    });
}

function loadUsers() {
    console.log('loadUsers выполняется');
    if (!usersContainer) {
        console.error('usersContainer не найден!');
        return;
    }

    fetch('/backend/get_users.php', { credentials: 'same-origin' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети или сервера: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Получены пользователи:', data);
            users = data;
            renderUsers(users);
        })
        .catch(error => {
            console.error('Ошибка загрузки пользователей:', error);
            usersContainer.innerHTML = '<p style="color:red;">Ошибка загрузки списка пользователей</p>';
        });
}

  document.addEventListener('click', function(e) {
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

  function toggleUserLock(userElement) {
    if (!userElement) return;
    
    const userId = parseInt(userElement.dataset.id);
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) return;
    
    users[userIndex].isLocked = !users[userIndex].isLocked;
    const user = users[userIndex];
    
    loadUsers();
    
    const action = user.isLocked ? 'Пользователь заблокирован' : 'Пользователь разблокирован';
    addActionLog(action, `${user.fullName} (${user.email})`);
    
    alert(user.isLocked ? 
      'Пользователь заблокирован. Доступ к системе ограничен.' : 
      'Пользователь разблокирован. Доступ восстановлен.'
    );
  }

  function deleteUser(userElement) {
    if (!userElement) return;
    
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    
    const userId = parseInt(userElement.dataset.id);
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) return;
    
    const deletedUser = users[userIndex];
    
    users = users.filter(user => user.id !== userId);
    
    userElement.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      userElement.remove();
      
      if (users.length === 0) {
        loadUsers();
      }
    }, 300);
    
    addActionLog('Пользователь удален', `${deletedUser.fullName} (${deletedUser.email})`);
  }

  loadUsers();

  function addActionLog(action, details) {
    const logContainer = document.getElementById('actionLog-container');
    const emptyLogsMessage = document.getElementById('empty-logs-message');
    
    if (!logContainer) return;
    
    if (emptyLogsMessage) {
      emptyLogsMessage.classList.add('hidden');
    }
    
    const currentTime = new Date().toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    const logHTML = `
      <div class="log-item">
        <div class="log-icon">
          <i class="fas fa-user-cog"></i>
        </div>
        <div class="log-content">
          <div class="log-header">
            <span class="log-action">${action}</span>
            <span class="log-time">${currentTime}</span>
          </div>
          <p class="log-details">${details}</p>
          <div class="log-date">${currentDate}</div>
        </div>
      </div>
    `;
    
    logContainer.insertAdjacentHTML('afterbegin', logHTML);
  }

});