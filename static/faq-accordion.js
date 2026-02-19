/**
 * FAQ Accordion Script
 * Управляет открытием/закрытием FAQ элементов
 */

document.addEventListener('DOMContentLoaded', function () {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', function () {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const answer = this.nextElementSibling;

      // Закрыть все остальные FAQ элементы
      faqQuestions.forEach(otherQuestion => {
        if (otherQuestion !== question) {
          otherQuestion.setAttribute('aria-expanded', 'false');
          const otherAnswer = otherQuestion.nextElementSibling;
          if (otherAnswer && otherAnswer.classList.contains('faq-answer')) {
            otherAnswer.style.maxHeight = '0';
            otherAnswer.style.opacity = '0';
          }
        }
      });

      // Переключить текущий элемент
      this.setAttribute('aria-expanded', !isExpanded);

      if (!isExpanded && answer && answer.classList.contains('faq-answer')) {
        // Открыть ответ
        answer.style.opacity = '1';
        setTimeout(() => {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }, 10);
      } else if (answer && answer.classList.contains('faq-answer')) {
        // Закрыть ответ
        answer.style.opacity = '0';
        answer.style.maxHeight = '0';
      }
    });
  });

  // Поддержка навигации через клавиатуру (Tab и Enter)
  faqQuestions.forEach(question => {
    question.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.click();
      }
    });
  });
});

// Анимация при загрузке страницы (для элементов .city-card)
document.addEventListener('DOMContentLoaded', function () {
  const cityCards = document.querySelectorAll('.city-card');
  
  cityCards.forEach((card, index) => {
    card.style.animationDelay = (index * 0.1) + 's';
    card.style.animation = 'slideInUp 0.6s ease-out backwards';
  });
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
