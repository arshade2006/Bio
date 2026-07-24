document.addEventListener('DOMContentLoaded', () => {
    const bgLayer = document.getElementById('bg-layer');

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

    // Smooth animation loop for parallax
    function animate() {
        // Lerp for smooth movement
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        // Move ONLY the background (move opposite to mouse)
        const bgMoveX = currentX * 25; 
        const bgMoveY = currentY * 25;
        // scale is to prevent edges from showing during parallax
        bgLayer.style.transform = `translate(${-bgMoveX}px, ${-bgMoveY}px) scale(1.05)`; 

        requestAnimationFrame(animate);
    }
    animate();

    // Falling Stars Generator
    const starsContainer = document.getElementById('stars-container');
    const starsCount = 20; // Number of stars on screen at once

    function createStar() {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position (starting from top right mostly)
        const startPosX = Math.random() * window.innerWidth * 1.5; 
        const startPosY = Math.random() * window.innerHeight * 0.5 - 100;
        
        star.style.left = `${startPosX}px`;
        star.style.top = `${startPosY}px`;
        
        const animationDuration = Math.random() * 3 + 2; // 2s to 5s
        star.style.animationDuration = `${animationDuration}s`;
        
        const animationDelay = Math.random() * 5;
        star.style.animationDelay = `${animationDelay}s`;

        starsContainer.appendChild(star);

        // Remove star after animation ends and create a new one
        setTimeout(() => {
            star.remove();
            createStar();
        }, (animationDuration + animationDelay) * 1000);
    }

    // Initialize stars
    for (let i = 0; i < starsCount; i++) {
        createStar();
    }
});
