document.addEventListener('DOMContentLoaded', () => {
    const bgLayer = document.getElementById('bg-layer');
    const card = document.getElementById('card');

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

    // Parallax effect variables
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    // Listen to mouse movement
    document.addEventListener('mousemove', (e) => {
        // Calculate offset from center (-1 to 1)
        mouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        mouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    // Reset rotation on mouse leave
    document.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
    });

    // Smooth animation loop for parallax and 3D tilt
    function animate() {
        // Lerp for smooth movement
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        // Move ONLY the background (move opposite to mouse)
        const bgMoveX = currentX * 25; 
        const bgMoveY = currentY * 25;
        bgLayer.style.transform = `translate(${-bgMoveX}px, ${-bgMoveY}px) scale(1.05)`; 

        // 3D Tilt effect for the card (only if not on mobile)
        if (window.innerWidth > 600) {
            // Rotate card based on mouse position
            const rotateX = -currentY * 10; // max 10 degrees
            const rotateY = currentX * 10;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        } else {
            card.style.transform = `none`;
        }

        requestAnimationFrame(animate);
    }
    animate();

    // Falling Stars Generator
    const starsContainer = document.getElementById('stars-container');
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
        starsContainer.appendChild(twinkle);
    }
    
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

    // Custom RGB cursor
    const cursor = document.getElementById('cursor');
    let cursorX = 0, cursorY = 0;
    let aimX = 0, aimY = 0;

    document.addEventListener('mousemove', (e) => {
        aimX = e.clientX;
        aimY = e.clientY;
    });

    function moveCursor() {
        cursorX += (aimX - cursorX) * 0.18;
        cursorY += (aimY - cursorY) * 0.18;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top  = `${cursorY}px`;
        requestAnimationFrame(moveCursor);
    }
    moveCursor();
});
