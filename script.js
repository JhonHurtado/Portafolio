/**
 * ============================================
 * PORTFOLIO PREMIUM - JAVASCRIPT AVANZADO
 * Jhon Sebastian Hurtado Suárez
 * Versión: 2.0 - Ultra Premium
 * ============================================
 */

'use strict';

// ============================================
// UTILIDADES
// ============================================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const debounce = (fn, ms = 100) => {
    let t;
    return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};
const throttle = (fn, ms = 100) => {
    let t = false;
    return (...a) => { if (!t) { fn(...a); t = true; setTimeout(() => t = false, ms); } };
};
const lerp = (a, b, n) => (1 - n) * a + n * b;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// ============================================
// CURSOR PERSONALIZADO PREMIUM
// ============================================
const CustomCursor = {
    dot: null,
    outline: null,
    posX: 0,
    posY: 0,
    mouseX: 0,
    mouseY: 0,
    isHovering: false,
    isClicking: false,
    isEnabled: true,

    init() {
        if (window.innerWidth <= 768 || 'ontouchstart' in window) {
            this.isEnabled = false;
            return;
        }

        this.createElements();
        this.bindEvents();
        this.animate();
        document.body.style.cursor = 'none';
    },

    createElements() {
        this.dot = document.createElement('div');
        this.dot.className = 'cursor-dot';
        document.body.appendChild(this.dot);

        this.outline = document.createElement('div');
        this.outline.className = 'cursor-outline';
        document.body.appendChild(this.outline);
    },

    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        document.addEventListener('mousedown', () => {
            this.isClicking = true;
            this.outline.classList.add('clicking');
        });

        document.addEventListener('mouseup', () => {
            this.isClicking = false;
            this.outline.classList.remove('clicking');
        });

        // Hover effects
        const hoverElements = $$('a, button, input, textarea, .card-3d, .tech-tag, [role="button"]');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.outline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.outline.classList.remove('hover');
            });
        });

        // Hide when leaving window
        document.addEventListener('mouseleave', () => {
            this.dot.style.opacity = '0';
            this.outline.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.dot.style.opacity = '1';
            this.outline.style.opacity = '1';
        });
    },

    animate() {
        if (!this.isEnabled) return;

        this.posX = lerp(this.posX, this.mouseX, 0.15);
        this.posY = lerp(this.posY, this.mouseY, 0.15);

        this.dot.style.transform = `translate(${this.mouseX - 4}px, ${this.mouseY - 4}px)`;
        this.outline.style.transform = `translate(${this.posX - 20}px, ${this.posY - 20}px)`;

        requestAnimationFrame(() => this.animate());
    }
};

// ============================================
// TEMA OSCURO / CLARO
// ============================================
const ThemeManager = {
    STORAGE_KEY: 'portfolio-theme',

    init() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (saved === 'dark' || (!saved && prefersDark)) {
            document.documentElement.classList.add('dark');
        }

        this.bindToggle();
        this.watchSystem();
    },

    bindToggle() {
        const btn = $('#theme-toggle');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem(this.STORAGE_KEY, isDark ? 'dark' : 'light');

            // Animation
            btn.style.transform = 'scale(0.8) rotate(180deg)';
            setTimeout(() => btn.style.transform = '', 300);
        });
    },

    watchSystem() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem(this.STORAGE_KEY)) {
                document.documentElement.classList.toggle('dark', e.matches);
            }
        });
    }
};

