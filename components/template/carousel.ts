import { Template } from "../../lib/templates";

export const carouselTemplate: Template = {
  id: "carousel",
  name: "Interactive Slider / Carousel",
  description: "Great for presenting documents or single highlights in sequence with touch swipe and button controls.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactive Carousel Gallery</title>
  <style>
    {{css}}
  </style>
</head>
<body>
  <div class="carousel-container">
    <div class="carousel-viewport" id="viewport">
      {{gallery}}
    </div>
    
    <button class="nav-btn prev-btn" id="prevBtn">&larr;</button>
    <button class="nav-btn next-btn" id="nextBtn">&rarr;</button>
    
    <div class="carousel-dots" id="dotsContainer"></div>
  </div>

  <script>
    const viewport = document.getElementById('viewport');
    const items = document.querySelectorAll('.gallery-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dotsContainer');
    let currentIndex = 0;

    if (items.length > 0) {
      // Create dots
      items.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (idx === 0 ? ' active' : '');
        dot.addEventListener('click', () => showSlide(idx));
        dotsContainer.appendChild(dot);
      });

      function showSlide(index) {
        if (index < 0) index = items.length - 1;
        if (index >= items.length) index = 0;
        currentIndex = index;
        
        viewport.style.transform = \`translateX(-\${currentIndex * 100}%)\`;
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
          dot.className = 'dot' + (idx === currentIndex ? ' active' : '');
        });
      }

      prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
      nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
    }
  </script>
</body>
</html>`,
  css: `body {
  margin: 0;
  background-color: #020617;
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
  overflow: hidden;
}
.carousel-container {
  position: relative;
  width: 90vw;
  max-width: 900px;
  height: 60vh;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #0f172a;
}
.carousel-viewport {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.gallery-item {
  min-width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0f172a;
}
.gallery-item img, .gallery-item video {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}
.gallery-item iframe {
  width: 100%;
  height: 100%;
  border: none;
}
.item-title-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0,0,0,0.6);
  padding: 8px 16px;
  border-radius: 30px;
  backdrop-filter: blur(8px);
  font-size: 0.85rem;
  border: 1px solid rgba(255,255,255,0.1);
}
.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  transition: background 0.3s, scale 0.2s;
}
.nav-btn:hover {
  background: #6366f1;
  scale: 1.05;
}
.prev-btn { left: 20px; }
.next-btn { right: 20px; }
.carousel-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: background 0.3s, scale 0.3s;
}
.dot.active {
  background: #6366f1;
  transform: scale(1.3);
}`
};
