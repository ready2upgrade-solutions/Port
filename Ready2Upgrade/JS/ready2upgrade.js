
class TestimonialSlider {
    constructor() {
        this.cards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.dot');
        this.currentIndex = 0;
        this.totalSlides = this.cards.length;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        this.updateSlides();
        this.bindEvents();
        this.startAutoPlay();
    }

    bindEvents() {
        // Dot click events
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.goToSlide(index);
                }
            });
        });

        // Card click events (for side cards)
        this.cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (!this.isAnimating && index !== this.currentIndex) {
                    this.goToSlide(index);
                }
            });
        });

        // Touch events for swipe
        const slider = document.querySelector('.testimonial-slider');

        slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.stopAutoPlay();
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
            this.startAutoPlay();
        }, { passive: true });

        // Mouse drag events
        let isDragging = false;
        let startX = 0;

        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            this.stopAutoPlay();
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        slider.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = e.clientX - startX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }
            this.startAutoPlay();
        });

        slider.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Pause on hover
        const wrapper = document.querySelector('.testimonial-slider-wrapper');
        wrapper.addEventListener('mouseenter', () => this.stopAutoPlay());
        wrapper.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    updateSlides() {
        this.cards.forEach((card, index) => {
            // Remove all position classes
            card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

            const diff = index - this.currentIndex;

            if (diff === 0) {
                card.classList.add('active');
            } else if (diff === -1 || (this.currentIndex === 0 && index === this.totalSlides - 1)) {
                if (diff === -1) {
                    card.classList.add('prev');
                } else if (this.currentIndex === 0 && index === this.totalSlides - 1) {
                    card.classList.add('prev');
                }
            } else if (diff === 1 || (this.currentIndex === this.totalSlides - 1 && index === 0)) {
                if (diff === 1) {
                    card.classList.add('next');
                } else if (this.currentIndex === this.totalSlides - 1 && index === 0) {
                    card.classList.add('next');
                }
            } else if (diff < -1) {
                card.classList.add('far-prev');
            } else if (diff > 1) {
                card.classList.add('far-next');
            }
        });

        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;

        this.isAnimating = true;
        this.currentIndex = index;
        this.updateSlides();

        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    nextSlide() {
        if (this.isAnimating) return;
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }

    prevSlide() {
        if (this.isAnimating) return;
        const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TestimonialSlider();
});

document.addEventListener('DOMContentLoaded', function () {

    // Initialize Team Cards Animation
    const teamCards = document.querySelectorAll('.team-card');

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each card
    teamCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        cardObserver.observe(card);
    });

    // Add animation class styles dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .team-card.animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
    `;
    document.head.appendChild(styleSheet);

    // Subtle tilt effect on hover (professional, not excessive)
    teamCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Very subtle rotation (max 2 degrees)
            const rotateX = (y - centerY) / centerY * -2;
            const rotateY = (x - centerX) / centerX * 2;

            card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Skill tags subtle pulse on card hover
    teamCards.forEach(card => {
        const skillTags = card.querySelectorAll('.skill-tag');

        card.addEventListener('mouseenter', () => {
            skillTags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        tag.style.transform = 'scale(1)';
                    }, 150);
                }, index * 50);
            });
        });
    });

    // Social links ripple effect
    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple effect styles
    const rippleStyles = document.createElement('style');
    rippleStyles.textContent = `
        .social-link {
            position: relative;
            overflow: hidden;
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(230, 57, 70, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyles);
});