// ============================================
// NAVBAR PREMIUM
// ============================================
const Navbar = {
    el: null,
    mobileMenu: null,
    mobileBtn: null,
    lastScroll: 0,
    isHidden: false,

    init() {
        this.el = $('#navbar');
        this.mobileMenu = $('#mobile-menu');
        this.mobileBtn = $('#mobile-menu-btn');

        if (!this.el) return;

        this.bindScroll();
        this.bindMobileMenu();
        this.bindActiveLinks();
    },

    bindScroll() {
        const handle = throttle(() => {
            const scroll = window.scrollY;

            // Add/remove scrolled class
            this.el.classList.toggle('scrolled', scroll > 50);

            // Hide/show on scroll direction
            if (scroll > 300) {
                if (scroll > this.lastScroll && !this.isHidden) {
                    this.el.style.transform = 'translateY(-100%)';
                    this.isHidden = true;
                } else if (scroll < this.lastScroll && this.isHidden) {
                    this.el.style.transform = 'translateY(0)';
                    this.isHidden = false;
                }
            } else {
                this.el.style.transform = 'translateY(0)';
                this.isHidden = false;
            }

            this.lastScroll = scroll;
        }, 50);

        window.addEventListener('scroll', handle);
    },

    bindMobileMenu() {
        if (!this.mobileBtn || !this.mobileMenu) return;

        this.mobileBtn.addEventListener('click', () => this.toggleMobile());

        // Close on link click
        this.mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMobile());
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.mobileMenu.contains(e.target) &&
                !this.mobileBtn.contains(e.target) &&
                !this.mobileMenu.classList.contains('hidden')) {
                this.closeMobile();
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMobile();
        });
    },

    toggleMobile() {
        this.mobileMenu.classList.toggle('hidden');
        const bars = $('#menu-icon-bars');
        const close = $('#menu-icon-close');
        bars.classList.toggle('hidden');
        close.classList.toggle('hidden');
    },

    closeMobile() {
        this.mobileMenu.classList.add('hidden');
        $('#menu-icon-bars')?.classList.remove('hidden');
        $('#menu-icon-close')?.classList.add('hidden');
    },

    bindActiveLinks() {
        const sections = $$('section[id]');
        const links = $$('.nav-link');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    links.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, { rootMargin: '-20% 0px -70% 0px' });

        sections.forEach(sec => observer.observe(sec));
    }
};

// ============================================
// SMOOTH SCROLL
// ============================================
const SmoothScroll = {
    init() {
        $$('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const target = $(link.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    const offset = $('#navbar')?.offsetHeight || 80;
                    const pos = target.getBoundingClientRect().top + window.scrollY - offset - 20;
                    window.scrollTo({ top: pos, behavior: 'smooth' });
                }
            });
        });
    }
};

// ============================================
// SCROLL TO TOP
// ============================================
const ScrollToTop = {
    btn: null,

    init() {
        this.btn = $('#scroll-top');
        if (!this.btn) return;

        window.addEventListener('scroll', throttle(() => {
            this.btn.classList.toggle('visible', window.scrollY > 400);
        }, 100));

        this.btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
};

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const ScrollReveal = {
    init() {
        const elements = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(el => observer.observe(el));
    }
};

// ============================================
// TYPING EFFECT
// ============================================
const TypingEffect = {
    init(elementId, texts, options = {}) {
        const el = $(elementId);
        if (!el) return;

        const {
            typeSpeed = 100,
            deleteSpeed = 50,
            delayBetween = 2000,
            loop = true
        } = options;

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        // Add cursor
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        el.parentNode.insertBefore(cursor, el.nextSibling);

        const type = () => {
            const currentText = texts[textIndex];

            if (isDeleting) {
                el.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                el.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let timeout = isDeleting ? deleteSpeed : typeSpeed;

            if (!isDeleting && charIndex === currentText.length) {
                timeout = delayBetween;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = loop ? (textIndex + 1) % texts.length : Math.min(textIndex + 1, texts.length - 1);
                timeout = 500;
            }

            setTimeout(type, timeout);
        };

        setTimeout(type, 1000);
    }
};

// ============================================
// TILT EFFECT (3D Cards)
// ============================================
const TiltEffect = {
    init() {
        const cards = $$('.card-3d');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }
};

// ============================================
// MAGNETIC BUTTONS
// ============================================
const MagneticEffect = {
    init() {
        const btns = $$('.magnetic-btn');

        btns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
};

// ============================================
// PARALLAX EFFECT
// ============================================
const ParallaxEffect = {
    init() {
        const elements = $$('[data-parallax]');
        if (!elements.length) return;

        window.addEventListener('scroll', throttle(() => {
            const scrollY = window.scrollY;

            elements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const offset = scrollY * speed;
                el.style.transform = `translateY(${offset}px)`;
            });
        }, 16));
    }
};

// ============================================
// COUNTER ANIMATION
// ============================================
const CounterAnimation = {
    init() {
        const counters = $$('[data-counter]');
        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(c => observer.observe(c));
    },

    animate(el) {
        const target = parseInt(el.dataset.counter);
        const duration = parseInt(el.dataset.duration) || 2000;
        const suffix = el.dataset.suffix || '';
        const start = performance.now();

        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * ease);

            el.textContent = current + suffix;

            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    }
};

