// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize all application functionality
function initializeApp() {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize counters
    initCounters();
    
    // Initialize testimonials slider
    initTestimonialsSlider();
    
    // Initialize portfolio filter
    initPortfolioFilter();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize countdown timer
    initCountdownTimer();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize intersection observer for animations
    initIntersectionObserver();
    
    // Initialize modal functionality
    initModals();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize WhatsApp integration
    initWhatsAppIntegration();
}

// Loading Screen
function initLoadingScreen() {
    const loadingSpinner = document.getElementById('loading-spinner');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingSpinner.classList.add('fade-out');
            setTimeout(() => {
                loadingSpinner.style.display = 'none';
            }, 300);
        }, 1000);
    });
}

// Navigation
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Mobile menu toggle
    navToggle?.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle?.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        // Auto-hide header on scroll down (mobile)
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink?.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
}

// Scroll Effects
function initScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');

    if (hero && heroImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < hero.offsetHeight) {
                heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }

    // Fade in animations on scroll
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card');
    
    function checkAnimation() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('fade-in');
            }
        });
    }

    window.addEventListener('scroll', checkAnimation);
    checkAnimation(); // Initial check
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateCounters() {
        if (hasAnimated) return;
        
        const aboutSection = document.querySelector('.about');
        if (!aboutSection) return;

        const rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            hasAnimated = true;
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const increment = target / 50;
                let current = 0;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
}

// Testimonials Slider
function initTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentSlide = 0;

    if (!slides.length) return;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Event listeners
    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-slide
    setInterval(nextSlide, 5000);

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        slider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
    }
}

// Portfolio Filter
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Track filter usage
            trackEvent('Portfolio Filter', 'click', filter);
        });
    });

    // Before/After toggle functionality
    const beforeAfterToggles = document.querySelectorAll('.before-after-toggle');
    beforeAfterToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const img = this.parentElement.querySelector('img');
            const currentSrc = img.src;
            
            if (currentSrc.includes('-before.jpg')) {
                img.src = currentSrc.replace('-before.jpg', '-after.jpg');
                this.querySelector('.toggle-text').textContent = 'بعد / قبل';
            } else {
                img.src = currentSrc.replace('-after.jpg', '-before.jpg');
                this.querySelector('.toggle-text').textContent = 'قبل / بعد';
            }
        });
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

// Form Validation
function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    const formGroup = field.closest('.form-group');

    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
    }

    // Specific field validations
    switch (fieldName) {
        case 'name':
            if (value && value.length < 2) {
                isValid = false;
                errorMessage = 'الاسم يجب أن يحتوي على حرفين على الأقل';
            }
            break;

        case 'phone':
            const phoneRegex = /^[\+]?[0-9]{10,15}$/;
            if (value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'يرجى إدخال رقم هاتف صحيح';
            }
            break;

        case 'privacy':
            if (field.type === 'checkbox' && !field.checked) {
                isValid = false;
                errorMessage = 'يجب الموافقة على شروط الاستخدام';
            }
            break;
    }

    // Update UI
    if (formGroup) {
        formGroup.classList.toggle('error', !isValid);
    }
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.toggle('show', !isValid);
    }

    return isValid;
}

function clearFieldError(field) {
    const fieldName = field.name;
    const errorElement = document.getElementById(`${fieldName}-error`);
    const formGroup = field.closest('.form-group');

    if (formGroup) {
        formGroup.classList.remove('error');
    }
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function validateForm() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, select, textarea');
    let isFormValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

function submitForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('.submit-btn');
    const formData = new FormData(form);

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Convert form data to object
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Track form submission
    trackEvent('Contact Form', 'submit', 'form_submission');
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'Contact Form',
            content_category: 'Construction Services'
        });
    }

    // Simulate API call (replace with actual endpoint)
    setTimeout(() => {
        // Hide form and show success message
        form.style.display = 'none';
        document.getElementById('form-success').style.display = 'block';
        
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Send notification (you can integrate with your backend here)
        sendNotification(data);
        
        // Auto-hide success message and show form again after 10 seconds
        setTimeout(() => {
            document.getElementById('form-success').style.display = 'none';
            form.style.display = 'block';
            form.reset();
        }, 10000);
        
    }, 2000);
}

