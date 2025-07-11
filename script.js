document.addEventListener('DOMContentLoaded', function() {
    // Custom smooth scroll function with ease-in-out easing
    function smoothScrollToPosition(targetPosition, duration = 800) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Ease-in-out cubic function for smooth acceleration and deceleration
            const easeInOutCubic = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easeInOutCubic);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
    
    // Add smooth scroll behavior to all anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                // Custom smooth scroll with easing
                smoothScrollToPosition(targetPosition);
            }
        });
    });
    
    // Update active nav link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Remove active class from all nav links
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });
        
        // Add active class to current section link
        if (current) {
            const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${current}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                activeLink.setAttribute('aria-current', 'page');
            }
        } else {
            // If at top of page, activate Home link
            const homeLink = document.querySelector('.navbar-nav .nav-link[href="#hero"]');
            if (homeLink && window.scrollY < 100) {
                homeLink.classList.add('active');
                homeLink.setAttribute('aria-current', 'page');
            }
        }
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Initial call
    updateActiveNavLink();
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';
            submitBtn.disabled = true;
            formStatus.style.display = 'none';
            
            try {
                const formData = new FormData(contactForm);
                
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    formStatus.innerHTML = '<div class="alert alert-success"><i class="bi bi-check-circle me-2"></i>Thank you for your message! I\'ll get back to you soon.</div>';
                    formStatus.style.display = 'block';
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Error
                formStatus.innerHTML = '<div class="alert alert-danger"><i class="bi bi-exclamation-triangle me-2"></i>Sorry, there was an error sending your message. Please try again or contact me directly at charlotte.stone.dev@proton.me</div>';
                formStatus.style.display = 'block';
            } finally {
                // Reset button
                submitBtn.innerHTML = 'Send';
                submitBtn.disabled = false;
            }
        });
    }
    
    // Check for success parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        if (formStatus) {
            formStatus.innerHTML = '<div class="alert alert-success"><i class="bi bi-check-circle me-2"></i>Thank you for your message! I\'ll get back to you soon.</div>';
            formStatus.style.display = 'block';
        }
        // Remove the parameter from URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Persona divider animation
    const dividers = document.querySelectorAll('.persona-divider');
    
    const dividerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Adjust z-index for proper layering
                setTimeout(() => {
                    entry.target.style.zIndex = '10';
                }, 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    dividers.forEach(divider => {
        dividerObserver.observe(divider);
        // Initial state
        divider.style.opacity = '0.8';
        divider.style.transform = 'translateY(20px)';
        divider.style.transition = 'all 0.6s ease-out';
    });
});