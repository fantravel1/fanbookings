/**
 * FanBookings.com - Main Script
 * Scroll animations, hamburger menu, animated counters, accordion, and interactions
 */

document.addEventListener('DOMContentLoaded', function () {
    initScrollAnimations();
    initNavigation();
    initHamburgerMenu();
    initAccordion();
    initAnimatedCounters();
    initScrollToTop();
    initSmoothScrolling();
    initLinkPrefetch();
});

/**
 * Scroll-triggered animations using IntersectionObserver
 */
function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
        elements.forEach(function (el) { el.classList.add('visible'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
}

/**
 * Navbar scroll behavior
 */
function initNavigation() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;

    var scrollHandler = function () {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler();
}

/**
 * Mobile hamburger menu toggle
 */
function initHamburgerMenu() {
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function () {
        var isOpen = navMenu.classList.toggle('open');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            hamburger.focus();
        }
    });
}

/**
 * Accordion (authority section)
 */
function initAccordion() {
    var triggers = document.querySelectorAll('.accordion-trigger');
    triggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            var expanded = this.getAttribute('aria-expanded') === 'true';
            var content = this.nextElementSibling;

            // Close all other accordions
            triggers.forEach(function (other) {
                if (other !== trigger) {
                    other.setAttribute('aria-expanded', 'false');
                    other.nextElementSibling.style.maxHeight = null;
                }
            });

            // Toggle current
            this.setAttribute('aria-expanded', expanded ? 'false' : 'true');
            if (expanded) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

/**
 * Animated number counters
 */
function initAnimatedCounters() {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
        counters.forEach(function (counter) {
            counter.textContent = counter.getAttribute('data-target');
        });
        return;
    }

    var animated = new Set();

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !animated.has(entry.target)) {
                animated.add(entry.target);
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) { observer.observe(counter); });
}

function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);

        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(eased * target);

        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

/**
 * Scroll-to-top button
 */
function initScrollToTop() {
    var button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.setAttribute('aria-label', 'Scroll to top');
    button.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(button);

    window.addEventListener('scroll', function () {
        if (window.scrollY > 400) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    }, { passive: true });

    button.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href !== '#') {
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

/**
 * Prefetch links on hover for faster navigation
 */
function initLinkPrefetch() {
    var prefetched = new Set();

    document.addEventListener('mouseover', function (e) {
        var link = e.target.closest('a[href]:not([href^="#"])');
        if (link && link.hostname === window.location.hostname && !prefetched.has(link.href)) {
            prefetched.add(link.href);
            var prefetchLink = document.createElement('link');
            prefetchLink.rel = 'prefetch';
            prefetchLink.href = link.href;
            document.head.appendChild(prefetchLink);
        }
    }, true);
}

/**
 * Analytics tracking (non-blocking)
 */
function trackEvent(eventName, eventData) {
    if (window.gtag) {
        gtag('event', eventName, eventData);
    }
}

document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (link) {
        var href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
            trackEvent('link_click', { link_url: href, link_text: link.textContent.trim() });
        }
    }
});