// ============================================
// SKILL BARS
// ============================================
const SkillBars = {
    init() {
        const bars = $$('.skill-bar');
        if (!bars.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        bars.forEach(bar => observer.observe(bar));
    }
};

// ============================================
// CONTACT FORM - Formspree Integration
// ============================================
const ContactForm = {
    form: null,
    fields: {},
    errors: {},

    init() {
        this.form = $('#contact-form');
        if (!this.form) return;

        this.fields = {
            name: $('#name'),
            email: $('#email'),
            subject: $('#subject'),
            message: $('#message')
        };

        this.errors = {
            name: $('#name-error'),
            email: $('#email-error'),
            subject: $('#subject-error'),
            message: $('#message-error')
        };

        this.bindEvents();
    },

    bindEvents() {
        Object.keys(this.fields).forEach(name => {
            const field = this.fields[name];
            if (!field) return;

            field.addEventListener('blur', () => this.validateField(name));
            field.addEventListener('input', () => this.clearError(name));
        });

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    validateField(name) {
        const field = this.fields[name];
        if (!field) return true;

        const value = field.value.trim();
        let valid = true;
        let msg = '';

        switch (name) {
            case 'name':
                if (value.length < 2) {
                    valid = false;
                    msg = 'El nombre debe tener al menos 2 caracteres';
                }
                break;
            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    valid = false;
                    msg = 'Ingresa un correo electrónico válido';
                }
                break;
            case 'subject':
                if (value.length < 3) {
                    valid = false;
                    msg = 'El asunto debe tener al menos 3 caracteres';
                }
                break;
            case 'message':
                if (value.length < 10) {
                    valid = false;
                    msg = 'El mensaje debe tener al menos 10 caracteres';
                }
                break;
        }

        if (!valid) {
            this.showError(name, msg);
        } else {
            this.clearError(name);
            field.classList.add('success');
        }

        return valid;
    },

    showError(name, msg) {
        const field = this.fields[name];
        const error = this.errors[name];

        if (field) {
            field.classList.add('error');
            field.classList.remove('success');
        }

        if (error) {
            error.textContent = msg;
            error.classList.remove('hidden');
        }
    },

    clearError(name) {
        const field = this.fields[name];
        const error = this.errors[name];

        if (field) field.classList.remove('error');
        if (error) error.classList.add('hidden');
    },

    validateAll() {
        return Object.keys(this.fields).every(name => this.validateField(name));
    },

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateAll()) {
            const firstError = this.form.querySelector('.error');
            if (firstError) firstError.focus();
            return;
        }

        const btn = this.form.querySelector('button[type="submit"]');
        const btnText = $('#btn-text');
        const btnIcon = $('#btn-icon');
        const btnLoading = $('#btn-loading');
        const success = $('#form-success');
        const errorDiv = $('#form-error');

        // Loading state
        btn.disabled = true;
        btnText.textContent = 'Enviando...';
        btnIcon?.classList.add('hidden');
        btnLoading?.classList.remove('hidden');
        errorDiv?.classList.add('hidden');
        success?.classList.add('hidden');

        try {
            // Enviar a Formspree via AJAX
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: new FormData(this.form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                success?.classList.remove('hidden');
                this.form.reset();

                // Reset success state de los campos
                Object.keys(this.fields).forEach(name => {
                    if (this.fields[name]) {
                        this.fields[name].classList.remove('success');
                    }
                });

                // Ocultar mensaje de éxito después de 5 segundos
                setTimeout(() => success?.classList.add('hidden'), 5000);
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Error al enviar el mensaje');
            }

        } catch (err) {
            console.error('Error al enviar formulario:', err);

            // Mostrar mensaje de error
            if (errorDiv) {
                errorDiv.classList.remove('hidden');
            }
        } finally {
            btn.disabled = false;
            btnText.textContent = 'Enviar Mensaje';
            btnIcon?.classList.remove('hidden');
            btnLoading?.classList.add('hidden');
        }
    }
};

