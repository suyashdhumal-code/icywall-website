/* ═══════════════════════════════════════════════════════════════
   ICYWALL — Main JavaScript
   Handles: Navigation, Scroll animations, Particles, Counter, Form
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileNav();
    initScrollAnimations();
    initParticles();
    initCounters();
    initCursorGlow();
    initContactForm();
    initSmoothScroll();
});

/* ─── Navbar Scroll Effect ─── */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* ─── Mobile Navigation Toggle ─── */
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.classList.toggle('active');

        // Animate hamburger to X
        const spans = toggle.querySelectorAll('span');
        if (toggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close menu on link click
    links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
            const spans = toggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

/* ─── Scroll Reveal Animations ─── */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve — keep the element visible
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animElements = document.querySelectorAll(
        '.section-header, .product-card, .feature-item, .step-card, .pricing-card, .tech-item, .info-card, .scroll-reveal, .capability-card, .changelog-entry'
    );

    animElements.forEach(el => observer.observe(el));
}

/* ─── Floating Particles ─── */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = 30;

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 6}s`;
        particle.style.animationDuration = `${4 + Math.random() * 4}s`;
        particle.style.width = `${2 + Math.random() * 3}px`;
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

/* ─── Animated Counters ─── */
function initCounters() {
    const counters = document.querySelectorAll('[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target || element.dataset.count);
    if (isNaN(target)) return;
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ─── Cursor Glow Effect ─── */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) {
        glow.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function updateGlow() {
        // Smooth lerp
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;

        glow.style.left = `${glowX}px`;
        glow.style.top = `${glowY}px`;

        requestAnimationFrame(updateGlow);
    }

    requestAnimationFrame(updateGlow);
}

/* ─── Contact Form Handler ─── */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', () => {
        const btn = form.querySelector('button[type="submit"]');
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
            </svg>
            <span>Sending...</span>
        `;
        btn.style.opacity = '0.7';
        btn.disabled = true;
    });
}

/* ─── Smooth Scroll for Anchor Links ─── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* ─── Dashboard Preview Hover Effects ─── */
document.querySelectorAll('.device-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.borderColor = 'var(--border-accent)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.borderColor = '';
    });
});