document.addEventListener('DOMContentLoaded', function () {

    // Service Data
    const servicesData = {
        mobile: {
            title: "Application Development",
            subtitle: "Transform your ideas into powerful, secure, and scalable iOS & Android applications with premium UI and enterprise-grade performance.",
            headerClass: "mobile-header",
            iconClass: "mobile",
            icon: "fas fa-mobile-alt",
            features: [
                {
                    icon: "fas fa-layer-group",
                    title: "Native & Cross-Platform Development",
                    description: "High-performance native apps for iOS (Swift) and Android (Kotlin), along with cost-effective cross-platform solutions using React Native and Flutter."
                },
                {
                    icon: "fas fa-palette",
                    title: "Premium UI/UX Design",
                    description: "Beautiful, intuitive, and responsive user interfaces designed to maximize user engagement and brand trust."
                },
                {
                    icon: "fas fa-server",
                    title: "Scalable Architecture & High Performance",
                    description: "Built to scale effortlessly with fast loading speeds, smooth animations, and optimized performance for growing user bases."
                },
                {
                    icon: "fas fa-gauge-high",
                    title: "Business Logic & Backend Integration",
                    description: "Robust backend architecture with secure APIs, business workflows, and seamless integration with cloud services."
                },
                {
                    icon: "fas fa-shield-halved",
                    title: "Secure Data Handling",
                    description: "Enterprise-grade security practices including encrypted data storage, secure authentication, and role-based access control."
                },
                {
                    icon: "fas fa-chart-line",
                    title: "Real-Time User Analytics",
                    description: "Built-in analytics to track user behavior, monitor app performance, and make data-driven product decisions."
                }
            ],
            technologies: [
                { icon: "fab fa-react", name: "React Native" },
                { icon: "fas fa-plug", name: "Flutter" },
                { icon: "fab fa-swift", name: "Swift" },
                { icon: "fab fa-android", name: "Kotlin" },
                { icon: "fas fa-fire", name: "Firebase" },
                { icon: "fab fa-node", name: "Node js" }
            ]
        },
        desktop: {
            title: "Website Development",
            subtitle: "Build fast, secure, and SEO-optimized websites with premium design, scalable architecture, and powerful backend integration.",
            headerClass: "desktop-header",
            iconClass: "desktop",
            icon: "fas fa-code",
            features: [
                {
                    icon: "fas fa-laptop-code",
                    title: "Premium UI/UX & Responsive Design",
                    description: "Visually stunning, mobile-first websites with intuitive user experience that adapt perfectly across all devices and screen sizes."
                },
                {
                    icon: "fa-magnifying-glass-chart",
                    title: "SEO-Friendly Architecture",
                    description: "Clean code structure, optimized performance, and search-engine-friendly architecture to help your website rank higher on Google."
                },
                {
                    icon: "fas fa-diagram-project",
                    title: "Business Logic & Backend Integration",
                    description: "Dynamic backend systems with secure APIs, workflows, dashboards, and third-party integrations tailored to your business needs."
                },
                {
                    icon: "fas fa-rocket",
                    title: "Scalable Architecture & Fast Loading Speed",
                    description: "Built for growth with optimized assets, caching strategies, and scalable infrastructure to ensure lightning-fast performance."
                },
                {
                    icon: "fas fa-shield-alt",
                    title: "Secure Data Handling",
                    description: "Robust security practices including encrypted data handling, secure authentication, and protection against common vulnerabilities."
                },
                {
                    icon: "fas fa-pen-to-square",
                    title: "Easy Content Management & Custom Solutions",
                    description: "User-friendly content management systems and custom admin panels that allow easy updates without technical dependency."
                }
            ],
            technologies: [
                { icon: "fab fa-html5", name: "HTML" },
                { icon: "fab fa-css3-alt", name: "CSS" },
                { icon: "fab fa-js", name: "JS" },
                { icon: "fab fa-react", name: "React" },
                { icon: "fab fa-node", name: "Node" },
                { icon: "fab fa-figma", name: "Figma" }
            ]
        },
        automation: {
            title: "Workplace Automation",
            subtitle: "Automate repetitive tasks, optimize workflows, and reduce operational costs with intelligent, scalable automation solutions.",
            headerClass: "automation-header",
            iconClass: "automation",
            icon: "fas fa-robot",
            features: [
                {
                    icon: "fas fa-file-circle-check",
                    title: "Automatic Document Processing & Verification",
                    description: "AI-powered document processing and verification systems that extract, validate, and approve documents with high accuracy and speed."
                },
                {
                    icon: "fas fa-gears",
                    title: "Business Workflow Automation",
                    description: "End-to-end automation of business workflows including approvals, task assignments, and process orchestration."
                },
                {
                    icon: "fas fa-clipboard-check",
                    title: "Automated Compliance Checks",
                    description: "Intelligent compliance automation to validate policies, regulations, and standards without manual intervention."
                },
                {
                    icon: "fas fa-plug-circle-bolt",
                    title: "Seamless System Integration",
                    description: "Smooth integration with existing enterprise systems such as ERP, CRM, HRMS, and third-party tools."
                },
                {
                    icon: "fas fa-chart-simple",
                    title: "Real-Time Monitoring & Reporting",
                    description: "Live dashboards and automated reports to track performance, detect issues, and gain actionable operational insights."
                },
                {
                    icon: "fas fa-handshake-slash",
                    title: "Reduced Manual Work & Lower Operational Costs",
                    description: "Eliminate repetitive manual tasks, minimize errors, and significantly reduce operational expenses through automation."
                }
            ],
            technologies: [
                { icon: "fab fa-python", name: "Python" },
                { icon: "fas fa-brain", name: "RegEx" },
                { icon: "fas fa-robot", name: "RBA" },
                { icon: "fas fa-microchip", name: "AI/ML" },
                { icon: "fas fa-file-lines", name: "OCR" },
                { icon: "fas fa-plug", name: "APIs" }
            ]
        }
    };

    // DOM Elements
    const modal = document.getElementById('serviceModal');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');
    const floatingCards = document.querySelectorAll('.floating-card');

    // Generate Modal Content
    function generateModalContent(serviceKey) {
        const service = servicesData[serviceKey];

        return `
            <div class="modal-header ${service.headerClass}">
                <div class="modal-header-content">
                    <div class="modal-icon ${service.iconClass}">
                        <i class="${service.icon}"></i>
                    </div>
                    <div class="modal-title-group">
                        <h2>${service.title}</h2>
                        <p>${service.subtitle}</p>
                    </div>
                </div>
            </div>
            
            <div class="modal-body">
                <div class="features-grid">
                    ${service.features.map(feature => `
                        <div class="feature-item">
                            <div class="feature-icon">
                                <i class="${feature.icon}"></i>
                            </div>
                            <div class="feature-text">
                                <h4>${feature.title}</h4>
                                <p>${feature.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="tech-stack">
                    <h3>Technologies We Use</h3>
                    <div class="tech-tags">
                        ${service.technologies.map(tech => `
                            <span class="tech-tag">
                                <i class="${tech.icon}"></i>
                                ${tech.name}
                            </span>
                        `).join('')}
                    </div>
                </div>
                
                <button class="btn-primary scroll-to-demo">
                    Get Free Consultation <i class="fas fa-arrow-right"></i>
                </button>

            </div>
        `;
    }

    // Open Modal
    function openModal(serviceKey) {
        modalContent.innerHTML = generateModalContent(serviceKey);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate features on open
        setTimeout(() => {
            const features = modal.querySelectorAll('.feature-item');
            features.forEach((feature, index) => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    feature.style.transition = 'all 0.4s ease';
                    feature.style.opacity = '1';
                    feature.style.transform = 'translateY(0)';
                }, index * 80);
            });

            const techTags = modal.querySelectorAll('.tech-tag');
            techTags.forEach((tag, index) => {
                tag.style.opacity = '0';
                tag.style.transform = 'scale(0.8)';

                setTimeout(() => {
                    tag.style.transition = 'all 0.3s ease';
                    tag.style.opacity = '1';
                    tag.style.transform = 'scale(1)';
                }, 400 + index * 50);
            });
        }, 100);
    }

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event Listeners
    floatingCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceKey = card.dataset.service;
            openModal(serviceKey);
        });

        // Add ripple effect on click
        card.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('card-ripple');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    document.addEventListener('click', function (e) {
        const demoBtn = e.target.closest('.scroll-to-demo');
        if (!demoBtn) return;

        e.preventDefault();

        // Close modal
        const modal = document.getElementById('serviceModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Scroll to demo form
        const demoSection = document.getElementById('demo');
        if (demoSection) {
            setTimeout(() => {
                demoSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300); // wait for modal close animation
        }
    });


    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Add ripple styles
    const rippleStyles = document.createElement('style');
    rippleStyles.textContent = `
        .floating-card {
            position: relative;
            overflow: hidden;
        }
        
        .card-ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(230, 57, 70, 0.2);
            transform: scale(0);
            animation: rippleEffect 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyles);

    // Scroll animations for cards
    const observerOptions = {
        threshold: 0.3
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    floatingCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.15}s`;
        cardObserver.observe(card);
    });
});


// Navbar scroll effect
const navbar = document.getElementById('navbar');
const scrollTop = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    if (window.scrollY > 500) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

// Scroll to top functionality
scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Counter animation for stats
const counters = document.querySelectorAll('.stat-number');
const speed = 200;

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText.replace('+', '');
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc) + '+';
            setTimeout(animateCounters, 10);
        } else {
            counter.innerText = target + '+';
        }
    });
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('stats-section')) {
                animateCounters();
            }
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.stats-section, .service-card, .feature-card, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Form submission
const demoForm = document.getElementById('demoForm');
demoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Create success message
    const successMsg = document.createElement('div');
    successMsg.innerHTML = `
                <div style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    text-align: center;
                    z-index: 10000;
                    animation: fadeInUp 0.5s ease;
                ">
                    <div style="
                        width: 80px;
                        height: 80px;
                        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 20px;
                        font-size: 2.5rem;
                        color: white;
                    ">
                        <i class="fas fa-check"></i>
                    </div>
                    <h3 style="color: #1d3557; margin-bottom: 10px; font-size: 1.5rem;">Thank You!</h3>
                    <p style="color: #666; margin-bottom: 20px;">Your demo request has been submitted successfully. Our team will contact you within 24 hours.</p>
                    <button onclick="this.parentElement.parentElement.remove()" style="
                        padding: 12px 30px;
                        background: linear-gradient(135deg, #e63946 0%, #ff6b6b 100%);
                        color: white;
                        border: none;
                        border-radius: 50px;
                        font-weight: 600;
                        cursor: pointer;
                        font-family: 'Poppins', sans-serif;
                    ">Close</button>
                </div>
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999;
                " onclick="this.parentElement.remove()"></div>
            `;
    document.body.appendChild(successMsg);
    demoForm.reset();
});

// Testimonial dots functionality
const dots = document.querySelectorAll('.dot');
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
    });
});

// Chat widget click
const chatWidget = document.getElementById('chatWidget');
chatWidget.addEventListener('click', () => {
    alert('Chat feature coming soon! For now, please use the demo form or call us directly.');
});

// Add hover effect for service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect on hero section
window.addEventListener('scroll', () => {
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        const scrolled = window.pageYOffset;
        heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Typing effect for hero title (optional enhancement)
const heroTitle = document.querySelector('.hero-title span');
if (heroTitle) {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    // Start typing after page load
    setTimeout(typeWriter, 1500);
}

console.log('🚀 Ready2Upgrade Website Loaded Successfully!');
console.log('💻 Developed with ❤️ for software excellence');