// ============================================
// PARTICLES GENERATOR
// ============================================
const Particles = {
    init() {
        const container = $('.particles-container');
        if (!container) return;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${10 + Math.random() * 10}s`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.width = `${4 + Math.random() * 4}px`;
            particle.style.height = particle.style.width;
            container.appendChild(particle);
        }
    }
};

// ============================================
// LAZY LOAD IMAGES
// ============================================
const LazyLoad = {
    init() {
        const images = $$('img[data-src]');
        if (!images.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });

        images.forEach(img => observer.observe(img));
    }
};

// ============================================
// DYNAMIC YEAR
// ============================================
const DynamicYear = {
    init() {
        const el = $('#current-year');
        if (el) el.textContent = new Date().getFullYear();
    }
};

// ============================================
// CV DOWNLOAD
// ============================================
const CVDownload = {
    init() {
        const btn = $('#download-cv');
        if (!btn) return;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Open CV in new tab for printing
            const win = window.open('./assets/cvjhonhurtado.html', '_blank');
            if (win) {
                win.addEventListener('load', () => {
                    setTimeout(() => win.print(), 500);
                });
            }
        });
    }
};

// ============================================
// RIPPLE EFFECT
// ============================================
const RippleEffect = {
    init() {
        const btns = $$('.btn-primary, .btn-ripple');

        btns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');

                ripple.style.cssText = `
                    position: absolute;
                    background: rgba(255,255,255,0.3);
                    border-radius: 50%;
                    pointer-events: none;
                    width: 100px;
                    height: 100px;
                    left: ${e.clientX - rect.left - 50}px;
                    top: ${e.clientY - rect.top - 50}px;
                    animation: ripple 0.6s ease-out;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
};

// ============================================
// TEXTO HERO CON TYPING
// ============================================
const HeroTyping = {
    init() {
        const roles = [
            'Desarrollador Full Stack',
            'Desarrollador Backend',
            'Desarrollador Frontend',
            'Desarrollador Android',
            'Ingeniero de Software'
        ];

        const el = $('#typing-role');
        if (el) {
            TypingEffect.init('#typing-role', roles, {
                typeSpeed: 80,
                deleteSpeed: 40,
                delayBetween: 2500
            });
        }
    }
};

// ============================================
// INITIALIZE EVERYTHING
// ============================================
const init = () => {
    // Core
    ThemeManager.init();
    Navbar.init();
    SmoothScroll.init();
    ScrollToTop.init();
    ScrollReveal.init();
    DynamicYear.init();

    // Effects
    CustomCursor.init();
    TiltEffect.init();
    MagneticEffect.init();
    ParallaxEffect.init();
    RippleEffect.init();
    Particles.init();

    // Content
    ContactForm.init();
    CounterAnimation.init();
    SkillBars.init();
    LazyLoad.init();
    CVDownload.init();
    HeroTyping.init();


};

// Run
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export
window.Portfolio = {
    ThemeManager,
    Navbar,
    ContactForm,
    TypingEffect,
    TiltEffect,
    CustomCursor
};
