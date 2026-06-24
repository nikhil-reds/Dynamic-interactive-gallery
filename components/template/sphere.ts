import { Template } from "../../lib/templates";

export const sphereTemplate: Template = {
  id: "3d-sphere",
  name: "3D Interactive Sphere",
  description: "An immersive 3D sphere gallery that maps media items on spherical surfaces. Click and drag or touch-swipe to spin in any direction.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>3D Interactive Sphere Gallery</title>
  <style>
    {{css}}
  </style>
</head>
<body>
  <div id="raw-assets" style="display:none">
    {{gallery}}
  </div>

  <div class="gallery-container">
    <div class="sphere-wrapper">
      <div class="sphere-track" id="sphere-track">
        <!-- Generated dynamically by JS -->
      </div>
    </div>
  </div>

  <div class="instructions">Click & drag or swipe to spin the sphere</div>
</body>
</html>`,
  css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: radial-gradient(circle at center, #0f111a 0%, #05060b 100%);
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
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
}

.sphere-wrapper {
  position: relative;
  width: 0;
  height: 0;
  perspective: 1200px;
  transform-style: preserve-3d;
}

.sphere-track {
  position: absolute;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
  will-change: transform;
}

.card {
  position: absolute;
  width: 140px;
  height: 190px;
  left: -70px;
  top: -95px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
  transform-style: preserve-3d;
  backface-visibility: visible;
  transition: border-color 0.4s, box-shadow 0.4s, filter 0.4s;
  cursor: pointer;
}

.card:hover {
  border-color: rgba(99, 102, 241, 0.7);
  box-shadow: 0 0 25px rgba(99, 102, 241, 0.4), 0 15px 35px rgba(0, 0, 0, 0.8);
  filter: brightness(1.15);
}

.card img, .card video, .card iframe {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: none;
}

.instructions {
  position: absolute;
  bottom: 40px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  pointer-events: none;
  background: rgba(15, 23, 42, 0.6);
  padding: 8px 18px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
`,
  js: `(() => {
  const track = document.getElementById('sphere-track');
  if (!track) return;

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

  let galleryItems = itemsData.length > 0 ? itemsData : fallbackImages.map(src => ({ type: "image", src }));

  // We want a good distribution of points for the sphere
  const targetCount = 18;
  while (galleryItems.length < targetCount) {
    galleryItems = [...galleryItems, ...galleryItems];
  }
  const sphereItems = galleryItems.slice(0, targetCount);

  const radius = 320; // Radius of the sphere in pixels

  sphereItems.forEach((item, index) => {
    const cardEl = document.createElement("div");
    cardEl.classList.add("card");

    // Distribute points evenly on a sphere using the Golden Spiral/Fibonacci Sphere algorithm
    const offset = 2 / targetCount;
    const increment = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    const y = ((index * offset) - 1) + (offset / 2);
    const r = Math.sqrt(1 - y * y);
    const phi = index * increment;

    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;

    // Convert coordinates to pixels
    const px = x * radius;
    const py = y * radius;
    const pz = z * radius;

    // Calculate rotation angles to face outward from the center
    const rotateY = Math.atan2(x, z) * (180 / Math.PI);
    const rotateX = -Math.asin(y) * (180 / Math.PI);

    cardEl.style.transform = \`translate3d(\${px}px, \${py}px, \${pz}px) rotateY(\${rotateY}deg) rotateX(\${rotateX}deg)\`;

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

  // Drag and rotation interaction variables
  let isDragging = false;
  let startX = 0, startY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let currentRotationX = 0, currentRotationY = 0;
  let autoRotateSpeed = 0.1;

  const onStart = (e) => {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startX = clientX;
    startY = clientY;
  };

  const onMove = (e) => {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    targetRotationY += deltaX * 0.25;
    targetRotationX -= deltaY * 0.25;

    startX = clientX;
    startY = clientY;
  };

  const onEnd = () => {
    isDragging = false;
  };

  window.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  window.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onEnd);

  function animate() {
    if (!isDragging) {
      targetRotationY += autoRotateSpeed;
    }

    // Smooth physics damping
    currentRotationX += (targetRotationX - currentRotationX) * 0.08;
    currentRotationY += (targetRotationY - currentRotationY) * 0.08;

    track.style.transform = \`rotateX(\${currentRotationX}deg) rotateY(\${currentRotationY}deg)\`;
    requestAnimationFrame(animate);
  }

  animate();
})();`
};
