const slider = document.querySelector('.video-slider');
const slides = document.querySelectorAll('.video-slide');
const dots = document.querySelectorAll('.dot');
const overlays = document.querySelectorAll('.video-overlay');
const prevButton = document.querySelector('.nav-arrow.prev');
const nextButton = document.querySelector('.nav-arrow.next');
let currentIndex = 0;

function updateSlides() {
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        dots[index].classList.remove('active');

        if (index === currentIndex) {
            slide.classList.add('active');
            slide.style.transform = 'translateX(0) scale(1)';
            slide.style.zIndex = '3';
        } else if (index === (currentIndex + 1) % slides.length) {
            slide.style.transform = 'translateX(15%) scale(0.8)';
            slide.style.zIndex = '2';
        } else if (index === (currentIndex + 2) % slides.length) {
            slide.style.transform = 'translateX(30%) scale(0.6)';
            slide.style.zIndex = '1';
        } else {
            slide.style.transform = 'translateX(150%) scale(0.8)';
            slide.style.zIndex = '0';
        }
    });

    dots[currentIndex].classList.add('active');
}

function handleOverlayClick(e) {
    const overlay = e.target;
    overlay.classList.add('hidden');
    setTimeout(() => {
        const iframe = overlay.previousElementSibling;
        const iframeSrc = iframe.src;
        iframe.src = iframeSrc;
    }, 50);
}

function navigateSlider(direction) {
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % slides.length;
    } else {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    }
    updateSlides();
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        currentIndex = parseInt(dot.dataset.index);
        updateSlides();
    });
});

overlays.forEach(overlay => {
    overlay.addEventListener('click', handleOverlayClick);
});

prevButton.addEventListener('click', () => navigateSlider('prev'));
nextButton.addEventListener('click', () => navigateSlider('next'));

// Reactivar overlays cuando se hace clic fuera del video
document.addEventListener('click', (e) => {
    if (!e.target.closest('.video-slide') && !e.target.closest('.nav-arrow')) {
        overlays.forEach(overlay => overlay.classList.remove('hidden'));
    }
});

updateSlides();