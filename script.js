const header = document.querySelector('.header');
const heroWrapper = document.querySelector('.hero-wrapper');

// Переключение показа всех услуг
const toggleServicesBtn = document.getElementById('toggleServices');
const servicesSection = document.querySelector('.services');
const toggleText = toggleServicesBtn.querySelector('.toggle-text');

toggleServicesBtn.addEventListener('click', () => {
    servicesSection.classList.toggle('expanded');
    
    if (servicesSection.classList.contains('expanded')) {
        toggleText.textContent = 'Скрыть услуги';
    } else {
        toggleText.textContent = 'Показать все услуги';
        // Прокручиваем к началу секции услуг
        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// Бургер меню
const burger = document.querySelector('.header__burger');
const nav = document.querySelector('.header__nav');
const navLinks = document.querySelectorAll('.nav-link');

function toggleMenu() {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
}

burger.addEventListener('click', toggleMenu);

// Закрыть меню по клику на клавиши меню
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Закрыть меню по клику вокруг
document.addEventListener('click', (e) => {
    if (nav.classList.contains('active') && 
        !nav.contains(e.target) && 
        !burger.contains(e.target)) {
        toggleMenu();
    }
});

// Scroll indicator click
const scrollIndicator = document.querySelector('.hero__scroll');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const servicesSection = document.querySelector('#services');
        if (servicesSection) {
            const headerHeight = header.offsetHeight;
            const targetPosition = servicesSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with fade-in animation
const animatedElements = document.querySelectorAll('.service-card, .stat-card, .gallery__item, .contact-item');
animatedElements.forEach(el => {
    observer.observe(el);
});

// Lazy loading for images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Parallax effect for hero background
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5;
    
    if (heroWrapper) {
        heroWrapper.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
    }
    
    ticking = false;
}

function requestParallaxUpdate() {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestParallaxUpdate);

// Form validation (if you add a contact form later)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Gallery Lightbox
const galleryItemsAll = document.querySelectorAll('.gallery__item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('.lightbox__image');
const lightboxCaption = lightbox.querySelector('.lightbox__caption');
const lightboxClose = lightbox.querySelector('.lightbox__close');
const lightboxPrev = lightbox.querySelector('.lightbox__prev');
const lightboxNext = lightbox.querySelector('.lightbox__next');
const lightboxCurrent = lightbox.querySelector('.lightbox__current');
const lightboxTotal = lightbox.querySelector('.lightbox__total');

let currentImageIndex = 0;
const galleryImages = [];

// Собираем все изображения в массив
galleryItemsAll.forEach((item, index) => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery__overlay span');
    
    galleryImages.push({
        src: img.src,
        alt: img.alt,
        caption: caption ? caption.textContent : ''
    });
    
    // Открытие lightbox по клику
    item.addEventListener('click', () => {
        openLightbox(index);
    });
});

// Установка общего количества фото
lightboxTotal.textContent = galleryImages.length;

function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const image = galleryImages[currentImageIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.caption;
    lightboxCurrent.textContent = currentImageIndex + 1;
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

// События для кнопок
lightboxClose.addEventListener('click', closeLightbox);
lightboxNext.addEventListener('click', showNextImage);
lightboxPrev.addEventListener('click', showPrevImage);

// Закрытие по клику на фон
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Навигация с клавиатуры
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowRight') {
        showNextImage();
    } else if (e.key === 'ArrowLeft') {
        showPrevImage();
    }
});

// Свайп для мобильных устройств
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        showNextImage();
    }
    if (touchEndX > touchStartX + 50) {
        showPrevImage();
    }
}
