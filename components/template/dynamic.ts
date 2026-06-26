import { Template } from "../../lib/templates";

export const dynamicTemplate: Template = {
  id: "dynamic-orbit",
  name: "Dynamic Orbit Gallery",
  description: "A premium interactive 3D orbit gallery with touch swipe, dragging, and momentum physics.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StoreFrame | Precise Dynamic Orbit</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        {{css}}
    </style>
</head>
<body>
    <section class="news-section">
        <div class="news-header">
            <span class="badge">Newsroom</span>
            <h2 class="headline">Dynamic Orbit</h2>
        </div>
        <div class="carousel-viewport" id="viewport">
            <div class="carousel-container" id="carousel">
                {{gallery}}
            </div>
        </div>
    </section>
</body>
</html>`,
  css: `:root {
    --bg: #f9f9fb;
    --bg-card: #ffffff;
    --txt-main: #111111;
    --txt-muted: #666666;
    --accent: #ff4d00;
    --card-w: 304px; 
    --card-border: rgba(0,0,0,0.03);
    --card-shadow: rgba(0,0,0,0.05);
}

@media (prefers-color-scheme: dark) {
    :root {
        --bg: #0b0c10;
        --bg-card: #161822;
        --txt-main: #f1f3f9;
        --txt-muted: #94a3b8;
        --card-border: rgba(255,255,255,0.05);
        --card-shadow: rgba(0,0,0,0.3);
    }
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { background-color: var(--bg); font-family: 'Inter', sans-serif; overflow: hidden; min-height: 100vh; }

.news-section { padding: 40px 0; text-align: center; height: 100vh; display: flex; flex-direction: column; justify-content: center; }

.news-header { margin-bottom: 20px; z-index: 10; position: relative; }
.headline { font-size: 48px; font-weight: 800; color: var(--txt-main); letter-spacing: -1px; }
.badge { background: var(--bg-card); padding: 6px 16px; border-radius: 100px; font-size: 11px; font-weight: 700; color: var(--txt-muted); border: 1px solid var(--card-border); text-transform: uppercase; margin-bottom: 8px; display: inline-block; }

.carousel-viewport {
    width: 100vw;
    height: 65vh; /* Dynamic Height */
    min-height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1000px; 
    perspective-origin: 50% 50%;
    cursor: grab;
    position: relative;
}

.carousel-viewport:active { cursor: grabbing; }

.carousel-container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--card-w);
    transform-style: preserve-3d;
    will-change: transform;
}

.gallery-item {
    position: absolute;
    width: var(--card-w);
    background: var(--bg-card);
    border-radius: 28px;
    padding: 24px;
    box-shadow: 0 10px 40px var(--card-shadow);
    border: 1px solid var(--card-border);
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    left: 50%;
    top: 50%;
    /* Aligning the center of the card to the center of the container */
    margin-left: -152px; 
    margin-top: -215px; 
}

/* Internal Card Spacing: 20px */
.gallery-item img,
.gallery-item video,
.gallery-item iframe {
    width: 100%;
    aspect-ratio: 4/3;
    border-radius: 20px;
    margin-bottom: 20px;
    object-fit: cover;
    border: none;
    background: #00000008;
}

.card-meta { font-size: 12px; line-height: 16px; font-weight: 700; color: #aaa; margin-bottom: 20px; display: flex; align-items: center; }
.card-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; margin-right: 6px; }

