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
    });