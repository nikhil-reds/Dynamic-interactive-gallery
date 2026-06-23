import { Template } from "../../lib/templates";

export const clayTemplate: Template = {
  id: "clay-sphere",
  name: "Clay 3D Sphere",
  description: "A premium 3D Fibonacci sphere gallery using GSAP scroll animation and clay-like design accents.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DermExcel Showcase</title>
  <style>
    {{css}}
  </style>
</head>
<body>
  <div class="grid-overlay"></div>

  <section class="gallery-container">
    <div class="scene">
      <div class="sphere" id="sphere">
      </div>
    </div>

    <svg class="network-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M0,50 Q25,30 50,50 T100,50" stroke="rgba(255,255,255,0.05)" stroke-width="0.2" fill="none" />
      <path d="M20,0 L80,100" stroke="rgba(255,255,255,0.03)" stroke-width="0.2" fill="none" />
    </svg>
  </section>

  <section class="journey-section">
    <div class="constellation" id="constellation">
    </div>
  </section>

  <div id="rawGallery" style="display: none;">
    {{gallery}}
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
</body>
</html>`,
  css: `:root {
  --bg-dark: #0a0a0b;
  --text-main: #f4f4f5;
  --text-muted: #a1a1aa;

  /* Clay-like variables */
  --clay-base: #18181b;
  --clay-highlight: rgba(255, 255, 255, 0.08);
  --clay-shadow: rgba(0, 0, 0, 0.9);
  --clay-inset-light: rgba(255, 255, 255, 0.04);
  --clay-inset-dark: rgba(0, 0, 0, 0.6);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-main);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  overflow-x: hidden;
  line-height: 1.5;
}

/* Clinical SaaS Grid Overlay */
.grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0.02) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: -1;
  pointer-events: none;
}

/* Typography */
h1,
h2 {
  font-weight: 500;
  letter-spacing: -0.03em;
}

a {
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}
a:hover {
  color: var(--text-muted);
}

/* Navigation */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  background: linear-gradient(to bottom, rgba(10, 10, 11, 0.9), transparent);
  backdrop-filter: blur(10px);
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.05em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: var(--clay-base);
  padding: 0.5rem 1rem 0.5rem 2rem;
  border-radius: 40px;
  box-shadow: 4px 4px 10px var(--clay-shadow),
    inset 1px 1px 2px var(--clay-inset-light),
    inset -1px -1px 2px var(--clay-inset-dark);
  border: 1px solid rgba(255, 255, 255, 0.02);
}

/* Clay-like Chunky Buttons */
.btn {
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  color: var(--bg-dark);
  background: var(--text-main);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.chunky-btn {
  box-shadow: 0px 4px 0px rgba(161, 161, 170, 0.4),
    /* Chunky bottom edge */ 0px 6px 10px rgba(0, 0, 0, 0.4),
    inset 0px -2px 5px rgba(0, 0, 0, 0.1),
    inset 0px 2px 5px rgba(255, 255, 255, 0.8);
}
.chunky-btn:active {
  transform: translateY(4px);
  box-shadow: 0px 0px 0px rgba(161, 161, 170, 0.4),
    0px 2px 5px rgba(0, 0, 0, 0.4), inset 0px -1px 2px rgba(0, 0, 0, 0.1);
}

.menu-btn {
  background: var(--clay-base);
  color: var(--text-main);
  box-shadow: 0px 4px 0px #09090a, 0px 6px 10px rgba(0, 0, 0, 0.6),
    inset 1px 1px 2px var(--clay-inset-light);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Hero Section */
.hero {
  padding: 12rem 2rem 4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.chunky-badge {
  background: var(--clay-base);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: var(--text-muted);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 4px 4px 8px var(--clay-shadow),
    inset 2px 2px 4px var(--clay-inset-light),
    inset -2px -2px 4px var(--clay-inset-dark);
}

.hero h1 {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  max-width: 800px;
}
.hero p {
  color: var(--text-muted);
  max-width: 500px;
}

/* 3D Gallery Section */
.gallery-container {
  position: relative;
  height: 300vh; /* Scroll length */
  width: 100%;
}

.scene {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
  overflow: hidden;
}

.sphere {
  position: relative;
  width: 0;
  height: 0;
  transform-style: preserve-3d;
}

/* Clay Card Styling */
.clay-card {
  position: absolute;
  width: 110px;
  height: 150px;
  left: -55px;
  top: -75px;
  background: var(--clay-base);
  border-radius: 24px;
  padding: 8px;
  transform-style: preserve-3d;
  backface-visibility: visible;
  border: 1px solid rgba(255, 255, 255, 0.03);
  /* Matte, chunky clay shadow */
  box-shadow: 8px 8px 16px var(--clay-shadow),
    -4px -4px 10px rgba(255, 255, 255, 0.02),
    inset 3px 3px 6px var(--clay-inset-light),
    inset -3px -3px 6px var(--clay-inset-dark);
  transition: filter 0.4s ease;
}

.clay-card img, .clay-card video, .clay-card canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  filter: grayscale(80%) brightness(0.6);
  transition: all 0.4s ease;
  box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.8);
  display: block;
  border: none;
}

.clay-card.active-card {
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.1));
}
.clay-card.active-card img, .clay-card.active-card video, .clay-card.active-card canvas {
  filter: grayscale(0%) brightness(1);
}

/* Floating Text Side Panels */
.floating-text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  z-index: 10;
  position: sticky;
  margin-left: 10%;
}
.floating-text h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);
}
.floating-text p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.network-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

/* Journey Section */
.journey-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: radial-gradient(circle at center, #111113 0%, var(--bg-dark) 70%);
}

