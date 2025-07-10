// Enhanced JavaScript for OROKY Website

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeIntersectionObserver();
    initializeFormHandling();
    initializeBlogFilters();
    initializeNewsletterForm();
    initializeScrollEffects();
    initializeCounterAnimations();
    initializeLazyLoading();
    initializeAccessibility();
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
});

// Navigation
function initializeNavigation() {
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            document.body.classList.toggle('nav-open');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            }
        });
    }

    // Navbar scroll effect
    const handleNavScroll = throttle(() => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, 100);

    window.addEventListener('scroll', handleNavScroll);

    // Active link highlighting
    const updateActiveLink = () => {
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath || 
                (currentPath === '/' && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    };

    updateActiveLink();
}

// Smooth Scrolling
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 100; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        const handleParallax = throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }, 16);

        window.addEventListener('scroll', handleParallax);
    }
}

// Intersection Observer for Animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation for stats
                if (entry.target.classList.contains('stat-card') || 
                    entry.target.classList.contains('stat-item')) {
                    animateCounters(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .service-card, .testimonial-card, .value-card, .team-member, 
        .blog-card, .stat-card, .stat-item, .feature-item, .step,
        .mission-card, .vision-card, .related-card
    `);
    
    animatedElements.forEach(el => observer.observe(el));
}

// Scroll Animations
function initializeScrollAnimations() {
    const scrollElements = document.querySelectorAll('.fade-in, .scale-in');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    };

    const handleScrollAnimation = throttle(() => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            }
        });
    }, 100);

    window.addEventListener('scroll', handleScrollAnimation);
}

// Counter Animations
function initializeCounterAnimations() {
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current >= target) {
                element.textContent = formatNumber(target);
            } else {
                element.textContent = formatNumber(Math.floor(current));
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toLocaleString();
    }

    window.animateCounters = function(container) {
        const statNumbers = container.querySelectorAll('.stat-number');
        statNumbers.forEach(statEl => {
            if (!statEl.dataset.animated) {
                const text = statEl.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                if (number && !isNaN(number)) {
                    statEl.dataset.animated = 'true';
                    statEl.textContent = '0';
                    animateCounter(statEl, number);
                }
            }
        });
    };
}

// Form Handling
function initializeFormHandling() {
    const forms = document.querySelectorAll('form:not(.newsletter-form)');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    showFieldError(input, 'This field is required');
                } else {
                    input.classList.remove('error');
                    hideFieldError(input);
                }
                
                // Email validation
                if (input.type === 'email' && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        input.classList.add('error');
                        showFieldError(input, 'Please enter a valid email address');
                    }
                }
                
                // Phone validation
                if (input.type === 'tel' && input.value.trim()) {
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
                        isValid = false;
                        input.classList.add('error');
                        showFieldError(input, 'Please enter a valid phone number');
                    }
                }
            });
            
            if (isValid) {
                // Show success message
                showNotification('Thank you for your message! We\'ll get back to you within 2 hours.', 'success');
                form.reset();
                
                // Track form submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'Contact',
                        event_label: 'Contact Form'
                    });
                }
            } else {
                showNotification('Please correct the errors and try again.', 'error');
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    } else if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (isValid) {
        field.classList.remove('error');
        hideFieldError(field);
    } else {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    hideFieldError(field); // Remove existing error
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorElement);
}

function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Newsletter Form
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showNotification('Please enter your email address.', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate newsletter subscription
            showNotification('Thank you for subscribing! You\'ll receive our latest updates.', 'success');
            emailInput.value = '';
            
            // Track newsletter subscription
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    event_category: 'Engagement',
                    event_label: 'Newsletter'
                });
            }
        });
    }
}

// Blog Filters
function initializeBlogFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter blog cards
            blogCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Track filter usage
            if (typeof gtag !== 'undefined') {
                gtag('event', 'blog_filter', {
                    event_category: 'Blog',
                    event_label: filter
                });
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transform: translateX(300px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    `;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Lazy Loading
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10001;
        border-radius: 4px;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if it doesn't exist
    const main = document.querySelector('main') || document.querySelector('.hero');
    if (main && !main.id) {
        main.id = 'main-content';
    }
    
    // Keyboard navigation for mobile menu
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Focus management for modals and dropdowns
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close mobile menu
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.focus();
            }
        }
    });
}