function sendNotification(data) {
    // إرسال تلقائي عبر FormSubmit (خدمة مجانية)
    const formData = new FormData();
    
    // إعداد البيانات للإرسال
    formData.append('الاسم', data.name);
    formData.append('رقم الهاتف', data.phone);
    formData.append('نوع الخدمة', getServiceName(data.service));
    formData.append('تفاصيل المشروع', data.message || 'لا توجد تفاصيل إضافية');
    formData.append('وقت الطلب', new Date().toLocaleString('ar-EG'));
    formData.append('رقم المستقبل', '01008295776');
    
    // إرسال عبر FormSubmit
    fetch('https://formsubmit.co/ajax/YOUR_EMAIL@gmail.com', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        console.log('تم إرسال النموذج بنجاح:', result);
    })
    .catch(error => {
        console.log('خطأ في الإرسال:', error);
    });
    
    // إرسال أيضاً عبر Telegram إذا كان متاح
    sendViaTelegram(data);
    
    // إرسال نسخة إلى WhatsApp Business API (إذا كان متاح)
    sendViaWhatsAppAPI(data);
}

// إرسال عبر Telegram Bot
function sendViaTelegram(data) {
    // ضع هنا معلومات البوت الخاص بك
    const BOT_TOKEN = '7482838473:AAE8ZJB2jdVvGBE7-example-token'; // استبدل بـ token حقيقي
    const CHAT_ID = '123456789'; // استبدل بـ chat ID الخاص بك
    
    const message = `
🏗️ *طلب عرض سعر جديد من موقع العماد*

👤 *الاسم:* ${data.name}
📞 *الهاتف:* ${data.phone}
🔧 *الخدمة:* ${getServiceName(data.service)}
📝 *التفاصيل:* ${data.message || 'لا توجد'}
⏰ *الوقت:* ${new Date().toLocaleString('ar-EG')}

📲 *للتواصل:* 01008295776
    `.trim();
    
    // إرسال فقط إذا كان التوكن حقيقي
    if (BOT_TOKEN && !BOT_TOKEN.includes('example')) {
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        }).catch(error => console.log('Telegram error:', error));
    }
}

// إرسال عبر WhatsApp Business API
function sendViaWhatsAppAPI(data) {
    // هذا يتطلب WhatsApp Business API key
    const API_KEY = 'YOUR_WHATSAPP_API_KEY';
    const PHONE_NUMBER = '201008295776';
    
    if (!API_KEY || API_KEY === 'YOUR_WHATSAPP_API_KEY') {
        console.log('WhatsApp API غير مكون');
        return;
    }
    
    const message = `طلب جديد: ${data.name} - ${data.phone} - ${getServiceName(data.service)}`;
    
    // مثال على استخدام API (يختلف حسب المزود)
    fetch('https://api.whatsapp.com/send', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: PHONE_NUMBER,
            type: 'text',
            text: { body: message }
        })
    }).catch(error => console.log('WhatsApp API error:', error));
}

// دالة مساعدة لتحويل رمز الخدمة إلى اسم عربي
function getServiceName(serviceCode) {
    const services = {
        'building': 'البناء والتشييد',
        'renovation': 'الترميم والتجديد', 
        'interior': 'التصميم الداخلي',
        'maintenance': 'الصيانة العامة',
        'landscape': 'تنسيق الحدائق',
        'consulting': 'الاستشارات الهندسية',
        'other': 'أخرى'
    };
    return services[serviceCode] || serviceCode;
}

