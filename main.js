// Winbit - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize i18n
    if (window.initI18n) {
        window.initI18n();
    }

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const nav = document.getElementById('nav');
    let scrollLockY = 0;

    const lockPageScroll = () => {
        scrollLockY = window.scrollY || window.pageYOffset;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollLockY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    };

    const unlockPageScroll = () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.scrollTo(0, scrollLockY);
    };

    if (mobileMenuBtn && nav) {
        const openMenu = () => {
            mobileMenuBtn.classList.add('active');
            nav.classList.add('mobile-open');
            lockPageScroll();
            document.body.classList.add('menu-open');
        };

        const closeMenu = () => {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('mobile-open');
            document.body.classList.remove('menu-open');
            unlockPageScroll();
        };

        mobileMenuBtn.addEventListener('click', () => {
            if (nav.classList.contains('mobile-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMenu);
        }

        // Close mobile menu when clicking a link
        nav.querySelectorAll('.nav-link, .mobile-nav-cta').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024 && nav.classList.contains('mobile-open')) {
                closeMenu();
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Inversor* tooltip — posicionado con fixed para escapar cualquier overflow padre
    const inversorTrigger = document.getElementById('inversor-trigger');
    const inversorTooltip = document.getElementById('inversor-tooltip');

    function positionTooltip() {
        if (!inversorTrigger || !inversorTooltip) return;
        const rect = inversorTrigger.getBoundingClientRect();
        const tipW = inversorTooltip.offsetWidth || 240;
        const tipH = inversorTooltip.offsetHeight || 110;
        const gap  = 12;

        // Default: above the trigger, centered
        let top  = rect.top - tipH - gap;
        let left = rect.left + rect.width / 2 - tipW / 2;

        // If it would go off the top, open below instead
        if (top < 8) {
            top = rect.bottom + gap;
            // Flip the arrow
            inversorTooltip.classList.add('tooltip-below');
        } else {
            inversorTooltip.classList.remove('tooltip-below');
        }

        // Clamp horizontally so it doesn't bleed off screen
        const vw = window.innerWidth;
        if (left < 8) left = 8;
        if (left + tipW > vw - 8) left = vw - tipW - 8;

        inversorTooltip.style.top  = `${top}px`;
        inversorTooltip.style.left = `${left}px`;
    }

    if (inversorTrigger) {
        inversorTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = inversorTrigger.classList.toggle('active');
            if (isActive) {
                // Make visible first so offsetWidth/Height are real
                inversorTooltip.style.display = 'block';
                positionTooltip();
            } else {
                inversorTooltip.style.display = 'none';
            }
        });

        // Reposition on scroll/resize in case the trigger moves
        window.addEventListener('scroll', () => {
            if (inversorTrigger.classList.contains('active')) positionTooltip();
        }, { passive: true });
        window.addEventListener('resize', () => {
            if (inversorTrigger.classList.contains('active')) positionTooltip();
        });

        document.addEventListener('click', (e) => {
            if (!inversorTrigger.contains(e.target)) {
                inversorTrigger.classList.remove('active');
                inversorTooltip.style.display = 'none';
            }
        });
    }

    // Header scroll behavior
    const header = document.getElementById('header');
    let lastScrollY = window.scrollY;
    const mobileMediaQuery = window.matchMedia('(max-width: 767px)');

    function updateHeaderState() {
        if (!header) return;
        const currentScrollY = window.scrollY;

        // Mobile: hide on scroll down, show on scroll up.
        if (mobileMediaQuery.matches) {
            header.classList.remove('header-mobile-visible');
            header.classList.add('header-solid');

            // Always show at the very top
            if (currentScrollY <= 10) {
                header.classList.remove('header-hidden');
                return;
            }

            const delta = 8; // ignore tiny scroll jitter
            if (Math.abs(currentScrollY - lastScrollY) < delta) return;

            // Hide only after some scroll so it doesn't flicker near the top
            if (currentScrollY > lastScrollY && currentScrollY > 110) {
                header.classList.add('header-hidden');
            } else if (currentScrollY < lastScrollY) {
                header.classList.remove('header-hidden');
            }
            return;
        }

        // Desktop/tablet: keep previous behavior.
        if (currentScrollY > 50) {
            header.classList.add('header-solid');
        } else {
            header.classList.remove('header-solid');
        }

        if (currentScrollY <= 0) {
            header.classList.remove('header-hidden');
            return;
        }

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }
    }

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        updateHeaderState();
        lastScrollY = currentScrollY;
    });

    window.addEventListener('resize', updateHeaderState);
    updateHeaderState();

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before entering/leaving
        threshold: 0.05 // Trigger as soon as 5% is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('section-header')) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.step-card, .investment-item, .transparency-item, .faq-item, .section-header').forEach(el => {
        if (!el.classList.contains('section-header')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        }
        observer.observe(el);
    });
    // ---- Count-up animation for Resultados Históricos ----
    const countUpEls = document.querySelectorAll('.result-pct[data-value]');

    if (countUpEls.length) {
        const easeOut = t => 1 - Math.pow(1 - t, 3); // cubic ease-out

        function animateCount(el, target, duration) {
            const numEl = el.querySelector('.result-num');
            if (!numEl) return;
            const decimals = target % 1 !== 0 ? 1 : 0;
            let start = null;

            function step(ts) {
                if (!start) start = ts;
                const elapsed = ts - start;
                const progress = Math.min(elapsed / duration, 1);
                const value = easeOut(progress) * target;
                numEl.textContent = value.toFixed(decimals).replace('.', ',');
                if (progress < 1) requestAnimationFrame(step);
                else numEl.textContent = target.toFixed(decimals).replace('.', ',');
            }
            requestAnimationFrame(step);
        }

        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseFloat(el.dataset.value);
                    animateCount(el, target, 900);
                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0.3 });

        countUpEls.forEach(el => countObserver.observe(el));
    }

    // ---- Parallax window: hero → Proceso transition ----
    // The parallax effect is handled purely by CSS (background-attachment: fixed).
    // No JS needed for this element.
});
