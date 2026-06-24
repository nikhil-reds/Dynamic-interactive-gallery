import { Template } from "../../lib/templates";

export const cylinderTemplate: Template = {
  id: "3d-cylinder",
  name: "3D Rotating Cylinder",
  description: "An interactive 3D cylinder gallery showcasing rotating media items using mouse scroll wheel or mobile touch swipes.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D Rotating Cylinder Gallery</title>
  <style>
    {{css}}
  </style>
</head>
<body>
  <div id="raw-assets" style="display:none">
    {{gallery}}
  </div>

  <div class="gallery-container">
    <div class="gallery-track" id="gallery-track">
      <!-- Generated dynamically by JS -->
    </div>
  </div>

  <div class="scroll-instructions">Use mouse wheel or swipe to rotate</div>
</body>
</html>`,
  css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: radial-gradient(circle at center, #111218 0%, #060608 100%);
  overflow: hidden;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: system-ui, -apple-system, sans-serif;
  color: #fff;
}

.gallery-container {
  width: 100vw;
  height: 100vh;
  perspective: 1400px; /* Creates the 3D depth illusion */
  display: flex;
  justify-content: center;
  align-items: center;
}

.gallery-track {
  position: relative;
  width: 210px;
  height: 294px;
  transform-style: preserve-3d;
  will-change: transform;
}

.card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  /* Distribute 8 cards evenly around the cylinder (360 / 8 = 45deg) */
  transform: rotateY(calc((var(--i) - 1) * 45deg)) translateZ(315px);
  /* Initial state: dimmed and slightly blurred */
  filter: brightness(0.25) blur(1px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.7);
  transition: filter 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s, border-color 0.6s;
  pointer-events: none; /* Prevents images from interrupting scroll gestures */
}

/* Glow and brightness effect for the active (centered) card */
.card.active {
  filter: brightness(1.1) blur(0px);
  /* Cinematic neon glow */
  box-shadow: 0 0 45px rgba(255, 255, 255, 0.15), 
              0 20px 50px rgba(0, 0, 0, 0.95);
  border-color: rgba(255, 255, 255, 0.25);
}

.card img, .card video, .card iframe {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: none;
}

.scroll-instructions {
  position: absolute;
  bottom: 40px;
  color: rgba(255,255,255,0.3);
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
}
`,
  js: `(() => {
  const track = document.getElementById('gallery-track');
  if (!track) return;

  // Extract uploaded images dynamically, fallback to default assets if none are present
  const rawItems = Array.from(document.querySelectorAll("#raw-assets .gallery-item"));
  const itemsData = rawItems.map(item => {
    const img = item.querySelector("img");
    const vid = item.querySelector("video");
    const iframe = item.querySelector("iframe");
    if (img) return { type: "image", src: img.src };
    if (vid) return { type: "video", src: vid.src };
    if (iframe) return { type: "pdf", src: iframe.src };
    return null;
  }).filter(Boolean);

  const fallbackImages = [
    "https://images.unsplash.com/photo-1777534074210-4b8901b61196?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3ODAxMzIzNzR8&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1778546979332-83ab32582bbc?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3ODAxMzI0MjR8&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1778459946050-aa35ea35945a?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3ODAxMzIxNDJ8&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1777574236439-1389363e67c5?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3ODAxMzI0MjR8&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1777195680745-9fb67291b216?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3ODAxMzIyOTZ8&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1779862946979-d17bcaa0c3f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3ODAxMzIyMzR8&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1692501455249-750f71562498?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3ODAxMzI0OTF8&ixlib=rb-4.1.0&q=85",
    "https://images.unsplash.com/photo-1779799881722-fba436788a79?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3ODAxMzIzMzV8&ixlib=rb-4.1.0&q=85"
  ];

  const galleryItems = itemsData.length > 0 ? itemsData : fallbackImages.map(src => ({ type: "image", src }));

  // Ensure exactly 8 items
  const totalCards = 8;
  const cylinderItems = [...galleryItems, ...galleryItems, ...galleryItems].slice(0, totalCards);

  // Generate cards DOM
  cylinderItems.forEach((item, index) => {
    const cardEl = document.createElement("div");
    cardEl.classList.add("card");
    cardEl.style.setProperty("--i", String(index + 1));

    if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.src;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      cardEl.appendChild(video);
    } else if (item.type === "pdf") {
      const iframe = document.createElement("iframe");
      iframe.src = item.src;
      cardEl.appendChild(iframe);
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = "Demo Asset";
      cardEl.appendChild(img);
    }

    track.appendChild(cardEl);
  });

  const cards = track.querySelectorAll('.card');

  let targetRotation = 0;  // User's scroll destination
  let currentRotation = 0; // Smoothed animation angle
  const anglePerCard = 360 / totalCards; // 45 degrees

  // 1. Smooth infinite scroll (Mouse wheel)
  window.addEventListener('wheel', (e) => {
    // Determine direction: rotate by exactly one card per scroll tick
    const direction = e.deltaY > 0 ? -1 : 1;
    targetRotation += direction * anglePerCard;
  });

  // 2. Mobile touch support (Swipes)
  let startX = 0;
  window.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
  window.addEventListener('touchend', (e) => {
    const diffX = startX - e.changedTouches[0].clientX;
    if (Math.abs(diffX) > 50) { // If swipe distance is significant
      const direction = diffX > 0 ? -1 : 1;
      targetRotation += direction * anglePerCard;
    }
  });

  // 3. Dynamic active card detection
  function updateActiveCard() {
    // Normalize rotation angle to index range 0-7
    let normalizedAngle = Math.round(currentRotation / anglePerCard) % totalCards;
    if (normalizedAngle < 0) normalizedAngle += totalCards;
    
    // Calculate active index matching CSS --i property order
    const activeIndex = (totalCards - normalizedAngle) % totalCards;

    cards.forEach((card, index) => {
      if (index === activeIndex) {
        card.classList.add('active');
        const video = card.querySelector('video');
        if (video) {
          video.play().catch(() => {});
        }
      } else {
        card.classList.remove('active');
        const video = card.querySelector('video');
        if (video) {
          video.pause();
        }
      }
    });
  }

  // 4. Main animation loop (Smooth Lerp)
  function animate() {
    currentRotation += (targetRotation - currentRotation) * 0.08;
    track.style.transform = \`rotateY(\${currentRotation}deg)\`;
    updateActiveCard();
    requestAnimationFrame(animate);
  }

  animate();
})();`
};
