import { Template } from "../../lib/templates";

export const accordionTemplate: Template = {
  id: "accordion",
  name: "3D Sliding Accordion",
  description: "A stunning 3D sliding accordion gallery with perspective rotations, hover cascades, and click-to-expand details.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D Sliding Accordion Gallery</title>
  <style>
    {{css}}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="items">
      {{gallery}}
    </div>
  </div>
</body>
</html>`,
  css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --index: calc(1vw + 1vh);
  --transition-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
}

body {
  background-color: #141414;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.items {
  display: flex;
  gap: 0.4rem;
  perspective: calc(var(--index) * 35);
  align-items: center;
}

.gallery-item {
  position: relative;
  background-color: #222;
  width: calc(var(--index) * 3.5);
  height: calc(var(--index) * 14);
  cursor: pointer;
  transition: transform 0.8s var(--transition-smooth),
    filter 0.6s var(--transition-smooth), width 0.8s var(--transition-smooth),
    box-shadow 0.6s var(--transition-smooth), margin 0.8s var(--transition-smooth);
  will-change: transform, width, filter;
  filter: grayscale(1) brightness(0.5);
  transform-origin: center;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.gallery-item img, 
.gallery-item video, 
.gallery-item iframe {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border: none;
  pointer-events: none;
}

.gallery-item::before,
.gallery-item::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 100%;
  right: calc(var(--index) * -1);
}

.gallery-item::after {
  left: calc(var(--index) * -1);
}

.items .gallery-item:hover {
  transform: translateZ(calc(var(--index) * 10)) scale(1.02);
  filter: grayscale(0) brightness(1);
  box-shadow: 0 calc(var(--index) * 2) calc(var(--index) * 4) rgba(0, 0, 0, 0.5);
}

/* Right side cascade */
.items .gallery-item:hover + * {
  transform: translateZ(calc(var(--index) * 8.5)) rotateY(35deg);
  filter: grayscale(0) brightness(0.9);
  z-index: -1;
}

.items .gallery-item:hover + * + * {
  transform: translateZ(calc(var(--index) * 5.6)) rotateY(40deg);
  filter: grayscale(0.3) brightness(0.8);
  z-index: -2;
}

.items .gallery-item:hover + * + * + * {
  transform: translateZ(calc(var(--index) * 2.4)) rotateY(30deg);
  filter: grayscale(0.5) brightness(0.7);
  z-index: -3;
}

.items .gallery-item:hover + * + * + * + * {
  transform: translateZ(calc(var(--index) * 0.6)) rotateY(14deg);
  filter: grayscale(0.7) brightness(0.6);
  z-index: -4;
}

/* Left side cascade */
.gallery-item:has(+ :hover) {
  transform: translateZ(calc(var(--index) * 8.5)) rotateY(-35deg);
  filter: grayscale(0) brightness(0.9);
}

.gallery-item:has(+ * + :hover) {
  transform: translateZ(calc(var(--index) * 5.6)) rotateY(-40deg);
  filter: grayscale(0.3) brightness(0.8);
}

.gallery-item:has(+ * + * + :hover) {
  transform: translateZ(calc(var(--index) * 2.4)) rotateY(-30deg);
  filter: grayscale(0.5) brightness(0.7);
}

.gallery-item:has(+ * + * + * + :hover) {
  transform: translateZ(calc(var(--index) * 0.6)) rotateY(-14deg);
  filter: grayscale(0.7) brightness(0.6);
}

/* Active / Focus State */
.items .gallery-item:active,
.items .gallery-item:focus {
  width: 32vw;
  transform: translateZ(calc(var(--index) * 10)) scale(1);
  filter: grayscale(0) brightness(1);
  z-index: 100;
  margin: 0 1vw;
  outline: none;
  box-shadow: 0 calc(var(--index) * 3) calc(var(--index) * 6) rgba(0, 0, 0, 0.7);
}

/* Caption formatting */
.item-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  padding: 20px 15px 15px;
  font-size: calc(var(--index) * 0.5);
  font-weight: 500;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
  pointer-events: none;
}

.gallery-item:hover .item-caption,
.gallery-item:focus .item-caption {
  opacity: 1;
  transform: translateY(0);
}
`,
  js: `(() => {
  function initAccordion() {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach((item) => {
      // Add tabindex for focus/active state triggers
      if (!item.hasAttribute('tabindex')) {
        item.setAttribute('tabindex', '1');
      }
      
      // Try to construct a nice caption if not present
      if (!item.querySelector('.item-caption')) {
        const img = item.querySelector('img');
        const video = item.querySelector('video');
        let title = "";
        
        if (img) {
          title = img.alt || img.src.split('/').pop()?.split('?')[0] || "Image";
        } else if (video) {
          title = video.src.split('/').pop()?.split('?')[0] || "Video";
          video.muted = true;
          video.autoplay = true;
          video.loop = true;
          video.playsInline = true;
          video.removeAttribute("controls");
          video.play().catch(() => {});
        }
        
        // Clean up file names
        title = decodeURIComponent(title).replace(/\\.[^/.]+$/, "").replace(/[_-]/g, " ");
        
        if (title) {
          const captionDiv = document.createElement('div');
          captionDiv.className = 'item-caption';
          captionDiv.textContent = title;
          item.appendChild(captionDiv);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccordion);
  } else {
    initAccordion();
  }
})()`
};
