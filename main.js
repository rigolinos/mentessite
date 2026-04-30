// Mentes que Inspiram — Core JS Engine
// Powered by GSAP & Locomotive Scroll

document.addEventListener('DOMContentLoaded', () => {
    // Detecta mobile uma vez para usar em todo o script
    const isMobile = window.innerWidth <= 768;

    // --- MOBILE VIDEO FORCE-PLAY ---
    // iOS Safari requer atenção especial para autoplay de vídeo
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        // Garante que os atributos essenciais estão presentes
        heroVideo.muted = true;
        heroVideo.playsInline = true;
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('webkit-playsinline', '');

        const tryPlay = () => {
            const promise = heroVideo.play();
            if (promise !== undefined) {
                promise.catch(() => {
                    // Silencioso — o poster (imagem) já aparece como fallback
                    console.log('Video autoplay bloqueado — poster visível como fallback');
                });
            }
        };

        // Tentativa 1: imediata
        tryPlay();

        // Tentativa 2: ao carregar metadados
        heroVideo.addEventListener('loadedmetadata', tryPlay, { once: true });

        // Tentativa 3: no primeiro toque do usuário (iOS exige user gesture às vezes)
        const playOnTouch = () => {
            tryPlay();
            document.removeEventListener('touchstart', playOnTouch);
        };
        document.addEventListener('touchstart', playOnTouch, { once: true });

        // Tentativa 4: IntersectionObserver — quando o vídeo entrar na tela
        if ('IntersectionObserver' in window) {
            const obs = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    tryPlay();
                    obs.disconnect();
                }
            }, { threshold: 0.1 });
            obs.observe(heroVideo);
        }
    }


    // --- 0. DYNAMIC EPISODES DATA ---
    const allEpisodes = [
        // Temporada 1
        { id: 1, season: 1, title: "Abertura da Série e Propósito", desc: "Episódio 01 • 15/10/2025", img: "img/mentes1.jpeg", link: "http://www.youtube.com/watch?v=zoPlruHqBJI" },
        { id: 2, season: 1, title: "Judô e Educação Criativa (Milena Mendes)", desc: "Episódio 02 • 25/10/2025", img: "thumbs/Judô e Educação Criativa (Milena Mendes) - [Referente ao Ep 2].jpeg", link: "http://www.youtube.com/watch?v=no0fjMc_vjQ" },
        { id: 3, season: 1, title: "Educação, Inclusão e Amor (Alberto Moura)", desc: "Episódio 03 • 02/11/2025", img: "thumbs/Educação, Inclusão e Amor (Alberto Moura) - [Referente ao Ep 3].jpeg", link: "http://www.youtube.com/watch?v=DV_rVqoURbE" },
        { id: 4, season: 1, title: "Voluntariado que Cura - Parte 1 (Esquadrão da Alegria)", desc: "Episódio 04 • 08/11/2025", img: "thumbs/Voluntariado que Cura - Parte 1 (Esquadrão da Alegria) - [Referente ao Ep 4].jpeg", link: "http://www.youtube.com/watch?v=-4kiM2Kui20" },
        { id: 5, season: 1, title: "Voluntariado que Cura - Parte 2 (Esquadrão da Alegria)", desc: "Episódio 05 • 12/11/2025", img: "thumbs/Voluntariado que Cura - Parte 2 (Esquadrão da Alegria) - [Referente ao Ep 5].jpeg", link: "https://www.youtube.com/watch?v=6mC-IqW77cQ" },
        { id: 6, season: 1, title: "Educar com Amor e Criatividade (Fernanda Badia)", desc: "Episódio 06 • 16/11/2025", img: "thumbs/Educar com Amor e Criatividade (Fernanda Badia) - [Referente ao Ep 6].jpeg", link: "http://www.youtube.com/watch?v=X8GFOMbq3uY" },
        { id: 7, season: 1, title: "Empatia que Transforma (Saúde, Histórias e Propósito)", desc: "Episódio 07 • 30/11/2025", img: "thumbs/Empatia que Transforma (Saúde, Histórias e Propósito) - [Referente ao Ep 7].jpeg", link: "https://www.youtube.com/watch?v=DOfV8nZ7jYo" },
        { id: 8, season: 1, title: "Quando a Música encontra a Voz (Comunicação/Expressão)", desc: "Episódio 08 • 07/12/2025", img: "thumbs/Quando a Música encontra a Voz (ComunicaçãoExpressão) - [Referente ao Ep 8].jpeg", link: "https://www.youtube.com/watch?v=H70KqZ2_TzQ" },
        { id: 9, season: 1, title: "Quando Histórias Educam (Narrativas e Transformação)", desc: "Episódio 09 • 14/12/2025", img: "thumbs/Quando Histórias Educam (Narrativas e Transformação) - [Referente ao Ep 9].jpeg", link: "https://www.youtube.com/watch?v=I7X8G4_P0Fw" },
        { id: 10, season: 1, title: "Conhecimento que muda destinos (Rumo ao sucesso)", desc: "Episódio 10 • 18/12/2025", img: "thumbs/Conhecimento que muda destinos (Rumo ao sucesso) - [Referente ao Ep 10].jpeg", link: "https://www.youtube.com/watch?v=S6Y4k_R9F8g" },
        { id: 11, season: 1, title: "Energia que Transforma (Intenção e novos começos)", desc: "Episódio 11 • 20/12/2025", img: "thumbs/Energia que Transforma (Intenção e novos começos) - [Referente ao Ep 11].jpeg", link: "http://www.youtube.com/watch?v=Atg-QFVYdJc" },
        { id: 12, season: 1, title: "Educação Antirracista (Diversidade e Inclusão)", desc: "Episódio 12 • 28/12/2025", img: "thumbs/Educação Antirracista (Diversidade e Inclusão) - [Referente ao Ep 12].jpeg", link: "https://www.youtube.com/watch?v=T8W9U5_L9F0" },
        { id: 13, season: 1, title: "Quando a Neurociência encontra a Humanização", desc: "Episódio 13 • 04/01/2026", img: "thumbs/Quando a Neurociência encontra a Humanização - [Referente ao Ep 13].jpeg", link: "https://www.youtube.com/watch?v=V7B8Z1_K9E8" },
        { id: 14, season: 1, title: "Saúde, Propósito e Conexões (Sigrid e Vanessa)", desc: "Episódio 14 • 11/01/2026", img: "thumbs/Saúde, Propósito e Conexões (Sigrid e Vanessa) - [Referente ao Ep 14].jpeg", link: "http://www.youtube.com/watch?v=QMOrzozHlJc" },

        // Temporada 2
        { id: 15, season: 2, title: "A Educação está adoecendo (E como virar o jogo)", desc: "Episódio 15 • 18/01/2026", img: "thumbs/A Educação está adoecendo (E como virar o jogo) - [Referente ao Ep 15].jpeg", link: "https://www.youtube.com/watch?v=Z0E1N3_O9F2" },
        { id: 16, season: 2, title: "A Leitura pode salvar uma vida (Léia Cassol)", desc: "Episódio 16 • 26/01/2026", img: "thumbs/A Leitura pode salvar uma vida (Léia Cassol) - [Referente ao Ep 16].jpeg", link: "http://www.youtube.com/watch?v=v3B5L4TgGR8" },
        { id: 17, season: 2, title: "Educação, Inclusão e Transição (Mariângela Pozza)", desc: "Episódio 17 • 03/02/2026", img: "thumbs/Educação, Inclusão e Transição (Mariângela Pozza) - [Referente ao Ep 17].jpeg", link: "http://www.youtube.com/watch?v=OCU17kT-xxw" },
        { id: 18, season: 2, title: "Empatia, Força e Propósito", desc: "Episódio 18 • 10/02/2026", img: "thumbs/Empatia, Força e Propósito - [Referente ao Ep 18].jpeg", link: "https://www.youtube.com/watch?v=C3H4R6_S9F5" },
        { id: 19, season: 2, title: "Inclusão que Transforma a Educação", desc: "Episódio 19 • 17/02/2026", img: "thumbs/Inclusão que Transforma a Educação - [Referente ao Ep 19].jpeg", link: "https://www.youtube.com/watch?v=D4I5S7_T9F6" },
        { id: 20, season: 2, title: "1ª Infância: Brincar, Vínculo e Presença", desc: "Episódio 20 • 25/02/2026", img: "thumbs/1ª Infância Brincar, Vínculo e Presença (João Luiz) - [Referente ao Ep 20].jpeg", link: "http://www.youtube.com/watch?v=J_fMP73BW14" },
        { id: 21, season: 2, title: "Menopausa sem Tabu! (Márcia Selister)", desc: "Episódio 21 • 05/03/2026", img: "thumbs/Menopausa sem Tabu! (Márcia Selister) - [Referente ao Ep 21].jpeg", link: "http://www.youtube.com/watch?v=L3E5qhV_emg" },
        { id: 22, season: 2, title: "Experiência Lux: Autoestima e Imagem", desc: "Episódio 22 • 10/03/2026", img: "thumbs/Experiência Lux Autoestima e Imagem - [Referente ao Ep 22].jpeg", link: "https://www.youtube.com/watch?v=G7L8V0_W9F9" },
        { id: 23, season: 2, title: "Maternidade Atípica: Luta e Transformação - Parte 1", desc: "Episódio 23 • 14/03/2026", img: "thumbs/Maternidade Atípica Luta e Transformação - Parte 1 - [Referente ao Ep 23].jpeg", link: "http://www.youtube.com/watch?v=3P0Li3OZcyg" },
        { id: 24, season: 2, title: "Maternidade Atípica: Autismo - Parte 2", desc: "Episódio 24 • 22/03/2026", img: "thumbs/Maternidade Atípica Autismo - Parte 2 - [Referente ao Ep 24].jpeg", link: "http://www.youtube.com/watch?v=EiQp6ojyM6s" },
        { id: 25, season: 2, title: "Educação, Liderança e Inovação - Parte 1 (Cris Vieira)", desc: "Episódio 25 • 31/03/2026", img: "thumbs/Educação, Liderança e Inovação - Parte 1 (Cris Vieira) - [Referente ao Ep 25].jpeg", link: "http://www.youtube.com/watch?v=zrL6AGN8fv4" },
        { id: 26, season: 2, title: "Educação, Liderança e Inovação - Parte 2 (Cris Vieira)", desc: "Episódio 26 • 05/04/2026", img: "thumbs/Educação, Liderança e Inovação - Parte 2 (Cris Vieira) - [Referente ao Ep 26].jpeg", link: "http://www.youtube.com/watch?v=-hu9Y1KPxFE" },
        { id: 27, season: 2, title: "Carreira, Empreendedorismo e Direito Trabalhista", desc: "Episódio 27 • 13/04/2026", img: "thumbs/Carreira, Empreendedorismo e Direito Trabalhista (Catharine) - [Referente ao Ep 27.jpeg", link: "http://www.youtube.com/watch?v=OeAHWnX10Q0" },
        { id: 28, season: 2, title: "Poder da Presença com Propósito (Cuidado que Transforma)", desc: "Episódio 28 • 25/04/2026", img: "thumbs/Poder da Presença com Propósito (Cuidado que transforma) - [Referente ao Ep 28].jpeg", link: "https://www.youtube.com/watch?v=paikAGUZqx8" }
    ];

    const timelineTrack = document.querySelector('.timeline__track--episodes');
    let swiperInstance;

    const renderEpisodes = (season) => {
        if (!timelineTrack) return;
        
        // GSAP Fade out
        gsap.to(timelineTrack, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            onComplete: () => {
                timelineTrack.innerHTML = '';
                const filtered = allEpisodes.filter(ep => ep.season === parseInt(season));
                
                filtered.forEach(ep => {
                    const slide = document.createElement('div');
                    slide.className = "swiper-slide";
                    slide.innerHTML = `
                        <a href="${ep.link}" target="_blank" class="timeline__item">
                            <div class="timeline__img reveal-img">
                                <img src="${ep.img}" alt="${ep.title}">
                            </div>
                            <div class="timeline__content">
                                <h3>${ep.title}</h3>
                                <p>${ep.desc}</p>
                            </div>
                        </a>
                    `;
                    timelineTrack.appendChild(slide);
                });
                
                // Forçar aparecimento das imagens na troca de temporada com delay elegante
                timelineTrack.querySelectorAll('.reveal-img').forEach((el, index) => {
                    setTimeout(() => el.classList.add('revealed'), 100 * (index % 5));
                });

                // Re-init reveal animations
                if (window.lucide) lucide.createIcons();
                
                // GSAP Fade in
                gsap.to(timelineTrack, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    delay: 0.1
                });

                if (swiperInstance) {
                    swiperInstance.update();
                    swiperInstance.slideTo(0);
                }
            }
        });
    };

    // Initialize Swiper for Timeline
    let progressTimeout;
    const progressContainer = document.querySelector('.timeline__progress-container');
    const progressBar = document.querySelector('.timeline__progress-bar');

    if (document.querySelector('.timeline-swiper')) {
        swiperInstance = new Swiper('.timeline-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 30,
            freeMode: true,
            grabCursor: true,
            resistanceRatio: 0.85,
            on: {
                progress: function (s) {
                    const progress = s.progress;
                    if (progressBar) {
                        progressBar.style.width = `${Math.max(0, Math.min(1, progress)) * 100}%`;
                    }
                },
                touchStart: function () {
                    if (progressContainer) progressContainer.classList.add('active');
                    clearTimeout(progressTimeout);
                },
                touchEnd: function () {
                    progressTimeout = setTimeout(() => {
                        if (progressContainer) progressContainer.classList.remove('active');
                    }, 1500);
                },
                sliderMove: function() {
                    if (progressContainer) progressContainer.classList.add('active');
                }
            }
        });
        
        // Initial Render (S1)
        renderEpisodes(1);
    }

    // Season Tabs Logic
    const seasonTabs = document.querySelectorAll('.season-tab');
    seasonTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active') || tab.hasAttribute('disabled')) return;
            
            seasonTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const season = tab.getAttribute('data-season');
            renderEpisodes(season);
        });
    });

    // --- CONTACT FORM — AJAX Submit ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submit-btn');
            const successDiv = document.getElementById('form-success');
            const formGroups = contactForm.querySelectorAll('.form-group');

            // Estado de carregamento
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('send_email.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.status === 'success') {
                    // Confirmar visualmente antes de ocultar
                    submitBtn.textContent = 'Enviado! ✓';
                    submitBtn.style.background = '#2a9d5c';
                    submitBtn.style.color = '#fff';
                    contactForm.reset();

                    // Aguardar 1.2s para o usuário ver "Enviado!" e depois fazer o fade
                    setTimeout(() => {
                        gsap.to([...formGroups, submitBtn], {
                            opacity: 0,
                            y: -10,
                            duration: 0.4,
                            stagger: 0.05,
                            onComplete: () => {
                                formGroups.forEach(g => g.style.display = 'none');
                                submitBtn.style.display = 'none';
                                successDiv.style.display = 'flex';
                                gsap.from(successDiv, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' });
                            }
                        });
                    }, 1200);
                } else {
                    alert(data.message || 'Erro ao enviar. Tente novamente.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Proposta';
                }
            } catch (err) {
                alert('Erro de conexão. Verifique e tente novamente.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Proposta';
            }
        });
    }

    // --- 1. INITIALIZE LIBRARIES ---
    if (!window.gsap || !window.LocomotiveScroll) {
        document.querySelector('.preloader').style.display = 'none';
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Initialize Locomotive Scroll
    // No mobile: remove todos os data-scroll-speed antes de iniciar
    // evita parallax quebrado e bugs ao rolar para cima
    if (isMobile) {
        document.querySelectorAll('[data-scroll-speed]').forEach(el => {
            el.removeAttribute('data-scroll-speed');
        });
    }

    const scroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        multiplier: 1,
        lerp: 0.05,
        smartphone: { smooth: false }, // Scroll nativo no celular = mais estável
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
    // No mobile, não aplicamos scale no vídeo para evitar conflicts com CSS transforms
    if (!isMobile) {
        gsap.set('.hero__bg img, .hero__bg video', { scale: 1.2 });
    }

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

        // Só anima zoom no desktop — no mobile o vídeo já está fixo sem transforms
        if (!isMobile) {
            tl.to('.hero__bg img, .hero__bg video', {
                scale: 1,
                duration: 2.5,
                ease: 'expo.out'
            }, '-=1.2');
        }

        tl.to('.header', {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        }, isMobile ? '-=1.2' : '-=1.5');

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

    // Botão "Assista aos Episódios" — scroll suave via Locomotive
    const btnEpisodes = document.getElementById('btn-scroll-episodes');
    if (btnEpisodes) {
        btnEpisodes.addEventListener('click', () => {
            scroll.scrollTo('#episodes');
        });
    }

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

    // FALLBACK: Se o ScrollTrigger não disparar (ex: no deploy em produção),
    // revela todos os elementos após 3s para garantir que nada fique escondido
    setTimeout(() => {
        document.querySelectorAll('.reveal-img, .reveal-text').forEach(el => {
            el.classList.add('revealed');
        });
        // Também revela elementos com data-scroll-class="revealed"
        document.querySelectorAll('[data-scroll-class="revealed"]').forEach(el => {
            el.classList.add('revealed');
        });
    }, 3000);

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



    // Marquee / Gallery GSAP effect removed to allow CSS animation to run smoothly without conflicts
    /*
    if (!isMobile) {
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
    }
    */

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
