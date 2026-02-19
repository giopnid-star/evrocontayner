// Получить текущую тему из localStorage или использовать 'dark' по умолчанию
function getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        return savedTheme;
    }
    // Проверить системное предпочтение
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'dark';
}

// Применить тему
function applyTheme(theme) {
    const root = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');

    if (theme === 'dark') {
        root.classList.add('dark-mode');
        if (themeBtn) {
            const moonIcon = themeBtn.querySelector('.moon-icon');
            const sunIcon = themeBtn.querySelector('.sun-icon');
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIcon) sunIcon.style.display = 'block';
        }
    } else {
        root.classList.remove('dark-mode');
        if (themeBtn) {
            const moonIcon = themeBtn.querySelector('.moon-icon');
            const sunIcon = themeBtn.querySelector('.sun-icon');
            if (moonIcon) moonIcon.style.display = 'block';
            if (sunIcon) sunIcon.style.display = 'none';
        }
    }

    // Сохранить в localStorage
    localStorage.setItem('theme', theme);
}

// Переключить тему
function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

// Инициализировать при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    const theme = getCurrentTheme();
    applyTheme(theme);

    // Добавить обработчик клика на кнопку переключения
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
});

// Если скрипт загружается после DOMContentLoaded
if (document.readyState !== 'loading') {
    const theme = getCurrentTheme();
    applyTheme(theme);

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
}
