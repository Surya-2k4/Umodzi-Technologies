// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', () => {
    // 0. Lottie Water Ripple Initialization
    try {
        const waterAnimation = lottie.loadAnimation({
            container: document.getElementById('lottie-water'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://assets4.lottiefiles.com/packages/lf20_m5v5t2yv.json'
        });
    } catch (e) {
        console.error("Lottie failed to load:", e);
    }

    // 1. Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        gsap.to(cursor, { x, y, duration: 0.1 });
        gsap.to(follower, { x: x - 20, y: y - 20, duration: 0.3 });

        // Mouse Parallax for Hero Elements
        if (window.scrollY < window.innerHeight) {
            const moveX = (x - window.innerWidth / 2) / 50;
            const moveY = (y - window.innerHeight / 2) / 50;

            gsap.to('.circuit-tree', {
                x: moveX * 2,
                y: moveY * 2,
                duration: 0.8,
                ease: 'power2.out'
            });

            gsap.to('.f-element', {
                x: -moveX * 4,
                y: -moveY * 4,
                duration: 1,
                ease: 'power2.out',
                stagger: 0.1
            });
        }
    });

    // Cursor hover effects
    const interactives = document.querySelectorAll('a, button, .glass-card, .logo');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(follower, {
                scale: 1.5,
                borderColor: '#00d2ff',
                backgroundColor: 'rgba(0, 210, 255, 0.1)',
                duration: 0.3
            });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(follower, {
                scale: 1,
                borderColor: '#ff8c00',
                backgroundColor: 'rgba(255, 140, 0, 0.1)',
                duration: 0.3
            });
        });
    });

    // Safety: Hide loader after 5s regardless of GSAP completion
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        if (loader && loader.style.display !== 'none') {
            gsap.to(loader, { opacity: 0, pointerEvents: 'none', duration: 0.5 });
        }
    }, 5000);

    // 2. Loader Sequence
    const tlLoader = gsap.timeline();
    tlLoader.to('.loader-circle', {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: 1.5
    })
        .to('.loader', {
            opacity: 0,
            pointerEvents: 'none',
            duration: 0.8,
            ease: 'power4.inOut'
        })
        .from('.nav-link', {
            y: -30,
            autoAlpha: 0,
            stagger: 0.05,
            duration: 0.5,
            clearProps: "all"
        }, '-=0.3')
        .call(initHeroAnimations)
        .call(() => {
            ScrollTrigger.refresh();
        });

    function initHeroAnimations() {
        const splitText = document.querySelector('.reveal-type');
        if (splitText) {
            gsap.from(splitText, {
                opacity: 0,
                y: 30,
                duration: 1,
                ease: 'power3.out'
            });
        }

        gsap.from('.hero-subtitle', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.4,
            clearProps: "all"
        });

        gsap.from('.hero-btns', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            delay: 0.6,
            ease: 'power2.out',
            clearProps: "all"
        });

        // SVG Tree Growth Animation
        const paths = document.querySelectorAll('.tree-path');
        paths.forEach(path => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            gsap.to(path, {
                strokeDashoffset: 0,
                duration: 2.5,
                ease: 'power2.inOut',
                delay: 0.5
            });
        });

        gsap.from('.node', {
            scale: 0,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            delay: 1.5,
            ease: 'back.out(1.7)'
        });
    }

    // 5. Parallax Logic
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;

        gsap.to('.mountains', { y: scrolled * 0.4, duration: 0.1 });
        gsap.to('.lake-container', { y: scrolled * 0.1, duration: 0.1 });
        gsap.to('.hero-content', { opacity: 1 - (scrolled / 700), y: scrolled * 0.2, duration: 0 });
    });

    // 6. Section Scroll Trigger Animations
    const sections = document.querySelectorAll('.section-padding');
    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        const cards = section.querySelectorAll('.glass-card');

        if (header) {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 40,
                duration: 1,
                ease: 'power2.out'
            });
        }

        if (cards.length > 0) {
            gsap.from(cards, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power1.out',
                clearProps: "transform,opacity"
            });
        }
    });

    const nav = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            const navContent = document.getElementById('navContent');
            if (navContent && navContent.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navContent) || new bootstrap.Collapse(navContent);
                bsCollapse.hide();
            }

            if (target) {
                gsap.to(window, {
                    scrollTo: { y: target.offsetTop - 80 },
                    duration: 1.2,
                    ease: 'power3.inOut'
                });
            }
        });
    });
});
