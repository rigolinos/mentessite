// Mentes que Inspiram — Core JS Engine
// Powered by GSAP & Locomotive Scroll

document.addEventListener('DOMContentLoaded', () => {
    // --- 0. DYNAMIC EPISODES INJECTION ---
    const timelineTrack = document.querySelector('.timeline__track--episodes');
    if (timelineTrack) {
        timelineTrack.innerHTML = '';
        for (let i = 1; i <= 24; i++) {
            const item = document.createElement('a');
            item.href = "https://youtube.com";
            item.target = "_blank";
            item.className = "timeline__item";
            item.innerHTML = `
                <div class="timeline__img reveal-img">
                    <img src="img/mentes${(i % 12) + 1}.jpeg" alt="Programa ${i}">
                </div>
                <div class="timeline__content">
                    <h3>Programa ${i}</h3>
                    <p>Fração ${i}/24 da temporada. Em breve.</p>
                </div>
            `;
            timelineTrack.appendChild(item);
        }
    }
    // --- 1. INITIALIZE LIBRARIES ---
    if (!window.gsap || !window.LocomotiveScroll) {
        document.querySelector('.preloader').style.display = 'none';
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initialize Locomotive Scroll
    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        multiplier: 1,
        lerp: 0.05,
        smartphone: { smooth: true },
        tablet: { smooth: true }
    });

    scroll.on('scroll', ScrollTrigger.update);
    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
        scrollTop(value) {
            return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: document.querySelector('[data-scroll-container]').style.transform ? "transform" : "fixed"
    });

    // Back to top or smooth header
    scroll.on('scroll', (args) => {
        if (args.scroll.y > 100) {
            document.querySelector('.header').classList.add('scrolled');
        } else {
            document.querySelector('.header').classList.remove('scrolled');
        }
    });

    // SET INITIAL STATES IN JS (Safety)
    gsap.set('.hero__line span', { y: '100%' });
    gsap.set('.header', { y: -100, opacity: 0 });
    gsap.set('.hero__bg img', { scale: 1.2 });

    // --- 2. PRELOADER ANIMATION ---
    const initPreloader = () => {
        const tl = gsap.timeline();
        
        tl.to('.preloader__word', {
            y: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'expo.out'
        });

        tl.to('.preloader__bar', {
            width: '100%',
            duration: 1.5,
            ease: 'power2.inOut',
            onComplete: () => {
                document.querySelector('.preloader').classList.add('preloader--hidden');
                setTimeout(() => {
                    document.querySelector('.preloader').style.display = 'none';
                    initHeroAnimation();
                    scroll.update();
                }, 1200);
            }
        }, '-=0.5');
    };

    // --- 3. HERO ANIMATION ---
    const initHeroAnimation = () => {
        const tl = gsap.timeline();

        tl.to('.hero__line span', {
            y: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: 'expo.out'
        });

        tl.to('.hero__bg img', {
            scale: 1,
            duration: 2.5,
            ease: 'expo.out'
        }, '-=1.2');

        tl.to('.header', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }, '-=1.5');

        tl.from('.hero__label, .hero__footer', {
            opacity: 0,
            y: 30,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        }, '-=1');
    };

    // --- 4. NAVIGATION OVERLAY ---
    const navOverlay = document.querySelector('.nav-overlay');
    const menuToggle = document.querySelector('.header__menu-toggle');
    const closeNav = document.querySelector('.nav-overlay__close');
    const navLinks = document.querySelectorAll('.nav-link');

    const openMenu = () => {
        navOverlay.classList.add('active');
        navOverlay.style.visibility = 'visible';
        navOverlay.style.pointerEvents = 'all';
        gsap.to('.nav-link', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'expo.out',
            delay: 0.2
        });
    };

    const closeMenu = () => {
        navOverlay.classList.remove('active');
        navOverlay.style.visibility = 'hidden';
        navOverlay.style.pointerEvents = 'none';
    };

    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (closeNav) closeNav.addEventListener('click', closeMenu);
    navLinks.forEach(link => link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        closeMenu();
        scroll.scrollTo(target);
    }));

    // --- 5. SCROLL REVEAL SYSTEM ---
    gsap.utils.toArray('.reveal-img, .reveal-text').forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            scroller: '[data-scroll-container]',
            start: 'top 85%',
            onEnter: () => el.classList.add('revealed'),
            once: true
        });
    });

    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                scroller: '[data-scroll-container]',
                start: 'top 85%',
            },
            y: 50, opacity: 0, duration: 1, ease: 'power3.out'
        });
    });

    gsap.from('.about__text', {
        scrollTrigger: {
            trigger: '.about__text',
            scroller: '[data-scroll-container]',
            start: 'top 85%',
        },
        y: 80, opacity: 0, duration: 1.5, ease: 'expo.out'
    });

    gsap.from('.pillar-card', {
        scrollTrigger: {
            trigger: '.pillars__grid',
            scroller: '[data-scroll-container]',
            start: 'top 75%',
        },
        y: 80, opacity: 0, duration: 1.2, stagger: 0.15, ease: 'expo.out'
    });



    // Marquee / Gallery
    const marquee = document.querySelector('.gallery__marquee');
    if (marquee) {
        gsap.to(marquee, {
            scrollTrigger: {
                trigger: '.gallery',
                scroller: '[data-scroll-container]',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            xPercent: -50,
            ease: 'none'
        });
    }

    // --- 6. INITIALIZATION ---
    if (window.lucide) lucide.createIcons();

    const startApp = () => {
        scroll.update();
        ScrollTrigger.refresh();
        initPreloader();
        console.log('App Started and ScrollTrigger Refreshed');

        // Force recalculation after images load (Fixes black box overlays on slow networks)
        setTimeout(() => { scroll.update(); ScrollTrigger.refresh(); }, 1000);
        setTimeout(() => { scroll.update(); ScrollTrigger.refresh(); }, 2000);
        setTimeout(() => { scroll.update(); ScrollTrigger.refresh(); }, 3500);
        
        // Also observe image loads natively
        document.querySelectorAll('img').forEach(img => {
            if (!img.complete) {
                img.addEventListener('load', () => {
                    scroll.update();
                    ScrollTrigger.refresh();
                });
            }
        });
    };

    if (document.readyState === 'complete') {
        startApp();
    } else {
        window.addEventListener('load', startApp);
    }

    // Emergency Fallback
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader && !preloader.classList.contains('preloader--hidden') && preloader.style.display !== 'none') {
            preloader.classList.add('preloader--hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
                initHeroAnimation();
                scroll.update();
            }, 1200);
        }
    }, 4000);

    ScrollTrigger.addEventListener('refresh', () => scroll.update());
    ScrollTrigger.refresh();
});
