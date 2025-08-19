// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    // Enhanced mobile menu toggle with better accessibility
    if (hamburger && navMenu) {
        let isMenuOpen = false;
        
        // Set initial state
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('aria-hidden', 'true');

        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            isMenuOpen = !isMenuOpen;
            
            navMenu.classList.toggle('active', isMenuOpen);
            hamburger.classList.toggle('active', isMenuOpen);
            
            // Update ARIA attributes
            hamburger.setAttribute('aria-expanded', isMenuOpen.toString());
            hamburger.setAttribute('aria-label', isMenuOpen ? 'Close navigation menu' : 'Open navigation menu');
            navMenu.setAttribute('aria-hidden', (!isMenuOpen).toString());
            
            // Prevent body scroll when menu is open on mobile
            if (window.innerWidth <= 768) {
                document.body.style.overflow = isMenuOpen ? 'hidden' : '';
            }
            
            // Animate hamburger icon
            const hamburgerSpans = this.querySelectorAll('span');
            hamburgerSpans.forEach((span, index) => {
                if (isMenuOpen) {
                    if (index === 0) {
                        span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    } else if (index === 1) {
                        span.style.opacity = '0';
                    } else if (index === 2) {
                        span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                    }
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMobileMenu();
            }
        });
        
        function closeMobileMenu() {
            isMenuOpen = false;
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Open navigation menu');
            navMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Reset hamburger animation
            const hamburgerSpans = hamburger.querySelectorAll('span');
            hamburgerSpans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    }

    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            if (currentScrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(15px)';
                navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = '';
            }
        }
        
        lastScrollY = currentScrollY;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form handling
    const quoteForm = document.querySelector('.quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic form validation
            const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'services'];
            let isValid = true;
            let errorMessage = '';
            
            requiredFields.forEach(field => {
                if (!data[field]) {
                    isValid = false;
                    errorMessage += `${field.charAt(0).toUpperCase() + field.slice(1)} is required.\n`;
                }
            });
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (data.email && !emailRegex.test(data.email)) {
                isValid = false;
                errorMessage += 'Please enter a valid email address.\n';
            }
            
            // Phone validation (basic)
            const phoneRegex = /[\d\s\(\)\-\+]/;
            if (data.phone && data.phone.replace(/[\d\s\(\)\-\+]/g, '').length > 0) {
                isValid = false;
                errorMessage += 'Please enter a valid phone number.\n';
            }
            
            if (!isValid) {
                alert('Please fix the following errors:\n\n' + errorMessage);
                return;
            }
            
            // Create email content
            const subject = `Lawn Care Quote Request - ${data.firstName} ${data.lastName}`;
            const serviceLabels = {
                'mowing': 'Weekly Lawn Mowing',
                'landscape': 'Landscape Maintenance',
                'fertilization': 'Fertilization & Treatment',
                'cleanup': 'Seasonal Cleanup',
                'multiple': 'Multiple Services',
                'custom': 'Custom Package'
            };
            
            const sizeLabels = {
                'small': 'Small (Under 1/4 acre)',
                'medium': 'Medium (1/4 - 1/2 acre)',
                'large': 'Large (1/2 - 1 acre)',
                'xlarge': 'Extra Large (1+ acres)'
            };
            
            const body = `New Lawn Care Quote Request
            
Customer Information:
• Name: ${data.firstName} ${data.lastName}
• Email: ${data.email}
• Phone: ${data.phone}
• Property Address: ${data.address}

Service Details:
• Service Requested: ${serviceLabels[data.services] || data.services || 'Not specified'}
• Property Size: ${sizeLabels[data.propertySize] || data.propertySize || 'Not specified'}

Additional Details:
${data.message || 'No additional details provided'}

---
This request was submitted through the M&M Lawn Service website contact form.`;
            
            // Create mailto links (primary and CC)
            const mailtoLink = `mailto:mmlawn60@gmail.com?cc=yviea2013@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Try to open email client
            try {
                window.location.href = mailtoLink;
                
                // Show success message
                setTimeout(() => {
                    alert('Thank you for your quote request! Your email client should open with the message ready to send. We\'ll respond within 2 hours during business hours.');
                    this.reset();
                }, 500);
                
            } catch (error) {
                // Fallback: show the information to copy
                alert(`Thank you for your quote request! Please email us at mmlawn60@gmail.com with the following information:

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Address: ${data.address}
Service: ${serviceLabels[data.services] || data.services}
Property Size: ${sizeLabels[data.propertySize] || data.propertySize}

