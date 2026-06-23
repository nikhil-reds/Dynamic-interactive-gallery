import { Template } from "../../lib/templates";

export const fluidTemplate: Template = {
  id: "fluid-wave",
  name: "Fluid Wave Gallery",
  description: "A vertical scrolling layout with smooth momentum-based drag and scroll velocity skew distortions.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fluid Wave Gallery</title>
    <style>
        {{css}}
    </style>
</head>
<body>

    <!-- Loading Screen -->
    <div id="loadingScreen">
        <div class="loader"></div>
        <div id="loadingText">LOADING</div>
        <div id="loadingProgress">0%</div>
    </div>

    <!-- Main Scroll Container -->
    <div class="scroll-container" id="scrollContainer">
        <div class="image-strip" id="imageStrip">
            {{gallery}}
        </div>
    </div>
</body>
</html>`,
  css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box
}

body {
    background: #ffffff;
    font-family: Arial, sans-serif;
    overflow: hidden;
    height: 100vh;
    user-select: none
}

.scroll-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    cursor: grab
}

.scroll-container.dragging {
    cursor: grabbing
}

.image-strip {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    will-change: transform
}

/* Base gallery item adapts to the user's .image-container styles */
.gallery-item, .image-container {
    width: 300px;
    margin-bottom: 10px;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgb(0 0 0 / .4);
    position: relative;
    left: 0;
    will-change: transform
}

.gallery-item:hover, .image-container:hover {
    transform: scale(1.02)
}

.gallery-item img, .gallery-item video, .gallery-item iframe,
.image-container img, .image-container video, .image-container iframe {
    width: 100%;
    height: auto;
    display: block;
    border: none;
}

.gallery-item iframe, .image-container iframe {
    height: 300px;
}

.info {
    position: fixed;
    left: 12px;
    bottom: 12px;
    z-index: 10;
    background: rgb(0 0 0 / .8);
    padding: 12px 24px;
    border-radius: 20px;
    font-size: 13px;
    text-align: center;
    opacity: .85;
    color: #fff;
}

#loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20
}

a {
    color: #9cf;
    text-decoration: none
}

a:hover {
    color: #fff
}

.copy {
    position: fixed;
    top: 20px;
    left: 20px;
    color: #000;
    background: rgb(255 255 255 / .7);
    padding: 10px;
    border-radius: 5px;
    font-size: 12px;
    z-index: 2
}

.controls-info {
    position: fixed;
    top: 20px;
    right: 20px;
    color: #fff;
    background: rgb(0 0 0 / .8);
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 12px;
    z-index: 10;
    text-align: center;
    cursor: pointer
}

#loadingScreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #0a0a0a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    transition: opacity 0.8s ease;
    color: #fff;
    font-family: Arial, sans-serif
}

#loadingScreen.hidden {
    opacity: 0;
    pointer-events: none
}

.loader {
    width: 50px;
    height: 50px;
    border: 3px solid rgb(255 255 255 / .1);
    border-top-color: #9cf;
    border-radius: 50%;
    animation: spin 0.8s linear infinite
}

#loadingText {
    margin-top: 20px;
    font-size: 14px;
    letter-spacing: 2px;
    color: rgb(255 255 255 / .6)
}

#loadingProgress {
    margin-top: 8px;
    font-size: 12px;
    color: rgb(255 255 255 / .4)
}

@keyframes spin {
    to {
        transform: rotate(360deg)
    }
}`,
  js: `
const imageStrip = document.getElementById('imageStrip');
const scrollContainer = document.getElementById('scrollContainer');
const loadingScreen = document.getElementById('loadingScreen');
const loadingProgress = document.getElementById('loadingProgress');

let scrollY = 0;
let velocity = 0;
let animationId = null;
let sectionHeight = 0;
let imageContainers = [];
let imageHeights = [];
let isInitialized = false;
let cumulativeHeights = [];
let totalStripHeight = 0;
let isDragging = false;
let startY = 0;
let startScrollY = 0;
let lastMoveY = 0;
let wheelAccumulator = 0;
const WHEEL_THRESHOLD = 5;
const waveConfig = {
    amplitude: 40,
    frequency: 0.006,
    phase: 0
};

function init() {
    const originalItems = Array.from(imageStrip.children);
    const numOriginal = originalItems.length;
    if (numOriginal === 0) {
        onImagesLoaded();
        return;
    }

    // Clear and duplicate elements 3 times for infinite scroll loop
    imageStrip.innerHTML = '';
    imageContainers = [];
    imageHeights = [];

    for (let section = 0; section < 3; section++) {
        for (let i = 0; i < numOriginal; i++) {
            const clone = originalItems[i].cloneNode(true);
            clone.className = 'gallery-item';
            imageStrip.appendChild(clone);
            imageContainers.push(clone);
            imageHeights.push(310);
        }
    }

    const images = Array.from(imageStrip.querySelectorAll('img'));
    let loadedCount = 0;
    const totalImages = images.length;
    if (totalImages === 0) {
        onImagesLoaded();
        return;
    }

    function updateProgress() {
        const percent = Math.round((loadedCount / totalImages) * 100);
        if (loadingProgress) loadingProgress.textContent = percent + '%';
    }

    images.forEach(img => {
        if (img.complete) {
            loadedCount++;
            updateProgress();
            if (loadedCount === totalImages) {
                onImagesLoaded();
            }
        } else {
            img.addEventListener('load', () => {
                loadedCount++;
                updateProgress();
                if (loadedCount === totalImages) {
                    onImagesLoaded();
                }
            });
            img.addEventListener('error', () => {
                loadedCount++;
                updateProgress();
                if (loadedCount === totalImages) {
                    onImagesLoaded();
                }
            });
        }
    });
}

function onImagesLoaded() {
    const totalItems = imageContainers.length;
    const numImages = totalItems / 3;

    for (let i = 0; i < totalItems; i++) {
        const img = imageContainers[i].querySelector('img');
        if (img && img.naturalWidth && img.naturalHeight) {
            const containerWidth = 300;
            const displayHeight = containerWidth * (img.naturalHeight / img.naturalWidth);
            imageHeights[i] = displayHeight + 10;
        } else {
            imageHeights[i] = 310;
        }
    }

    cumulativeHeights = [];
    let cumul = 0;
    for (let i = 0; i < imageHeights.length; i++) {
        cumulativeHeights.push(cumul);
        cumul += imageHeights[i];
    }
    totalStripHeight = cumul;
    sectionHeight = imageHeights.slice(0, numImages).reduce((sum, h) => sum + h, 0);
    scrollY = -sectionHeight;
    isInitialized = true;
    updatePositions();
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 900);
    }
}

function updatePositions() {
    if (!isInitialized) return;
    const numImages = imageContainers.length / 3;
    if (scrollY < -sectionHeight * 2) {
        scrollY += sectionHeight;
    } else if (scrollY > -sectionHeight) {
        scrollY -= sectionHeight;
    }
    imageStrip.style.transform = \`translateX(-50%) translateY(\${scrollY}px)\`;
    const len = imageContainers.length;
    for (let i = 0; i < len; i++) {
        const container = imageContainers[i];
        const imageY = cumulativeHeights[i] + scrollY;
        const waveOffset = Math.sin(imageY * waveConfig.frequency + (i % numImages) * 0.1 + waveConfig.phase) * waveConfig.amplitude;
        container.style.transform = \`translateX(\${waveOffset}px)\`;
    }
}

function animate() {
    velocity *= 0.96;
    if (Math.abs(velocity) < 0.1) {
        velocity = 0;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        return;
    }
    scrollY += velocity;
    updatePositions();
    animationId = requestAnimationFrame(animate);
}

function startAnimation() {
    if (!animationId && Math.abs(velocity) > 0.1) {
        animationId = requestAnimationFrame(animate);
    }
}

function handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY;
    wheelAccumulator += delta;
    if (Math.sign(wheelAccumulator) !== Math.sign(delta)) {
        wheelAccumulator = delta;
        return;
    }
    if (Math.abs(wheelAccumulator) < WHEEL_THRESHOLD) {
        return;
    }
    const sensitivity = 1.2;
    const finalDelta = wheelAccumulator * sensitivity;
    velocity -= finalDelta;
    velocity = Math.max(-25, Math.min(25, velocity));
    wheelAccumulator = 0;
    startAnimation();
}

function handleMouseDown(e) {
    isDragging = true;
    startY = e.clientY || e.touches[0].clientY;
    startScrollY = scrollY;
    lastMoveY = startY;
    scrollContainer.classList.add('dragging');
    velocity = 0;
    wheelAccumulator = 0;
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    e.preventDefault();
}

function handleMouseMove(e) {
    if (!isDragging) return;
    const currentY = e.clientY || e.touches[0].clientY;
    const deltaY = currentY - startY;
    scrollY = startScrollY + deltaY;
    updatePositions();
    velocity = (currentY - lastMoveY) * 0.6;
    lastMoveY = currentY;
}

function handleMouseUp() {
    if (!isDragging) return;
    isDragging = false;
    scrollContainer.classList.remove('dragging');
    if (Math.abs(velocity) > 0.3) {
        startAnimation();
    } else {
        velocity = 0;
    }
}

function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        velocity += 8;
        startAnimation();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        velocity -= 8;
        startAnimation();
    }
}

window.addEventListener('load', init);
window.addEventListener('wheel', handleWheel, {
    passive: false
});
scrollContainer.addEventListener('mousedown', handleMouseDown);
scrollContainer.addEventListener('touchstart', handleMouseDown, {
    passive: false
});
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('touchmove', handleMouseMove, {
    passive: false
});
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('touchend', handleMouseUp);
document.addEventListener('keydown', handleKeyDown);
window.addEventListener('resize', updatePositions);
scrollContainer.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Run init directly if DOM is already parsed (Next.js iframe loads)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
}
`
};
