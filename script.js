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
    const starsCount = 20;

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

    // Initialize stars
    for (let i = 0; i < starsCount; i++) {
        createStar();
    }
    
    // Dropdown Logic
    const projectsToggle = document.getElementById('projectsToggle');
    if (projectsToggle) {
        const summary = projectsToggle.querySelector('.projects-summary');
        summary.addEventListener('click', () => {
            projectsToggle.classList.toggle('open');
        });
    }
});
