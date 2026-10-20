/**
 * ==========================================================================
 * main.js
 * Presentation Controller, Keyboard Navigation & Event Listeners
 * ==========================================================================
 */

let currentSlide = 1;
const totalSlides = 8;

// DOM Elements
let slides, prevBtn, nextBtn, slideCounter, dotsContainer;

/**
 * Initialize presentation logic and bindings
 */
function initPresentation() {
  slides = document.querySelectorAll('.slide');
  prevBtn = document.getElementById('prev-btn');
  nextBtn = document.getElementById('next-btn');
  slideCounter = document.getElementById('slide-counter');
  dotsContainer = document.getElementById('dots-container');

  if (!slides.length || !prevBtn || !nextBtn || !dotsContainer) return;

  // Build dots navigation dynamically
  dotsContainer.innerHTML = '';
  for (let i = 1; i <= totalSlides; i++) {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Ir a diapositiva ${i}`);
    dot.className = `dot-indicator h-2.5 rounded-full ${i === 1 ? 'dot-indicator active w-6 bg-slate-900' : 'w-2.5 bg-slate-300 hover:bg-slate-400'}`;
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  // Button event listeners
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Keyboard navigation listener
  window.addEventListener('keydown', handleKeyDown);

  // Initialize UI
  updateSlideUI();
}

/**
 * Update UI for current slide state
 */
function updateSlideUI() {
  slides.forEach((slide, idx) => {
    const slideNum = idx + 1;
    if (slideNum === currentSlide) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  if (slideCounter) {
    slideCounter.textContent = currentSlide;
  }

  // Update navigation buttons status
  if (prevBtn) prevBtn.disabled = currentSlide === 1;
  if (nextBtn) nextBtn.disabled = currentSlide === totalSlides;

  // Update dots status
  if (dotsContainer) {
    const dots = dotsContainer.children;
    Array.from(dots).forEach((dot, idx) => {
      if (idx + 1 === currentSlide) {
        dot.className = 'dot-indicator active w-6 h-2.5 rounded-full bg-slate-900';
      } else {
        dot.className = 'dot-indicator w-2.5 h-2.5 rounded-full bg-slate-300 hover:bg-slate-400';
      }
    });
  }

  // Trigger pulse effect in 3D canvas
  if (typeof triggerSlideParticlePulse === 'function') {
    triggerSlideParticlePulse();
  }
}

/**
 * Navigate to a specific slide number
 * @param {number} n
 */
function goToSlide(n) {
  if (n >= 1 && n <= totalSlides) {
    currentSlide = n;
    updateSlideUI();
  }
}

/**
 * Navigate to next slide
 */
function nextSlide() {
  if (currentSlide < totalSlides) {
    currentSlide++;
    updateSlideUI();
  }
}

/**
 * Navigate to previous slide
 */
function prevSlide() {
  if (currentSlide > 1) {
    currentSlide--;
    updateSlideUI();
  }
}

/**
 * Keyboard shortcuts handler
 * @param {KeyboardEvent} e
 */
function handleKeyDown(e) {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    prevSlide();
  } else if (e.key === 'Home') {
    e.preventDefault();
    goToSlide(1);
  } else if (e.key === 'End') {
    e.preventDefault();
    goToSlide(totalSlides);
  }
}

// Window load bootstrap
window.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // Initialize 3D background simulation
  if (typeof initThree === 'function') {
    initThree();
  }
  if (typeof animateThree === 'function') {
    animateThree();
  }

  // Initialize Presentation logic
  initPresentation();
});