Additional Details: ${data.message || 'None'}`);
            }
        });
    }

    // Enhanced Intersection Observer for animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delays
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) translateX(0) scale(1)';
                }, index * 100);
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Enhanced scroll reveal observer
    const scrollRevealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                scrollRevealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements for animation
    document.querySelectorAll('.service-card, .contact-method, .feature, .area-item').forEach(el => {
        animationObserver.observe(el);
    });

    // Observe scroll reveal elements
    document.querySelectorAll('.section-header, .services-cta, .about-image').forEach(el => {
        el.classList.add('scroll-reveal');
        scrollRevealObserver.observe(el);
    });

    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Enhanced click-to-call and email functionality
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Track phone clicks if analytics is available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call_click', {
                    'event_category': 'contact',
                    'event_label': 'phone_click',
                    'value': 1
                });
            }
            
            // Show user feedback on mobile
            if (window.innerWidth <= 768) {
                // Create a temporary feedback element
                const feedback = document.createElement('div');
                feedback.textContent = 'Opening phone app...';
                feedback.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--primary-color);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    z-index: 9999;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                `;
                document.body.appendChild(feedback);
                
                setTimeout(() => {
                    feedback.remove();
                }, 2000);
            }
        });
    });
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Track email clicks if analytics is available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'email_click', {
                    'event_category': 'contact',
                    'event_label': 'email_click',
                    'value': 1
                });
            }
            
            // Show user feedback on mobile
            if (window.innerWidth <= 768) {
                const feedback = document.createElement('div');
                feedback.textContent = 'Opening email app...';
                feedback.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--primary-color);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    z-index: 9999;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                `;
                document.body.appendChild(feedback);
                
                setTimeout(() => {
                    feedback.remove();
                }, 2000);
            }
        });
    });

    // Form field focus effects
    const formFields = document.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        field.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Enhanced form submit animation
    const submitButton = document.querySelector('.quote-form button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            const originalText = this.textContent;
            
            // Add loading animation
            this.classList.add('loading-shimmer');
            this.textContent = 'Sending Request...';
            this.disabled = true;
            this.style.transform = 'scale(0.98)';
            
            setTimeout(() => {
                this.classList.remove('loading-shimmer');
                this.textContent = originalText;
                this.disabled = false;
                this.style.transform = 'scale(1)';
                this.classList.add('animate-bounce');
                
                setTimeout(() => {
                    this.classList.remove('animate-bounce');
                }, 1000);
            }, 2000);
        });
    }

    // Add page load animations
    window.addEventListener('load', function() {
        // Animate hero content
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroStats = document.querySelectorAll('.stat');
        const heroButtons = document.querySelector('.hero-buttons');
        
        if (heroTitle) {
            setTimeout(() => heroTitle.classList.add('animate-down'), 200);
        }
        if (heroSubtitle) {
            setTimeout(() => heroSubtitle.classList.add('animate-left'), 400);
        }
        heroStats.forEach((stat, index) => {
            setTimeout(() => stat.classList.add('animate-scale'), 600 + (index * 100));
        });
        if (heroButtons) {
            setTimeout(() => heroButtons.classList.add('animate-in'), 1000);
        }
    });

    // Add typing effect to hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Mouse parallax effect
    document.addEventListener('mousemove', function(e) {
        const heroImage = document.querySelector('.hero-image');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        if (heroImage) {
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 20;
            heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
        
        // Parallax effect on service icons
        document.querySelectorAll('.service-icon').forEach((icon, index) => {
            const moveX = (mouseX - 0.5) * (10 + index * 2);
            const moveY = (mouseY - 0.5) * (10 + index * 2);
            icon.style.transform = `translate(${moveX}px, ${moveY}px) scale(1)`;
        });
    });

    // Add click ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add area badge color functionality
    const areaBadges = document.querySelectorAll('.area-badge');
    areaBadges.forEach(badge => {
        if (badge.textContent === 'Primary') {
            badge.style.background = '#22c55e';
            badge.style.color = 'white';
        } else if (badge.textContent === 'Extended') {
            badge.style.background = '#fbbf24';
            badge.style.color = '#1f2937';
        }
    });

    // Performance optimizations for mobile
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Throttle scroll events for better performance
    window.addEventListener('scroll', throttle(function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        const navbar = document.querySelector('.navbar');
        
        // Parallax effect (disabled on mobile for performance)
        if (heroBackground && scrolled < window.innerHeight && window.innerWidth > 768) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        // Dynamic navbar background
        if (navbar) {
            if (scrolled > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(5px)';
            }
        }
    }, 10));

    // Optimize animations for mobile
    const isMobile = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isMobile || prefersReducedMotion) {
        // Disable heavy animations on mobile or for users who prefer reduced motion
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
        const animatedElements = document.querySelectorAll('.animate-float, .animate-pulse');
        animatedElements.forEach(el => {
            el.style.animation = 'none';
        });
    }

    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        
        if (heroBackground && scrolled < window.innerHeight) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add number counting animation for stats
    const stats = document.querySelectorAll('.stat-number');
    const hasAnimated = new Set();
    
    const animateNumber = (element, target) => {
        if (hasAnimated.has(element)) return;
        hasAnimated.add(element);
        
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (target === 100 ? '%' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
            }
        }, 40);
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = entry.target.textContent.replace(/[+%]/g, '');
                const number = parseInt(text);
                if (!isNaN(number)) {
                    animateNumber(entry.target, number);
                }
            }
        });
    });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Reviews Carousel Functionality
    const reviewsTrack = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('carouselIndicators');
    
    if (reviewsTrack && prevBtn && nextBtn) {
        const reviewCards = document.querySelectorAll('.review-card');
        const totalReviews = 8; // Number of unique reviews (excluding duplicates)
        let currentIndex = 0;
        let isAnimating = false;

        // Create indicators
        for (let i = 0; i < totalReviews; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }

        const indicators = document.querySelectorAll('.indicator');

        // Update indicators
        function updateIndicators() {
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentIndex);
            });
        }

        // Go to specific slide
        function goToSlide(index) {
            if (isAnimating) return;
            
            currentIndex = index;
            const cardWidth = 352; // 320px width + 32px gap
            const offset = -(currentIndex * cardWidth);
            
            reviewsTrack.style.animation = 'none';
            reviewsTrack.style.transform = `translateX(${offset}px)`;
            updateIndicators();

            // Resume animation after a delay
            setTimeout(() => {
                if (reviewsTrack.style.animation === 'none') {
                    reviewsTrack.style.animation = 'scroll 30s linear infinite';
                }
            }, 3000);
        }

        // Previous button
        prevBtn.addEventListener('click', () => {
            if (isAnimating) return;
            
            currentIndex = currentIndex === 0 ? totalReviews - 1 : currentIndex - 1;
            goToSlide(currentIndex);
        });

        // Next button
        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;
            
            currentIndex = currentIndex === totalReviews - 1 ? 0 : currentIndex + 1;
            goToSlide(currentIndex);
        });

        // Pause animation on hover
        reviewsTrack.addEventListener('mouseenter', () => {
            reviewsTrack.style.animationPlayState = 'paused';
        });

        reviewsTrack.addEventListener('mouseleave', () => {
            reviewsTrack.style.animationPlayState = 'running';
        });

        // Enhanced touch/swipe support for mobile and tablet
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let isDragging = false;
        let dragThreshold = 50;
        let startTime = 0;

        // Passive event listeners for better performance
        const passiveSupported = (() => {
            let passive = false;
            try {
                const options = Object.defineProperty({}, "passive", {
                    get: function() { passive = true; }
                });
                window.addEventListener("testPassive", null, options);
                window.removeEventListener("testPassive", null, options);
            } catch (err) {}
            return passive;
        })();

        const eventOptions = passiveSupported ? { passive: false } : false;

        reviewsTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            currentX = startX;
            isDragging = true;
            startTime = Date.now();
            reviewsTrack.style.animationPlayState = 'paused';
            reviewsTrack.style.transition = 'none';
        }, eventOptions);

        reviewsTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            currentX = e.touches[0].clientX;
            const deltaX = currentX - startX;
            const deltaY = e.touches[0].clientY - startY;
            
            // Only handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault();
                
                // Provide visual feedback during drag
                const cardWidth = 280;
                const currentOffset = -(currentIndex * cardWidth);
                const dragOffset = deltaX * 0.3; // Damping factor
                reviewsTrack.style.transform = `translateX(${currentOffset + dragOffset}px)`;
            }
        }, eventOptions);

        reviewsTrack.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endTime = Date.now();
            const deltaTime = endTime - startTime;
            const deltaX = currentX - startX;
            const deltaY = e.changedTouches[0].clientY - startY;
            const velocity = Math.abs(deltaX) / deltaTime;
            
            // Reset transition
            reviewsTrack.style.transition = 'transform 0.3s ease';
            
            // Determine if swipe should trigger navigation
            const shouldNavigate = (Math.abs(deltaX) > dragThreshold && Math.abs(deltaX) > Math.abs(deltaY)) || velocity > 0.5;
            
            if (shouldNavigate) {
                if (deltaX > 0) {
                    // Swipe right - previous
                    currentIndex = currentIndex === 0 ? totalReviews - 1 : currentIndex - 1;
                } else {
                    // Swipe left - next
                    currentIndex = currentIndex === totalReviews - 1 ? 0 : currentIndex + 1;
                }
                goToSlide(currentIndex);
            } else {
                // Snap back to current position
                const cardWidth = 280;
                const currentOffset = -(currentIndex * cardWidth);
                reviewsTrack.style.transform = `translateX(${currentOffset}px)`;
            }
            
            isDragging = false;
            
            // Resume animation after a delay
            setTimeout(() => {
                reviewsTrack.style.animationPlayState = 'running';
                reviewsTrack.style.transition = '';
            }, 300);
        }, eventOptions);

        // Handle touch cancel (e.g., when scrolling vertically)
        reviewsTrack.addEventListener('touchcancel', () => {
            if (isDragging) {
                isDragging = false;
                reviewsTrack.style.transition = 'transform 0.3s ease';
                const cardWidth = 280;
                const currentOffset = -(currentIndex * cardWidth);
                reviewsTrack.style.transform = `translateX(${currentOffset}px)`;
                
                setTimeout(() => {
                    reviewsTrack.style.animationPlayState = 'running';
                    reviewsTrack.style.transition = '';
                }, 300);
            }
        });

        // Auto-advance carousel (optional)
        let autoAdvanceInterval = setInterval(() => {
            if (reviewsTrack.style.animationPlayState !== 'paused') {
                currentIndex = currentIndex === totalReviews - 1 ? 0 : currentIndex + 1;
                updateIndicators();
            }
        }, 4000);

        // Clear interval when user interacts
        [prevBtn, nextBtn, ...indicators].forEach(element => {
            element.addEventListener('click', () => {
                clearInterval(autoAdvanceInterval);
                // Restart auto-advance after 10 seconds of inactivity
                setTimeout(() => {
                    autoAdvanceInterval = setInterval(() => {
                        if (reviewsTrack.style.animationPlayState !== 'paused') {
                            currentIndex = currentIndex === totalReviews - 1 ? 0 : currentIndex + 1;
                            updateIndicators();
                        }
                    }, 4000);
                }, 10000);
            });
        });
    }

    // Animate review cards on scroll
    const reviewObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                reviewObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe review cards for animation
    document.querySelectorAll('.review-card').forEach(card => {
        reviewObserver.observe(card);
    });

    console.log('M&M Lawn Service website loaded successfully!');
});