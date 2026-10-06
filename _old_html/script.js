document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader ---
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        
        // Trigger initial animations after preloader
        setTimeout(() => {
            document.querySelectorAll('#hero .reveal-text').forEach(el => el.classList.add('is-visible'));
        }, 300);
    }, 1500);

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    // Only init if not on mobile/touch
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Immediate dot
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Delayed outline (spring effect)
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Hover effect for links and buttons
        const interactables = document.querySelectorAll('a, button, input, select, textarea');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // --- Navbar Scroll & Magnetic Buttons ---
    const navbar = document.getElementById('navbar');
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Magnetic effect logic
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });
        
        btn.addEventListener('mouseout', function() {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- Mobile Menu ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileBtn.querySelector('i').classList.replace('ph-x', 'ph-list');
            });
        });
    }

    // --- Intersection Observer for Animations On Scroll ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.slide-up, .slide-right, .slide-left, .reveal-text:not(#hero .reveal-text)').forEach(el => {
        observer.observe(el);
    });

    // --- Parallax Effect on Scroll ---
    const parallaxElements = document.querySelectorAll('.parallax, .parallax-bg');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed');
            if(speed) {
                const yPos = -(scrolled * speed);
                if(el.classList.contains('parallax-bg')) {
                    el.style.transform = `translateY(${yPos}px)`;
                } else {
                    el.style.transform = `translateY(${yPos}px)`;
                }
            }
        });
    });

    // --- Form Submission (Simulation) ---
    const form = document.getElementById('booking-form');
    const formMessage = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // To be replaced by L'Addition later
            const formData = new FormData(form);
            const name = formData.get('name');
            const date = formData.get('date');
            
            formMessage.textContent = `Merci ${name} ! Ceci est une simulation. Bientôt relié à L'Addition.`;
            formMessage.className = 'form-message success';
            
            form.reset();
            setTimeout(() => { formMessage.classList.add('hidden'); }, 6000);
        });
    }
});
