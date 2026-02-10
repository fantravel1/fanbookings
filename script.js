/**
 * FanBookings.com - Main Script
 * Minimal JS for smooth interactions while maintaining Core Web Vitals
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeSmoothScrolling();
    initializeNavigation();
    initializeLazyLoading();
});

/**
 * Smooth scroll to anchor links
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Mobile navigation handling
 */
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            // Scrolling up
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
}

/**
 * Native lazy loading enhancement for older browsers
 */
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Image is already loading with native lazy loading
                    img.addEventListener('load', function() {
                        img.classList.add('loaded');
                    });

                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Prefetch links on hover for better performance
 */
document.addEventListener('mouseover', function(event) {
    const link = event.target.closest('a[href]:not([href^="#"])');
    if (link && link.hostname === window.location.hostname) {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
    }
}, true);

/**
 * Scroll to top button functionality
 */
function addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        font-size: 24px;
        font-weight: bold;
        z-index: 99;
        opacity: 0.8;
        transition: all 0.3s ease;
    `;

    document.body.appendChild(scrollButton);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    });

    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    scrollButton.addEventListener('mouseover', function() {
        this.style.opacity = '1';
    });

    scrollButton.addEventListener('mouseout', function() {
        this.style.opacity = '0.8';
    });
}

addScrollToTopButton();

/**
 * Performance monitoring
 */
if (window.performance && window.performance.timing) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

            // Log performance metrics for monitoring
            console.log('Page load time: ' + pageLoadTime + 'ms');

            // Send to analytics if needed
            if (window.sendBeacon) {
                const beacon = {
                    type: 'performance',
                    loadTime: pageLoadTime,
                    timestamp: new Date().toISOString()
                };
                // navigator.sendBeacon('/api/metrics', JSON.stringify(beacon));
            }
        }, 0);
    });
}

/**
 * Service Worker registration for PWA support
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js').catch(function(err) {
        //     console.log('ServiceWorker registration failed: ', err);
        // });
    });
}

/**
 * Prevent layout shift for images
 */
window.addEventListener('load', function() {
    document.querySelectorAll('img').forEach(img => {
        if (!img.width || !img.height) {
            img.addEventListener('load', function() {
                this.dataset.loaded = 'true';
            });
        }
    });
});

/**
 * Analytics tracking
 */
function trackEvent(eventName, eventData) {
    if (window.gtag) {
        gtag('event', eventName, eventData);
    }
}

// Track page views
document.addEventListener('click', function(event) {
    const link = event.target.closest('a[href]');
    if (link && !link.target) {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
            trackEvent('link_click', {
                link_url: href,
                link_text: link.textContent
            });
        }
    }
});

console.log('FanBookings.com loaded successfully');