.journey-content {
  text-align: center;
  z-index: 2;
  background: rgba(10, 10, 11, 0.6);
  padding: 3rem;
  border-radius: 24px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.journey-content h2 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.journey-content p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.large-btn {
  font-size: 1.1rem;
  padding: 1rem 2.5rem;
  border-radius: 40px;
}

.constellation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.constellation-card {
  position: absolute;
  width: 100px;
  height: 140px;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .hero h1 {
    font-size: 2.5rem;
  }
  .floating-text {
    position: absolute;
    top: 80%;
    margin-left: 5%;
    width: 90%;
    text-align: center;
  }
  .clay-card {
    width: 80px;
    height: 110px;
    left: -40px;
    top: -55px;
  }
}
`,
  js: `
// Register GSAP Plugins
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

(function() {
  const rawGallery = document.getElementById("rawGallery");
  const sphere = document.getElementById("sphere");
  const titleEl = document.getElementById("dynamic-title");
  const descEl = document.getElementById("dynamic-desc");

  if (!rawGallery || !sphere) return;
  
  let rawItems = Array.from(rawGallery.querySelectorAll(".gallery-item"));
  
  if (rawItems.length > 0) {
    // If we have fewer than 16 items, duplicate them to make a dense sphere
    const targetCount = 16;
    if (rawItems.length < targetCount) {
      const originals = rawItems.slice();
      for (let i = rawItems.length; i < targetCount; i++) {
        const clone = originals[i % originals.length].cloneNode(true);
        rawGallery.appendChild(clone);
      }
      rawItems = Array.from(rawGallery.querySelectorAll(".gallery-item"));
    }

    const radius = window.innerWidth < 768 ? 150 : 300;
    
    rawItems.forEach((item, i) => {
      // Re-class the item to be styled as a clay card
      item.className = "clay-card";
      sphere.appendChild(item);

      // Math for Fibonacci sphere distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / rawItems.length);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      // Calculate rotation so cards face outward relative to the center
      const rotY = Math.atan2(x, z) * (180 / Math.PI);
      const rotX = Math.asin(-y / radius) * (180 / Math.PI);

      item.style.transform = \`translate3d(\${x}px, \${y}px, \${z}px) rotateY(\${rotY}deg) rotateX(\${rotX}deg)\`;
      item.dataset.index = i;
    });

    const textContent = [
      {
        title: "Running Through Reflection",
        desc: "One photo was taken on a rainy day at a running track. It is a tape of water covered the surface, and as the runner sped by, their silhouette reflected in the water. The image reflects an abstract, artistic quality, enhancing the sense of movement in the memory."
      },
      {
        title: "Elegance in Boldness",
        desc: "This photo was captured in a controlled studio environment, emphasizing strong features and deep contrast."
      },
      {
        title: "Dynamic Moments",
        desc: "Capturing the pure essence of speed and raw emotion in a split-second frame."
      },
      {
        title: "Abstract Movement",
        desc: "The flow of time expressed visually through long exposures and deliberate camera movement."
      }
    ];

    const allCards = document.querySelectorAll(".clay-card");

    function updateActiveCard(progress) {
      const textIndex = Math.floor(progress * textContent.length) % textContent.length;

      if (titleEl && titleEl.innerText !== textContent[textIndex].title) {
        gsap.to([titleEl, descEl], {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            if (titleEl) titleEl.innerText = textContent[textIndex].title;
            if (descEl) descEl.innerText = textContent[textIndex].desc;
            gsap.to([titleEl, descEl], { opacity: 1, duration: 0.2 });
          }
        });
      }

      const focusIndex = Math.floor(progress * rawItems.length);
      allCards.forEach((card, idx) => {
        if (Math.abs(idx - focusIndex) < 2) {
          card.classList.add("active-card");
        } else {
          card.classList.remove("active-card");
        }
      });
    }

    // Animate Sphere on Scroll
    gsap.to(sphere, {
      rotateY: 360 * 2,
      rotateX: 45,
      ease: "none",
      scrollTrigger: {
        trigger: ".gallery-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => updateActiveCard(self.progress)
      }
    });
  }

  // Generate Scatter/Constellation in Journey Section
  const constellation = document.getElementById("constellation");
  if (constellation) {
    // Find all images and canvases from our sphere cards
    const images = Array.from(document.querySelectorAll('.clay-card img, .clay-card canvas')).map(el => {
      if (el.tagName.toLowerCase() === 'img') {
        return el.src;
      } else if (el.tagName.toLowerCase() === 'canvas') {
        // Draw standard representation or fetch dataset if we want
        return '';
      }
      return '';
    }).filter(Boolean);

    // If no images (e.g. only videos/pdfs), fallback to placeholder or skip
    if (images.length > 0) {
      const scatterPositions = [
        { top: "10%", left: "15%" },
        { top: "20%", left: "80%" },
        { top: "60%", left: "10%" },
        { top: "75%", left: "85%" },
        { top: "85%", left: "30%" },
        { top: "15%", left: "50%" }
      ];

      scatterPositions.forEach((pos, i) => {
        const card = document.createElement("div");
        card.classList.add("clay-card", "constellation-card");
        card.style.top = pos.top;
        card.style.left = pos.left;

        const rot = (Math.random() - 0.5) * 40;
        card.style.transform = \`rotate(\${rot}deg) scale(0.8)\`;

        const img = document.createElement("img");
        img.src = images[i % images.length];
        card.appendChild(img);

        constellation.appendChild(card);
      });

      gsap.to(".constellation-card", {
        y: -100,
        ease: "none",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".journey-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }
})();
`
};
