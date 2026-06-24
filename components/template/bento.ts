import { Template } from "../../lib/templates";

export const bentoTemplate: Template = {
  id: "bento-clay-float",
  name: "Bento Floating Clay",
  description: "A trendy 3D fanning clay card stack that expands dynamically on scroll.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Premium Card Stack Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    {{css}}
  </style>
</head>
<body>
  <div class="grid-overlay"></div>

  <div class="stack-wrapper">
    <div class="card-stack" id="heroCardStack">
      <div class="stack-card card-bottom"></div>
      <div class="stack-card card-middle"></div>
      <div class="stack-card card-top">
        <div class="card-icon-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
        </div>
        <div class="card-top-content">Gallery</div>
      </div>
    </div>
  </div>

  <div id="rawGallery" style="display: none;">
    {{gallery}}
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
</body>
</html>`,
  css: `:root {
  --bg-body: #f8f9fb;
  --text-dark: #2c2d33;
  --text-gray: #7a7b82;
  --clay-white: #ffffff;
  --clay-purple: #e9eaf5;
  --clay-dark: #373840;
  
  /* 3D Matte Chunky Clay Shadows */
  --clay-shadow-light: 8px 8px 24px rgba(0, 0, 0, 0.04),
    -8px -8px 24px rgba(255, 255, 255, 1),
    inset 2px 2px 8px rgba(255, 255, 255, 0.8),
    inset -2px -2px 8px rgba(0, 0, 0, 0.03);
  --clay-shadow-deep: 15px 20px 30px rgba(0, 0, 0, 0.08),
    -10px -10px 20px rgba(255, 255, 255, 0.9),
    inset 3px 3px 10px rgba(255, 255, 255, 0.9),
    inset -3px -3px 10px rgba(0, 0, 0, 0.04);
  --clay-shadow-btn: 4px 4px 10px rgba(0, 0, 0, 0.05),
    -2px -2px 8px rgba(255, 255, 255, 0.8),
    inset 1px 1px 3px rgba(255, 255, 255, 0.8),
    inset -1px -1px 3px rgba(0, 0, 0, 0.03);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-body);
  color: var(--text-dark);
  font-family: "Inter", sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  min-height: 180vh; /* height to facilitate scrollTrigger */
}

/* Clinical SaaS Grid Overlay */
.grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.02) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: -1;
  pointer-events: none;
}

.stack-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(1120px, 92vw);
  height: min(740px, 82vh);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 3D Card Stack */
.card-stack {
  position: relative;
  width: 100%;
  height: 100%;
}

.stack-card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(145px, 16vw, 230px);
  height: clamp(190px, 21vw, 305px);
  border-radius: 28px;
  background: var(--clay-white);
  box-shadow: var(--clay-shadow-deep);
  border: 2px solid rgba(255, 255, 255, 0.8);
  transform-origin: center center;
  will-change: transform;
  overflow: hidden;
  padding: 8px;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.82);
}

.stack-card img, .stack-card video, .stack-card canvas {
  position: absolute;
  inset: 8px;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  object-fit: cover;
  display: block;
  border-radius: 20px;
  border: none;
  z-index: 0;
}

.stack-card .pdf-placeholder {
  position: absolute;
  inset: 8px;
  display: grid;
  place-items: center;
  padding: 24px;
  border-radius: 20px;
  background: linear-gradient(145deg, #ffffff, #dde3ef);
  color: var(--clay-dark);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  z-index: 0;
  transition: opacity 0.3s ease;
}

.stack-card .pdf-placeholder svg {
  width: 44px;
  height: 44px;
  margin-bottom: 10px;
  color: #ef4444;
}

.card-bottom {
  transform: rotate(-15deg) translate(-20px, 10px) scale(0.9);
  background: #e0e5ec;
}

.card-middle {
  transform: rotate(-5deg) translate(-10px, 5px) scale(0.95);
  background: #d0c8d8;
}

.card-top {
  transform: rotate(8deg);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
}

.stack-card.has-overlay::after,
.card-top::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 60%);
  z-index: 1;
  pointer-events: none;
}

.card-top-content {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 22px;
  z-index: 2;
  color: white;
  font-size: clamp(14px, 1.8vw, 20px);
  font-weight: 500;
  line-height: 1.1;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.35);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-icon-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: var(--clay-shadow-btn);
  z-index: 2;
}

.card-icon-btn svg {
  width: 14px;
  height: 14px;
  stroke: #333;
}

@media (max-width: 720px) {
  body {
    min-height: 220vh;
  }

  .stack-wrapper {
    width: 100vw;
    height: 88vh;
  }

  .stack-card {
    width: clamp(118px, 33vw, 165px);
    height: clamp(158px, 44vw, 220px);
    border-radius: 22px;
  }
}
`,
  js: `