// Countdown Timer
function initCountdownTimer() {
    const countdownElement = document.querySelector('.countdown');
    if (!countdownElement) return;

    // Set countdown end date (30 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = endDate.getTime() - now;

        if (distance < 0) {
            // Reset countdown
            endDate.setDate(endDate.getDate() + 30);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    }

    // Update countdown immediately and then every minute
    updateCountdown();
    setInterval(updateCountdown, 60000);
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn?.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Intersection Observer for Animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .testimonial-card, .about-stats .stat, .contact-item'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Modal Functionality
function initModals() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (!modal) return;

    // Close modal events
    closeBtn?.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    
    // Project data (in real app, this would come from API)
    const projects = {
        project1: {
            title: 'فيلا سكنية فاخرة',
            location: 'الرياض - 2023',
            description: 'مشروع فيلا سكنية فاخرة تم تنفيذها بأعلى معايير الجودة والفخامة.',
            images: ['images/project-1-before.jpg', 'images/project-1-after.jpg'],
            features: ['مساحة 500 متر مربع', '4 غرف نوم رئيسية', 'حديقة واسعة', 'مسبح خاص']
        },
        project2: {
            title: 'مبنى تجاري حديث',
            location: 'جدة - 2023',
            description: 'مبنى تجاري متعدد الاستخدامات بتصميم عصري ومواصفات عالية.',
            images: ['images/project-2-after.jpg'],
            features: ['6 طوابق', 'مكاتب تجارية', 'موقف سيارات', 'أنظمة ذكية']
        },
        project3: {
            title: 'ترميم منزل تراثي',
            location: 'الدمام - 2022',
            description: 'مشروع ترميم وإعادة تأهيل منزل تراثي مع الحفاظ على الطابع الأصيل.',
            images: ['images/project-3-before.jpg', 'images/project-3-after.jpg'],
            features: ['ترميم شامل', 'حفظ الطابع التراثي', 'تحديث الأنظمة', 'إضافات عصرية']
        },
        project4: {
            title: 'مجمع شقق سكنية',
            location: 'الرياض - 2022',
            description: 'مجمع سكني متكامل يضم 24 شقة بتصميم عصري ومرافق متنوعة.',
            images: ['images/project-4-after.jpg'],
            features: ['24 وحدة سكنية', 'حديقة مشتركة', 'أمن على مدار الساعة', 'موقع متميز']
        }
    };
    
    const project = projects[projectId];
    if (!project) return;

    modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <p class="project-location">${project.location}</p>
        <div class="project-images">
            ${project.images.map(img => `<img src="${img}" alt="${project.title}" style="width: 100%; margin-bottom: 1rem; border-radius: 8px;">`).join('')}
        </div>
        <p class="project-description">${project.description}</p>
        <div class="project-features">
            <h3>مميزات المشروع:</h3>
            <ul>
                ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// WhatsApp Integration
function initWhatsAppIntegration() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    
    whatsappBtn?.addEventListener('click', function() {
        trackEvent('WhatsApp', 'click', 'floating_button');
    });
}

// Utility Functions
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    if (contactSection) {
        window.scrollTo({
            top: contactSection.offsetTop - headerHeight,
            behavior: 'smooth'
        });
        
        // Focus on the first input
        setTimeout(() => {
            const firstInput = contactSection.querySelector('input');
            firstInput?.focus();
        }, 500);
    }
    
    trackEvent('CTA Button', 'click', 'scroll_to_contact');
}

function makeCall() {
    const phoneNumber = '+201008295776';
    window.location.href = `tel:${phoneNumber}`;
    trackEvent('Call Button', 'click', 'direct_call');
}

// Analytics and Tracking
function trackEvent(category, action, label) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'CustomEvent', {
            event_category: category,
            event_action: action,
            event_label: label
        });
    }
    
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Performance Optimization
function initPerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Preload critical resources
    const criticalImages = [
        'images/hero-bg.jpg',
        'images/logo.png'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Track errors for debugging
    trackEvent('Error', 'javascript_error', e.error?.message || 'Unknown error');
});

// Touch and Gesture Support
function initTouchSupport() {
    // Add touch-friendly classes
    document.addEventListener('touchstart', function() {
        document.body.classList.add('touch-device');
    }, { once: true });

    // Handle touch events for better mobile experience
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleGesture();
    });

    function handleGesture() {
        const swipeThreshold = 100;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe up - could trigger specific actions
                trackEvent('Gesture', 'swipe_up', 'mobile');
            } else {
                // Swipe down - could trigger specific actions
                trackEvent('Gesture', 'swipe_down', 'mobile');
            }
        }
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initPerformanceOptimizations();
    initTouchSupport();
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for global access
window.scrollToContact = scrollToContact;
window.makeCall = makeCall;
window.openProjectModal = openProjectModal;
window.closeModal = closeModal;
