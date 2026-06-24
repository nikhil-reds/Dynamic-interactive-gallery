import { Template } from "../../lib/templates";

export const glowTemplate: Template = {
  id: "glow-carousel",
  name: "Neon Glow Carousel",
  description: "A stunning 3D rotating carousel with neon glow card outlines, custom canvas particles, and buttons.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neon Glow Carousel Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
  <style>
    {{css}}
  </style>
</head>
<body>
  <div class="app">
    
    
    <div class="carousel-wrapper intro-carousel">
      <div class="fog"></div>
      <div class="carousel-container">
        <ul class="carousel" id="glowCarouselList">
        </ul>
      </div>
    </div>
    
    <canvas id="particleCanvas"></canvas>
  </div>

  <div id="rawGallery" style="display: none;">
    {{gallery}}
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>
</body>
</html>`,
  css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  height: 100vh;
  width: 100vw;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(rgb(25, 25, 25), rgb(55, 55, 65));
  font-family: "Montserrat", sans-serif;
  overflow: hidden;
}

#particleCanvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  z-index: 1;
}

li {
  list-style: none;
}

.buttons-row {
  position: absolute;
  top: 2.5rem;
  display: flex;
  gap: 1.5rem;
  z-index: 15;
}

.carousel-btn {
  width: 125px;
  height: 45px;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.15rem;
  outline: none;
  border: none;
  background: transparent;
  position: relative;
  transition: 0.5s ease;
  text-transform: uppercase;
  font-weight: 200;
}

.carousel-btn:hover {
  box-shadow: 0px 0px 10px var(--btncolor), 0px 5px 15px var(--btncolor);
  transform: scale(1.1);
}

.btn-glow {
  background: var(--btncolor);
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 0.5rem;
  filter: blur(5px);
}

.btn-content {
  position: absolute;
  width: calc(100% - 5px);
  height: calc(100% - 5px);
  left: 2.5px;
  top: 2.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--btncolor);
  background: rgb(25, 25, 25);
  border-radius: 0.5rem;
  letter-spacing: 0.15rem;
}

.carousel-btn::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, white, transparent);
  opacity: 20%;
  transition: 0.5s ease;
  z-index: -1;
  border-radius: 0.5rem;
}

#prev-btn {
  color: white;
  --btncolor: hsl(55, 75%, 50%);
  text-shadow: 1px 1px 1px var(--btncolor);
}

#next-btn {
  color: white;
  --btncolor: hsl(225, 65%, 52%);
  text-shadow: 1px 1px 1px var(--btncolor);
}

.carousel-wrapper {
  position: absolute;
  height: 100%;
  width: 800px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  perspective: 200px;
  z-index: 5;
  pointer-events: none;
}

.carousel-container {
  position: absolute;
  height: 1200px;
  transform-style: preserve-3d;
  transform: translateY(5rem) rotateX(70deg);
}

.carousel {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transform-style: preserve-3d;
  transform: rotate(180deg);
}

.fog {
  inset: 0;
  position: absolute;
  background: linear-gradient(to right, black, transparent, black);
  pointer-events: none;
}

.carousel-item-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  transform: rotate(var(--rotate));
}

.item {
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(-90deg);
  --width: 200px;
  --height: 300px;
  transition: 1s ease;
  border-radius: 1rem;
  opacity: 50%;
}

.shadow {
  position: absolute;
  width: calc(var(--width) * 1.15);
  height: calc(var(--height) * 0.55);
  left: 50%;
  top: 0;
  transform: translateX(-50%) translateY(185%) translateZ(85px) rotateX(90deg) scaleY(0.65);
  border-radius: 50%;
  background: radial-gradient(
    closest-side,
    rgba(0, 0, 0, 0.65),
    rgba(0, 0, 0, 0)
  );
  filter: blur(10px);
  transition: opacity 0.5s 0.5s ease;
  pointer-events: none;
}

.hide-shadow {
  opacity: 0;
}

.shadow img, .shadow video, .shadow canvas {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 50%;
  opacity: 0.15;
}

@property --rotation-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.item-glow {
  position: relative;
  height: var(--height);
  width: var(--width);
  background: conic-gradient(
    from var(--rotation-angle),
    var(--glow) 45deg,
    transparent 55deg
  );
  filter: blur(5px);
  border-radius: 1rem;
  animation: animate-glow var(--duration) linear infinite;
}

@keyframes animate-glow {
  100% {
    --rotation-angle: 360deg;
  }
}

.item-side {
  position: absolute;
  width: calc(var(--width) - 5px);
  left: 2.5px;
  height: calc(var(--height) - 5px);
  top: 2.5px;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: absolute;
  height: 100%;
  width: var(--width);
  opacity: 0;
  color: white;
  transition: 0.5s 0.25s ease;
  z-index: 10;
  text-shadow: 1px 1px 1px black;
  pointer-events: none;
}

.item-content h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 10px;
}

.item-content h5 {
  font-weight: 200;
  max-width: 180px;
  font-size: 0.85rem;
}

.active-item {
  transform: rotateX(-75deg) translateY(50px) translateZ(350px) translateX(8.5rem);
  transition: 0.5s ease;
  opacity: 1;
}

.active-item .item-content {
  transform: translateX(-175%) translateY(-25%) scale(1.6);
  opacity: 1;
}

.item-content::after {
  content: "";
  position: absolute;
  height: 150px;
  width: 200px;
  background: var(--glow);
  border-radius: 2rem;
  opacity: 35%;
  filter: blur(50px);
  z-index: -1;
}

.active-item .img-container,
.active-item .item-glow {
  filter: brightness(1.3);
  transform: scale(1.5);
  animation: none;
}

.active-item .item-glow {
  filter: blur(3px);
}

.img-container {
  height: 100%;
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  transition: 0.5s ease;
}

.img-container img, .img-container video, .img-container canvas {
  height: 100%;
  width: 100%;
  object-fit: cover;
  display: block;
  border: none;
}

/* Intro Animations */
.intro-btns {
  opacity: 0;
  animation: intro-btns-anim 1s 0.5s forwards;
  transform: translateY(-3.5rem);
}

@keyframes intro-btns-anim {
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.intro-carousel {
  transform: translateY(5rem);
  opacity: 0;
  animation: intro-carousel-anim 1s 1s forwards;
}

@keyframes intro-carousel-anim {
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
`,
  js: `(() => {
  function initGlowCarousel() {
    const rawGallery = document.getElementById("rawGallery");
    const glowCarouselList = document.getElementById("glowCarouselList");
    if (!rawGallery || !glowCarouselList) return;

    const rawItems = Array.from(rawGallery.querySelectorAll(".gallery-item"));
    if (rawItems.length === 0) return;

    const getItemMedia = (item) => {
      const img = item.querySelector("img");
      const video = item.querySelector("video");
      const canvas = item.querySelector("canvas");
      const iframe = item.querySelector("iframe");
      
      let name = "Public Asset";
      const imgAlt = img ? img.getAttribute("alt") : "";
      if (imgAlt) {
        name = imgAlt.split("/").pop() || imgAlt;
      }
      const caption = item.querySelector(".item-caption, .pdf-title");
      if (caption && caption.textContent && caption.textContent.trim()) {
        name = caption.textContent.trim();
      }

      if (img) return { type: "img", url: img.currentSrc || img.src || img.getAttribute("src") || "", name };
      if (video) {
        const url = video.currentSrc || video.src || video.getAttribute("src") || "";
        return { type: "video", url, name: name === "Public Asset" && url ? url.split("/").pop() || name : name };
      }
      if (canvas || iframe || item.dataset.pdf) {
        const url = item.dataset.pdf || (iframe ? iframe.src : "");
        return { type: "pdf", url, name: name === "Public Asset" && url ? url.split("/").pop() || name : name };
      }
      return { type: "img", url: "", name };
    };

    // Color list to rotate neon glows
    const colors = [
      "hsl(220, 70%, 55%)",
      "hsl(110, 65%, 50%)",
      "hsl(140, 60%, 60%)",
      "hsl(260, 70%, 55%)",
      "hsl(55, 75%, 50%)",
      "hsl(210, 80%, 55%)",
      "hsl(225, 65%, 52%)",
      "hsl(195, 70%, 45%)",
      "hsl(265, 75%, 48%)",
      "hsl(335, 70%, 50%)"
    ];

    glowCarouselList.innerHTML = "";

    const mediaList = rawItems.map((item, idx) => {
      const media = getItemMedia(item);
      const likes = 90 + ((idx * 37) % 260);
      const themeColor = colors[idx % colors.length];
      
      const li = document.createElement("li");
      li.className = "carousel-item-container";
      
      li.innerHTML = \`
        <div class="item">
          <div class="item-glow"></div>
          <div class="item-side front">
            <div class="img-container" id="mediaContainer-\${idx}">
            </div>
          </div>
          <div class="shadow hide-shadow" id="shadowContainer-\${idx}">
          </div>
        </div>
      \`;

      glowCarouselList.appendChild(li);

      // Append actual media tag
      const mediaContainer = li.querySelector("#mediaContainer-" + idx);
      const shadowContainer = li.querySelector("#shadowContainer-" + idx);

      const el = document.createElement("div");
      el.className = "item";
      el.style.setProperty("--glow", themeColor);
      el.style.setProperty("--duration", \`\${Math.random() * 3 + 4}s\`);

      if (media.type === "video" && media.url) {
        const video = document.createElement("video");
        video.src = media.url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        mediaContainer.appendChild(video);
        
        const vidShadow = video.cloneNode(true);
        shadowContainer.appendChild(vidShadow);
      } else if (media.type === "pdf") {
        const canvas = document.createElement("canvas");
        canvas.className = "pdf-canvas";
        mediaContainer.appendChild(canvas);

        const canvasShadow = document.createElement("canvas");
        canvasShadow.className = "pdf-canvas";
        shadowContainer.appendChild(canvasShadow);

        if (media.url && typeof pdfjsLib !== "undefined") {
          pdfjsLib.getDocument(media.url).promise
            .then(pdf => pdf.getPage(1))
            .then(page => {
              const viewport = page.getViewport({ scale: 2.0 });
              const context = canvas.getContext("2d");
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              page.render({ canvasContext: context, viewport });

              const contextShadow = canvasShadow.getContext("2d");
              canvasShadow.height = viewport.height;
              canvasShadow.width = viewport.width;
              page.render({ canvasContext: contextShadow, viewport });
            })
            .catch(console.error);
        }
      } else if (media.url) {
        const img = document.createElement("img");
        img.src = media.url;
        img.alt = media.name;
        mediaContainer.appendChild(img);

        const imgShadow = img.cloneNode(true);
        shadowContainer.appendChild(imgShadow);
      }

      // Apply initial styled properties to item
      const itemNode = li.querySelector(".item");
      itemNode.style.setProperty("--glow", themeColor);
      itemNode.setAttribute("data-likes", String(likes));
      itemNode.setAttribute("data-title", media.name);
      itemNode.style.setProperty("--duration", \`\${Math.random() * 3 + 4}s\`);

      return { li, themeColor, likes };
    });

    const carouselItems = Array.from(glowCarouselList.querySelectorAll(".carousel-item-container"));
    const angle_inc = 360 / carouselItems.length;
    const wrapAngle = 360 - angle_inc;
    let angle = 0;
    let PARTICLE_COLOR = "hsl(210, 80%, 55%)";
    const normalizeAngle = (value) => ((value % 360) + 360) % 360;
    const distanceFromFront = (value) => Math.abs(normalizeAngle(value) - 180);

    carouselItems.forEach((item) => {
      item.style.setProperty("--rotate", \`\${angle}deg\`);
      angle += angle_inc;
    });

    function handleCarousel(action) {
      let activeIndex = 0;
      let activeDistance = Infinity;

      carouselItems.forEach((item, idx) => {
        const currAngle = parseFloat(item.style.getPropertyValue("--rotate"));
        let newAngle;
        if (action === "init") {
          newAngle = normalizeAngle(currAngle);
        } else if (action === "prev") {
          newAngle = normalizeAngle(currAngle - angle_inc);
        } else {
          newAngle = normalizeAngle(currAngle + angle_inc);
        }

        if (Math.abs(newAngle) < 0.001 || Math.abs(newAngle - wrapAngle) < 0.001) {
          item.style.transition = "none";
        } else {
          item.style.transition = "1s ease";
        }
        item.style.setProperty("--rotate", \`\${newAngle}deg\`);

        const frontDistance = distanceFromFront(newAngle);
        if (frontDistance < activeDistance) {
          activeDistance = frontDistance;
          activeIndex = idx;
        }
      });

      carouselItems.forEach((item, idx) => {
        if (idx === activeIndex) {
          item.querySelector(".item").classList.add("active-item");
          item.querySelector(".shadow").classList.remove("hide-shadow");
          
          PARTICLE_COLOR = mediaList[idx].themeColor;
        } else {
          const innerItem = item.querySelector(".item");
          if (innerItem.classList.contains("active-item")) {
            innerItem.classList.remove("active-item");
          }
          item.querySelector(".shadow").classList.add("hide-shadow");
        }
      });
    }

    // Scroll Wheel / Trackpad Gesture Interaction to rotate the carousel
    let isTransitioning = false;
    window.addEventListener("wheel", (e) => {
      if (isTransitioning) return;
      if (Math.abs(e.deltaY) < 15) return; // sensitivity threshold

      if (e.deltaY > 0) {
        isTransitioning = true;
        handleCarousel("next");
      } else if (e.deltaY < 0) {
        isTransitioning = true;
        handleCarousel("prev");
      }

      setTimeout(() => {
        isTransitioning = false;
      }, 1000); // match transition lock
    }, { passive: true });

    // Set initial active state
    handleCarousel("init");

    // Canvas Particles
    const canvas = document.getElementById("particleCanvas");
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");
      const particles = [];

      class Particle {
        constructor(x, y, size, opacity) {
          this.x = x;
          this.y = y;
          this.origY = y;
          this.r = 0;
          this.size = size;
          this.velY = Math.random() * -2 + -1;
          this.toShrink = false;
          this.toDelete = false;
          this.opacity = opacity;
          this.threshold = Math.floor(Math.random() * 150) + 100;
        }

        draw() {
          if (this.r < this.size && !this.toShrink) this.r += 0.25;
          ctx.beginPath();
          ctx.globalAlpha = this.opacity;
          ctx.fillStyle = PARTICLE_COLOR;
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
          ctx.fill();
          if (this.toShrink) {
            if (this.r > 0.5) this.r -= 0.15;
            else this.toDelete = true;
          }
          this.update();
        }

        update() {
          this.y += this.velY;
          if (Math.abs(this.y - this.origY) > this.threshold) {
            this.toShrink = true;
          }
        }
      }

      function generateParticles(count) {
        for (let i = 0; i < count; i++) {
          const posX = Math.random() * window.innerWidth;
          const posY = Math.random() * window.innerHeight;
          const size = Math.floor(Math.random() * 2) + 1;
          const opacity = Math.max(0.35, Math.random());
          particles.push(new Particle(posX, posY, size, opacity));
        }
      }

      generateParticles(35);

      function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, idx) => {
          p.draw();
          if (p.toDelete) {
            particles.splice(idx, 1);
            generateParticles(1);
          }
        });
        requestAnimationFrame(animateParticles);
      }

      animateParticles();
      
      window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      });
    }
  }

  if (document.readyState === "complete" || document.readyState === "interactive") {
    initGlowCarousel();
  } else {
    window.addEventListener("load", initGlowCarousel);
  }
})();
`
};