// Back to Top Button
function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 15l-6-6-6 6"/>
        </svg>
    `;
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #D1E2D6;
        color: #111111;
        border: none;
        cursor: pointer;
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Track back to top usage
        if (typeof gtag !== 'undefined') {
            gtag('event', 'back_to_top', {
                event_category: 'Navigation'
            });
        }
    });
    
    document.body.appendChild(button);
    
    const handleBackToTopVisibility = throttle(() => {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.transform = 'scale(1)';
        } else {
            button.style.opacity = '0';
            button.style.transform = 'scale(0)';
        }
    }, 100);
    
    window.addEventListener('scroll', handleBackToTopVisibility);
}

// Initialize back to top button
createBackToTopButton();

// Service Booking Functionality
function initializeServiceBooking() {
    const bookingButtons = document.querySelectorAll('.nav-cta, .btn-primary');
    
    bookingButtons.forEach(button => {
        if (button.textContent.includes('Book') || 
            button.textContent.includes('Get Started') ||
            button.textContent.includes('Start Your Care')) {
            
            button.addEventListener('click', function(e) {
                // If it's already a contact page link, let it proceed normally
                if (this.getAttribute('href') === 'contact.html' || 
                    this.getAttribute('href')?.includes('contact')) {
                    return;
                }
                
                e.preventDefault();
                
                // Scroll to contact form or redirect to contact page
                const contactSection = document.querySelector('.contact-section');
                if (contactSection) {
                    contactSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    window.location.href = 'contact.html';
                }
                
                // Track booking intent
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'booking_intent', {
                        event_category: 'Conversion',
                        event_label: this.textContent
                    });
                }
            });
        }
    });
}

// Initialize service booking
initializeServiceBooking();

// WhatsApp Integration
function initializeWhatsApp() {
    const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Track WhatsApp click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    event_category: 'Contact',
                    event_label: 'WhatsApp'
                });
            }
        });
    });
}

// Initialize WhatsApp
initializeWhatsApp();

// Performance Optimization
function optimizePerformance() {
    // Preload critical resources
    const criticalImages = [
        'https://images.pexels.com/photos/7551668/pexels-photo-7551668.jpeg?auto=compress&cs=tinysrgb&w=800'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Lazy load non-critical scripts
    const scripts = document.querySelectorAll('script[data-lazy]');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.async = true;
        document.head.appendChild(newScript);
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Track errors for debugging
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            description: e.error?.message || 'Unknown error',
            fatal: false
        });
    }
});

// Page Visibility API for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause non-essential animations
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible, resume animations
        document.body.classList.remove('page-hidden');
    }
});

// Initialize performance optimizations
optimizePerformance();

// Load More Functionality for Blog
function initializeLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more .btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more blog posts
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                showNotification('All articles have been loaded!', 'info');
                this.style.display = 'none';
            }, 1000);
            
            // Track load more usage
            if (typeof gtag !== 'undefined') {
                gtag('event', 'load_more', {
                    event_category: 'Blog',
                    event_label: 'Load More Articles'
                });
            }
        });
    }
}

// Initialize load more
initializeLoadMore();

// Social Share Functionality
function initializeSocialShare() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const platform = this.classList.contains('facebook') ? 'facebook' :
                           this.classList.contains('twitter') ? 'twitter' :
                           this.classList.contains('linkedin') ? 'linkedin' : 'unknown';
            
            let shareUrl = '';
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, 'share', 'width=600,height=400');
                
                // Track social share
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'share', {
                        method: platform,
                        content_type: 'article',
                        item_id: window.location.pathname
                    });
                }
            }
        });
    });
}

// Initialize social share
initializeSocialShare();

// FAQ Functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== this) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.parentElement.querySelector('.faq-answer').classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
            }
            
            // Track FAQ interaction
            if (typeof gtag !== 'undefined') {
                gtag('event', 'faq_interaction', {
                    event_category: 'Engagement',
                    event_label: this.textContent.trim()
                });
            }
        });
    });
}

// Initialize FAQ
initializeFAQ();

// Console welcome message
console.log(`
🏥 OROKY Healthcare Website
Built with care for families everywhere.

Need help? Contact us at hello@oroky.com
`);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        showNotification,
        validateField
    };
}