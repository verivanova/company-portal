document.addEventListener('DOMContentLoaded', function() {
  const newsLink = document.getElementById('news-link');
  const tasksLink = document.getElementById('tasks-link');
  const newsSection = document.getElementById('news-section');
  const tasksSection = document.getElementById('tasks-section');
  
  function switchSection(activeSection, activeLink) {
    newsSection.classList.add('hidden');
    tasksSection.classList.add('hidden');
    
    newsLink.classList.remove('active');
    tasksLink.classList.remove('active');
    
    activeSection.classList.remove('hidden');
    activeLink.classList.add('active');
  }
  
  newsLink.addEventListener('click', function() {
    switchSection(newsSection, newsLink);
  });
  
  tasksLink.addEventListener('click', function() {
    switchSection(tasksSection, tasksLink);
  });
  
  switchSection(newsSection, newsLink);

  const addNewsBtn = document.getElementById('add-news-btn');
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
    
    const tasks = document.querySelectorAll('.task-item');
    
    tasks.forEach(task => {
      const title = task.querySelector('h3').textContent.toLowerCase();
      const description = task.querySelector('p').textContent.toLowerCase();
      const assigneeElement = task.querySelector('.task-detail:nth-child(2)');
      const assignee = assigneeElement ? assigneeElement.textContent.replace('Ответственный:', '').trim().toLowerCase() : '';
      const deadlineElement = task.querySelector('.task-detail:nth-child(3)');
      const deadline = deadlineElement ? deadlineElement.textContent.replace('Срок:', '').trim().toLowerCase() : '';
      const status = task.querySelector('.task-status').textContent.toLowerCase();
      
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
      <div class="task-item" data-id="${taskId}">
        <div class="task-header">
          <h3>${title}</h3>
          <div class="task-actions">
            <button class="task-action-btn edit-task" title="Редактировать задачу">
              <i class="fas fa-edit"></i>
            </button>
            <button class="task-action-btn delete-task" title="Удалить задачу">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <p>${description}</p>
        <div class="task-details">
          <div class="task-detail">
            <strong>Постановщик:</strong> ${manager}
          </div>
          <div class="task-detail">
            <strong>Ответственный:</strong> ${assignee}
          </div>
          <div class="task-detail">
            <strong>Срок:</strong> ${formattedDeadline}
          </div>
        </div>
        <div class="task-footer">
          <div class="task-status status-not-completed">Не выполнена</div>
          <button class="btn btn-success change-status-btn">Отметить выполненной</button>
        </div>
      </div>
    `;
    
    document.getElementById('tasks-container').insertAdjacentHTML('afterbegin', taskHTML);
    
    filterTasks();
  }

  document.addEventListener('click', function(e) {
    if (e.target.closest('.edit-task')) {
      const taskItem = e.target.closest('.task-item');
      editTask(taskItem);
    }
    
    if (e.target.closest('.delete-task')) {
      const taskItem = e.target.closest('.task-item');
      deleteTask(taskItem);
    }
    
    if (e.target.closest('.change-status-btn')) {
      const taskItem = e.target.closest('.task-item');
      toggleTaskStatus(taskItem);
    }
  });

  function editTask(taskElement) {
    const title = taskElement.querySelector('h3').textContent;
    const description = taskElement.querySelector('p').textContent;
    const manager = taskElement.querySelector('.task-detail:nth-child(1)').textContent.replace('Постановщик: ', '');
    const assignee = taskElement.querySelector('.task-detail:nth-child(2)').textContent.replace('Ответственный: ', '');
    const deadline = taskElement.querySelector('.task-detail:nth-child(3)').textContent.replace('Срок: ', '');
    
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
    taskElement.querySelector('.task-detail:nth-child(1)').innerHTML = `<strong>Постановщик:</strong> ${manager}`;
    taskElement.querySelector('.task-detail:nth-child(2)').innerHTML = `<strong>Ответственный:</strong> ${assignee}`;
    taskElement.querySelector('.task-detail:nth-child(3)').innerHTML = `<strong>Срок:</strong> ${formattedDeadline}`;
    
    filterTasks();
  }

  function deleteTask(taskElement) {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      taskElement.remove();
    }
  }

  function toggleTaskStatus(taskElement) {
    const statusElement = taskElement.querySelector('.task-status');
    const buttonElement = taskElement.querySelector('.change-status-btn');
    
    if (statusElement.classList.contains('status-not-completed')) {
      statusElement.textContent = 'Выполнена';
      statusElement.className = 'task-status status-completed';
      buttonElement.textContent = 'Вернуть в работу';
      buttonElement.className = 'btn btn-secondary change-status-btn';
    } else {
      statusElement.textContent = 'Не выполнена';
      statusElement.className = 'task-status status-not-completed';
      buttonElement.textContent = 'Отметить выполненной';
      buttonElement.className = 'btn btn-success change-status-btn';
    }
    
    filterTasks();
  }
});

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
    <div class="news-item" data-id="${newsId}">
      <div class="news-header">
        <h3>${title}</h3>
        <div class="news-actions">
          <button class="news-action-btn delete-news" title="Удалить новость">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <p>${content}</p>
      <div class="news-footer">
        <div class="news-date">${currentDate}</div>
      </div>
    </div>
  `;
  
  document.getElementById('news-container').insertAdjacentHTML('afterbegin', newsHTML);
}

document.addEventListener('click', function(e) {
  if (e.target.closest('.delete-news')) {
    const newsItem = e.target.closest('.news-item');
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