.gallery-item h3 {
    font-size: 20px; line-height: 28px; font-weight: 700; color: var(--txt-main);
    margin-bottom: 20px; 
    text-align: left;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.gallery-item p {
    font-size: 14px; line-height: 20px; color: var(--txt-muted); text-align: left;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

@media (max-width: 768px) {
    .headline { font-size: 32px; }
    .carousel-viewport { height: 60vh; }
}`,
  js: `(() => {
  const carousel = document.getElementById('carousel');
  const viewport = document.getElementById('viewport');
  if (!carousel || !viewport) return;

  let cards = Array.from(carousel.children);

  // If no items were uploaded/scanned in the gallery, inject StoreFrame demo data
  if (cards.length === 0) {
    const rawData = [
      { title: "High-Performance Magento Hosting Solutions", date: "MAR 24, 2026", desc: "Optimized server stacks for industrial-scale e-commerce traffic.", type: "IMAGE", src: "https://picsum.photos/seed/42/400/300" },
      { title: "Automated Scaling with StoreFrame Labs", date: "MAR 22, 2026", desc: "Predictive resource management for enterprise infrastructure.", type: "IMAGE", src: "https://picsum.photos/seed/43/400/300" },
      { title: "Minimalist UI: The Future of Dashboard Design", date: "MAR 20, 2026", desc: "Applying Swiss-style precision to complex technical interfaces.", type: "IMAGE", src: "https://picsum.photos/seed/44/400/300" },
      { title: "Advanced Security Layers for Magento Stores", date: "MAR 18, 2026", desc: "Zero-trust architecture protecting global transaction nodes.", type: "IMAGE", src: "https://picsum.photos/seed/45/400/300" }
    ];
    // Create 12 items for a beautiful dense ring
    const fallbackData = [...rawData, ...rawData, ...rawData];
    fallbackData.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'gallery-item img-item';
      card.innerHTML = \`<img src="\${item.src}" alt="img">\`;
      carousel.appendChild(card);
    });
    cards = Array.from(carousel.children);
  }

  const cardCount = cards.length;
  const cardWidth = 304;
  const countForRadius = Math.max(cardCount, 6);
  const radius = Math.round((cardWidth / 2) / Math.sin(Math.PI / countForRadius));

  // Enhance all gallery-items with rich meta cards content dynamically
  cards.forEach((card, i) => {
    // If it's already pre-populated fallback, skip restructuring
    if (card.querySelector('.card-meta')) return;

    const img = card.querySelector('img');
    const video = card.querySelector('video');
    const iframe = card.querySelector('iframe');

    let name = '';
    let typeLabel = 'IMAGE';
    let mediaHtml = '';

    if (img) {
      name = img.alt || img.src.split('/').pop().split('?')[0];
      typeLabel = 'IMAGE';
      mediaHtml = img.outerHTML;
    } else if (video) {
      name = video.src.split('/').pop().split('?')[0];
      typeLabel = 'VIDEO';
      video.removeAttribute("controls");
      video.muted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      mediaHtml = video.outerHTML;
    } else if (iframe) {
      name = iframe.src.split('/').pop().split('?')[0];
      typeLabel = 'DOCUMENT';
      mediaHtml = iframe.outerHTML;
    }

    const cleanName = name ? decodeURIComponent(name).replace(/\\.[^/.]+$/, "") : \`Asset \${i + 1}\`;
    const capitalizedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    const dateStr = new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();

    const title = capitalizedName;
    const desc = \`Explore this \${typeLabel.toLowerCase()} asset dynamically in 3D space with high-precision orbit controls.\`;

    card.className = 'gallery-item';
    card.innerHTML = \`
      \${mediaHtml}
      <div class="card-meta"><span class="card-dot"></span>\${typeLabel} • \${dateStr}</div>
      <h3>\${title}</h3>
      <p>\${desc}</p>
    \`;
  });

  // Position cards in 3D circle
  cards.forEach((card, i) => {
    const angle = (i * 360) / cardCount;
    card.style.transform = \`rotateY(\${angle}deg) translateZ(\${radius}px) rotateY(180deg)\`;
  });

  // Setup Physics & Inertia Engine
  let currentRotation = 0;
  let velocity = 0; 
  let isDragging = false;
  let lastX = 0;
  let scrollSpeed = 0.15; // Drag sensitivity

  function animate() {
    if (!isDragging) {
      // Apply momentum
      currentRotation += velocity;
      
      // Friction
      velocity *= 0.95; 

      // Idle drift: slow rotation when not being interacted with
      if (Math.abs(velocity) < 0.01) {
        currentRotation -= 0.05; 
      }
    }
    
    carousel.style.transform = \`translate(-50%, -50%) rotateY(\${currentRotation}deg)\`;
    requestAnimationFrame(animate);
  }

  // Play video media
  cards.forEach((card) => {
    const video = card.querySelector('video');
    if (video) {
      video.play().catch(() => {});
    }
  });

  // Interaction Handlers
  const onStart = (e) => {
    isDragging = true;
    lastX = e.pageX || (e.touches ? e.touches[0].pageX : 0);
    velocity = 0; // Kill momentum when grabbed
  };

  const onMove = (e) => {
    if (!isDragging) return;
    if (e.touches) e.preventDefault(); // Stop mobile "bounce"
    
    const x = e.pageX || (e.touches ? e.touches[0].pageX : 0);
    const deltaX = x - lastX;
    
    currentRotation += deltaX * scrollSpeed;
    velocity = deltaX * scrollSpeed;
    lastX = x;
  };

  const onEnd = () => {
    isDragging = false;
  };

  // Event Binding
  viewport.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  viewport.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd);

  window.addEventListener('wheel', (e) => {
    if (e.target.closest('#viewport')) {
      velocity += e.deltaY * 0.01;
    }
  }, { passive: true });

  animate();
})()`
};