(() => {
  function initBentoClayStack() {
    const rawGallery = document.getElementById("rawGallery");
    const heroCardStack = document.getElementById("heroCardStack");

    if (!rawGallery || !heroCardStack || heroCardStack.dataset.populated === "true") return;

    const rawItems = Array.from(rawGallery.querySelectorAll(".gallery-item"));
    if (rawItems.length === 0) return;

    heroCardStack.dataset.populated = "true";

    heroCardStack.innerHTML = "";

    const getItemMedia = (item) => {
      const img = item.querySelector("img");
      const video = item.querySelector("video");
      const canvas = item.querySelector("canvas");
      const iframe = item.querySelector("iframe");
      const caption = item.querySelector(".item-caption, .pdf-title");
      const name = (caption && caption.textContent && caption.textContent.trim()) || "Gallery";

      if (img) return { type: "img", url: img.currentSrc || img.src || img.getAttribute("src") || "", name };
      if (video) return { type: "video", url: video.currentSrc || video.src || video.getAttribute("src") || "", name };
      if (canvas || iframe || item.dataset.pdf) return { type: "pdf", url: item.dataset.pdf || (iframe ? iframe.src : ""), name };
      return { type: "img", url: "", name };
    };

    const addCardOverlay = (cardEl, title) => {
      cardEl.classList.add("has-overlay");
      cardEl.insertAdjacentHTML("beforeend", '<div class="card-icon-btn"><svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></div><div class="card-top-content">' + title + '</div>');
    };

    const setCardMedia = (cardEl, item) => {
      if (!cardEl || !item) return;

      const media = getItemMedia(item);
      cardEl.innerHTML = "";

      if (media.type === "video" && media.url) {
        const video = document.createElement("video");
        video.src = media.url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.removeAttribute("controls");
        cardEl.appendChild(video);
      } else if (media.type === "pdf") {
        const canvas = document.createElement("canvas");
        canvas.className = "pdf-canvas";
        cardEl.appendChild(canvas);

        const placeholder = document.createElement("div");
        placeholder.className = "pdf-placeholder";
        placeholder.innerHTML = '<div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg><div>' + media.name + '</div></div>';
        cardEl.appendChild(placeholder);

        if (media.url && typeof pdfjsLib !== "undefined") {
          pdfjsLib.getDocument(media.url).promise
            .then(pdf => pdf.getPage(1))
            .then(page => {
              const viewport = page.getViewport({ scale: 2.0 });
              const context = canvas.getContext("2d");
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              return page.render({ canvasContext: context, viewport }).promise;
            })
            .then(() => {
              placeholder.style.opacity = "0";
            })
            .catch(console.error);
        }
      } else if (media.url) {
        const img = document.createElement("img");
        img.src = media.url;
        img.alt = media.name;
        cardEl.appendChild(img);
      }

      addCardOverlay(cardEl, media.name || "Gallery");
    };

    const cards = rawItems.map((item, index) => {
      const card = document.createElement("article");
      card.className = "stack-card";
      card.dataset.index = String(index);
      heroCardStack.appendChild(card);
      setCardMedia(card, item);
      return card;
    });

    const getCardPosition = (index, total) => {
      const columns = Math.min(5, Math.ceil(Math.sqrt(total + 2)));
      const rows = Math.ceil(total / columns);
      const col = index % columns;
      const row = Math.floor(index / columns);
      const normalizedCol = columns === 1 ? 0 : (col / (columns - 1)) - 0.5;
      const normalizedRow = rows === 1 ? 0 : (row / (rows - 1)) - 0.5;
      const wave = Math.sin(index * 1.37) * 22;

      return {
        x: normalizedCol * Math.min(window.innerWidth * 0.68, 780) + wave,
        y: normalizedRow * Math.min(window.innerHeight * 0.48, 430) + Math.cos(index * 0.9) * 18,
        rotation: -18 + ((index * 11) % 36),
        scale: 0.9 + ((index % 3) * 0.045),
        zIndex: 100 + index
      };
    };

    const applyStaticLayout = () => {
      cards.forEach((card, index) => {
        const pos = getCardPosition(index, cards.length);
        card.style.opacity = "1";
        card.style.zIndex = String(pos.zIndex);
        card.style.transform = "translate(calc(-50% + " + pos.x + "px), calc(-50% + " + pos.y + "px)) rotate(" + pos.rotation + "deg) scale(" + pos.scale + ")";
      });
    };

    if (typeof gsap === "undefined") {
      cards.forEach((card, index) => {
        const pos = getCardPosition(index, cards.length);
        card.style.zIndex = String(pos.zIndex);
        card.animate(
          [
            { opacity: 0, transform: "translate(-50%, -50%) scale(0.72) rotate(0deg)" },
            { opacity: 1, transform: "translate(calc(-50% + " + pos.x + "px), calc(-50% + " + pos.y + "px)) rotate(" + pos.rotation + "deg) scale(" + pos.scale + ")" }
          ],
          { duration: 700, delay: index * 90, easing: "cubic-bezier(.2, .9, .2, 1)", fill: "both" }
        );
      });
      return;
    }

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const introTl = gsap.timeline();
    cards.forEach((card, index) => {
      const pos = getCardPosition(index, cards.length);
      card.style.zIndex = String(pos.zIndex);
      introTl.fromTo(
        card,
        { x: 0, y: 0, scale: 0.72, rotation: 0, opacity: 0 },
        { x: pos.x, y: pos.y, scale: pos.scale, rotation: pos.rotation, opacity: 1, duration: 0.9, ease: "back.out(1.45)" },
        index * 0.045
      );
    });

    const cardTl = gsap.timeline(
      typeof ScrollTrigger !== "undefined"
        ? {
            scrollTrigger: {
              trigger: "body",
              start: "top top",
              end: "bottom bottom",
              scrub: 1
            }
          }
        : {}
    );
    
    cards.forEach((card, index) => {
      const pos = getCardPosition(index, cards.length);
      const driftX = Math.sin(index * 1.9) * 42;
      const driftY = Math.cos(index * 1.4) * 34;
      cardTl.to(card, {
        x: pos.x + driftX,
        y: pos.y + driftY,
        rotation: pos.rotation + Math.sin(index) * 10,
        ease: "none"
      }, 0);
    });

    window.addEventListener("resize", applyStaticLayout);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBentoClayStack, { once: true });
  } else {
    initBentoClayStack();
  }
})();
`
};
