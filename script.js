document.addEventListener('DOMContentLoaded', () => {
    const bgLayer = document.getElementById('bg-layer');
    const card = document.getElementById('card');
    const cursor = document.getElementById('cursor');
    const starsContainer = document.getElementById('stars-container');

    // High-quality space/stars backgrounds
    const backgrounds = [
        'Resources/walpaper1.jpg',
        'Resources/walpaper2.png',
        'Resources/walpaper3.jpg',
        'Resources/walpaper4.jpg'
    ];

    // Pick random background
    const randomImage = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    bgLayer.style.backgroundImage = `url('${randomImage}')`;

    // --- Parallax + cursor state ---
    // Parallax target (mouse offset from center, -1..1)
    let mouseX = 0;
    let mouseY = 0;
    // Smoothed parallax values
    let currentX = 0;
    let currentY = 0;
    // Cursor target (px) and smoothed position
    let aimX = 0;
    let aimY = 0;
    let cursorX = 0;
    let cursorY = 0;

    let parallaxActive = false; // still converging / needs update
    let cursorActive = false;
    let rafId = null;

    const isDesktop = () => window.innerWidth > 600;

    // Single passive mousemove listener (was two separate handlers)
    document.addEventListener('mousemove', (e) => {
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        mouseX = (e.clientX - halfW) / halfW;
        mouseY = (e.clientY - halfH) / halfH;
        aimX = e.clientX;
        aimY = e.clientY;
        parallaxActive = true;
        cursorActive = true;
        ensureRaf();
    }, { passive: true });

    // Reset rotation on mouse leave
    document.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
        parallaxActive = true;
        ensureRaf();
    });

    // Re-evaluate on resize (desktop <-> mobile tilt switch)
    window.addEventListener('resize', () => {
        parallaxActive = true;
        ensureRaf();
    }, { passive: true });

    // Pause the loop when the tab is hidden to save CPU/battery
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        } else if (parallaxActive || cursorActive) {
            ensureRaf();
        }
    });

    function ensureRaf() {
        if (rafId === null && !document.hidden) {
            rafId = requestAnimationFrame(loop);
        }
    }

    // Single animation loop for parallax, 3D tilt AND cursor.
    // Stops itself when everything has converged (no more writes while idle).
    function loop() {
        rafId = null;
        if (document.hidden) return;

        let keepRunning = false;

        // --- Parallax + card tilt ---
        if (parallaxActive) {
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;

            // Move ONLY the background (opposite to mouse); translate3d => GPU
            const bgMoveX = currentX * 25;
            const bgMoveY = currentY * 25;
            bgLayer.style.transform = `translate3d(${-bgMoveX}px, ${-bgMoveY}px, 0) scale(1.05)`;

            // 3D tilt for the card (desktop only)
            if (isDesktop()) {
                card.style.transform = `rotateX(${-currentY * 10}deg) rotateY(${currentX * 10}deg)`;
            } else {
                card.style.transform = 'none';
            }

            // Stop updating once movement has fully converged
            if (Math.abs(mouseX - currentX) > 0.0005 || Math.abs(mouseY - currentY) > 0.0005) {
                keepRunning = true;
            } else {
                parallaxActive = false;
            }
        }

        // --- Custom cursor (transform instead of left/top => no layout) ---
        if (cursorActive) {
            cursorX += (aimX - cursorX) * 0.18;
            cursorY += (aimY - cursorY) * 0.18;
            cursor.style.transform = `translate(-50%, -50%) translate3d(${cursorX}px, ${cursorY}px, 0)`;

            if (Math.abs(aimX - cursorX) > 0.3 || Math.abs(aimY - cursorY) > 0.3) {
                keepRunning = true;
            } else {
                cursorActive = false;
            }
        }

        if (keepRunning) {
            rafId = requestAnimationFrame(loop);
        }
    }

    // Kick off (cursor starts at 0,0 like before, parallax starts centered)
    ensureRaf();

    // Falling Stars Generator
    const starsCount = 40; // More shooting stars

    function createStar() {
        const star = document.createElement('div');
        star.classList.add('star');

        const startPosX = Math.random() * window.innerWidth * 1.5;
        const startPosY = Math.random() * window.innerHeight * 0.5 - 100;

        star.style.left = `${startPosX}px`;
        star.style.top = `${startPosY}px`;

        const animationDuration = Math.random() * 3 + 2;
        star.style.animationDuration = `${animationDuration}s`;

        const animationDelay = Math.random() * 5;
        star.style.animationDelay = `${animationDelay}s`;

        starsContainer.appendChild(star);

        setTimeout(() => {
            star.remove();
            createStar();
        }, (animationDuration + animationDelay) * 1000);
    }

    // Initialize shooting stars
    for (let i = 0; i < starsCount; i++) {
        createStar();
    }

    // Comet spawner (bigger, brighter, longer tail)
    function createComet() {
        const comet = document.createElement('div');
        comet.classList.add('comet');

        const startPosX = Math.random() * window.innerWidth * 1.5;
        const startPosY = Math.random() * window.innerHeight * 0.3 - 100;

        comet.style.left = `${startPosX}px`;
        comet.style.top  = `${startPosY}px`;

        const duration = Math.random() * 2 + 2.5; // 2.5s–4.5s
        const delay    = Math.random() * 10 + 3;  // rarer than stars

        comet.style.animationDuration = `${duration}s`;
        comet.style.animationDelay    = `${delay}s`;

        starsContainer.appendChild(comet);

        setTimeout(() => {
            comet.remove();
            createComet();
        }, (duration + delay) * 1000);
    }

    // Spawn 5 comets
    for (let i = 0; i < 5; i++) {
        createComet();
    }

    // Static twinkling background stars (dots that don't move)
    const twinkles = document.createDocumentFragment();
    for (let i = 0; i < 80; i++) {
        const twinkle = document.createElement('div');
        twinkle.classList.add('twinkle');
        twinkle.style.left = `${Math.random() * 100}vw`;
        twinkle.style.top  = `${Math.random() * 100}vh`;
        twinkle.style.animationDuration  = `${Math.random() * 3 + 1.5}s`;
        twinkle.style.animationDelay     = `${Math.random() * 4}s`;
        const size = Math.random() > 0.8 ? '3px' : '2px';
        twinkle.style.width  = size;
        twinkle.style.height = size;
        twinkles.appendChild(twinkle);
    }
    starsContainer.appendChild(twinkles); // single reflow instead of 80

    // Dropdown Logic
    const projectsToggle = document.getElementById('projectsToggle');
    if (projectsToggle) {
        const summary = projectsToggle.querySelector('.projects-summary');
        summary.addEventListener('click', () => {
            projectsToggle.classList.toggle('open');
        });
    }

    // Typewriter effect for role
    const typewriterEl = document.getElementById('typewriter');
    const phrases = ['C# / Unity Developer', 'Game Developer', 'Indie Dev'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeWriter() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            typewriterEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 60 : 110;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000; // pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }
        setTimeout(typeWriter, delay);
    }
    typeWriter();
});
