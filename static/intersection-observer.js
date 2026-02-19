/**
 * Intersection Observer для lazy loading изображений и fade-in анимаций
 */

document.addEventListener('DOMContentLoaded', function () {
  // ===== Lazy Loading Images =====
  
  const imageObserverOptions = {
    threshold: 0.1,
    rootMargin: '50px'
  };

  const imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Проверяем наличие data-src
        if (img.dataset.src) {
          // Создаём новый тег img для загрузки с обработкой ошибок
          const newImg = new Image();
          newImg.onload = function () {
            img.src = newImg.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          };
          newImg.onerror = function () {
            // Fallback на src если data-src не загружается
            console.warn('Failed to load image:', img.dataset.src);
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          };
          newImg.src = img.dataset.src;
        } else {
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      }
    });
  }, imageObserverOptions);

  // Наблюдаем за всеми lazy-load изображениями
  document.querySelectorAll('img[loading="lazy"][data-src]').forEach(img => {
    imageObserver.observe(img);
  });

  // Также обрабатываем обычные lazy-load изображения браузера
  if ('loading' in HTMLImageElement.prototype) {
    // Браузер поддерживает native lazy loading
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      if (!img.dataset.src) {
        img.classList.add('loaded'); // Браузер сам загружает
      }
    });
  }

  // ===== Fade-in Animations на скролл =====
  
  const fadeInObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeInObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        // Добавляем задержку для каскадного эффекта
        const delay = element.dataset.delay ? parseFloat(element.dataset.delay) * 100 : 0;
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          element.classList.add('fade-in-visible');
        }, delay);
        // Останавливаем наблюдение после того как элемент стал видимым
        fadeInObserver.unobserve(element);
      }
    });
  }, fadeInObserverOptions);

  // Наблюдаем за всеми элементами с классом fade-in
  document.querySelectorAll('[data-fade-in]').forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    // Устанавливаем data-delay если отсутствует
    if (!element.dataset.delay) {
      element.dataset.delay = (index * 0.1);
    }
    fadeInObserver.observe(element);
  });

  // ===== Picture Element WebP Support =====
  
  // Функция для проверки поддержки WebP
  function supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  }

  const hasWebP = supportsWebP();
  
  // Обновляем источники картинок если браузер поддерживает WebP
  document.querySelectorAll('picture source[data-srcset-webp]').forEach(source => {
    if (hasWebP) {
      source.srcset = source.dataset.srcsetWebp;
    }
  });

  // ===== Мониторинг загрузки картинок =====
  
  window.addEventListener('load', function () {
    // Отмечаем все загруженные картинки
    document.querySelectorAll('img').forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      }
    });
  });

  // Также слушаем событие load на каждом img
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function () {
      this.classList.add('loaded');
    });
  });

  console.log(`WebP support: ${hasWebP}`);
  console.log(`Lazy loading enabled for ${document.querySelectorAll('img[loading="lazy"]').length} images`);
});
