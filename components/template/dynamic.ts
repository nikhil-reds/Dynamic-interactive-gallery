import { Template } from "../../lib/templates";

export const dynamicTemplate: Template = {
  id: "dynamic-orbit",
  name: "Dynamic Orbit Gallery",
  description: "A premium circular orbit gallery with sequential bloom reveal, cursor proximity scaling, 3D tilt, and depth-of-field motion.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dynamic Orbit Gallery</title>
  <style>
    {{css}}
  </style>
</head>
<body>
  <main class="orbit-page">
    <section class="orbit-stage" id="orbitStage" aria-label="Circular dynamic gallery">
      <div class="orbit-center" aria-hidden="true">
        <span>Gallery</span>
      </div>

      <div class="orbit-ring orbit-ring-one" aria-hidden="true"></div>
      <div class="orbit-ring orbit-ring-two" aria-hidden="true"></div>

      <div class="orbit-gallery" id="dynamicGallery">
        {{gallery}}
      </div>
    </section>
  </main>
</body>
</html>`,
  css: `* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
  background: #08090c;
}

body {
  min-height: 100vh;
  margin: 0;
  color: #f8fafc;
  background:
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08), transparent 18%),
    radial-gradient(circle at 18% 18%, rgba(45, 212, 191, 0.16), transparent 28%),
    radial-gradient(circle at 84% 78%, rgba(244, 114, 182, 0.14), transparent 26%),
    linear-gradient(135deg, #08090c 0%, #111827 48%, #070a12 100%);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  overflow: hidden;
}

.orbit-page {
  width: 100%;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: clamp(18px, 3vw, 44px);
}

.orbit-stage {
  position: relative;
  width: min(1180px, 96vw);
  height: min(780px, 86vh);
  min-height: 540px;
  overflow: hidden;
  border-radius: clamp(24px, 4vw, 46px);
  border: 1px solid rgba(255, 255, 255, 0.09);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.015)),
    rgba(9, 12, 18, 0.86);
  box-shadow:
    0 40px 120px rgba(0, 0, 0, 0.46),
    inset 0 1px 0 rgba(255, 255, 255, 0.09);
  perspective: 1200px;
  perspective-origin: center;
  transform-style: preserve-3d;
  isolation: isolate;
  cursor: default;
}

.orbit-stage::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(circle at center, black, transparent 76%);
  pointer-events: none;
}

.orbit-center {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  width: clamp(150px, 20vw, 280px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 999px;
  color: rgba(248, 250, 252, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.11);
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.06), transparent 64%),
    rgba(255, 255, 255, 0.025);
  box-shadow:
    inset 0 0 60px rgba(255, 255, 255, 0.035),
    0 0 90px rgba(20, 184, 166, 0.12);
  transform: translate(-50%, -50%);
  backdrop-filter: blur(18px);
  pointer-events: none;
  display: none;
}

.orbit-center span {
  font-size: clamp(0.8rem, 1.3vw, 1rem);
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px solid rgba(255, 255, 255, 0.095);
  border-radius: 999px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  display: none;
}

.orbit-ring-one {
  width: min(54vw, 600px);
  height: min(54vw, 600px);
}

.orbit-ring-two {
  width: min(42vw, 460px);
  height: min(42vw, 460px);
  border-style: dashed;
  opacity: 0.62;
}

.orbit-gallery {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.gallery-item {
  position: absolute;
  top: 50%;
  left: 50%;
  width: clamp(68px, 8.2vw, 120px);
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: clamp(16px, 2vw, 26px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #111827;
  box-shadow:
    0 24px 65px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  opacity: 0;
  transform: translate3d(-50%, -50%, 0) scale(0.08);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity, filter;
}

.gallery-item::before {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  display: grid;
  place-items: center;
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  color: #fff;
  background: rgba(5, 8, 16, 0.58);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(12px);
  font-size: 0.7rem;
  font-weight: 850;
  letter-spacing: 0;
  pointer-events: none;
}

.video-item::before {
  content: "PLAY";
}

.pdf-item::before {
  content: "PDF";
}

.gallery-item::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent 32%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.42), transparent 38%);
  opacity: 0.74;
  pointer-events: none;
}

.gallery-item img,
.gallery-item video,
.gallery-item iframe {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border: 0;
  background: #0f172a;
}

.gallery-item video {
  object-position: center;
}

.pdf-item iframe {
  background: #f8fafc;
  pointer-events: none;
}

.pdf-item {
  background:
    linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(203, 213, 225, 0.88)),
    #f8fafc;
}

.pdf-item iframe {
  opacity: 0.82;
  transform: scale(1.08);
  transform-origin: top center;
}

.item-caption {
  display: none !important;
}

.gallery-item.is-focused .item-caption {
  opacity: 1;
  transform: translateY(-2px);
}

.dynamic-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(420px, 88%);
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 22px;
  text-align: center;
  color: rgba(248, 250, 252, 0.72);
  background: rgba(255, 255, 255, 0.04);
  transform: translate(-50%, -50%);
}

@media (max-width: 900px) {
  body {
    overflow: auto;
  }

  .orbit-page {
    min-height: 100svh;
    padding: 14px;
  }

  .orbit-stage {
    width: 100%;
    height: 78svh;
    min-height: 560px;
  }

  .orbit-ring-one {
    width: min(92vw, 680px);
    height: min(92vw, 680px);
  }

  .orbit-ring-two {
    width: min(70vw, 520px);
    height: min(70vw, 520px);
  }
}

@media (max-width: 560px) {
  .orbit-stage {
    height: 74svh;
    min-height: 520px;
    border-radius: 24px;
  }

  .orbit-center {
    width: 132px;
  }

  .gallery-item {
    width: clamp(72px, 22vw, 108px);
  }
}`,
  js: `(() => {
  const stage = document.getElementById("orbitStage");
  const gallery = document.getElementById("dynamicGallery");
  if (!stage || !gallery) return;

  let items = Array.from(gallery.querySelectorAll(".gallery-item"));

  if (items.length === 0) {
    gallery.innerHTML = '<div class="dynamic-empty">Add images, videos, or PDFs to begin the circular orbit gallery.</div>';
    return;
  }

  const targetCount = 12;
  if (items.length < targetCount) {
    const originals = items.slice();
    for (let i = items.length; i < targetCount; i += 1) {
      const clone = originals[i % originals.length].cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      gallery.appendChild(clone);
    }
    items = Array.from(gallery.querySelectorAll(".gallery-item"));
  }

  items = items.slice(0, targetCount);
  Array.from(gallery.querySelectorAll(".gallery-item")).forEach((item, index) => {
    if (index >= targetCount) item.style.display = "none";
  });

  const state = items.map((item, index) => ({
    item,
    index,
    angle: (Math.PI * 2 * index) / targetCount - Math.PI / 2,
    x: 0,
    y: 0,
    z: 0,
    scale: 0.08,
    rotateX: 0,
    rotateY: 0,
    opacity: 0,
    blur: 8,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    targetScale: 1,
    targetRotateX: 0,
    targetRotateY: 0,
    targetOpacity: 1,
    targetBlur: 0,
    revealed: false,
    vx: 0,
    vy: 0,
    vz: 0,
    vs: 0,
    vrx: 0,
    vry: 0,
    vo: 0,
    vb: 0,
  }));

  let radius = 300;
  let mouse = { x: 0, y: 0, inside: false };
  let spin = 0;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const springTo = (card, prop, velocityProp, target, stiffness, damping) => {
    card[velocityProp] = (card[velocityProp] + (target - card[prop]) * stiffness) * damping;
    card[prop] += card[velocityProp];
  };

  function updateRadius() {
    const rect = stage.getBoundingClientRect();
    const cardWidth = items[0].getBoundingClientRect().width || 120;
    radius = Math.max(100, Math.min(rect.width, rect.height) * 0.28 - cardWidth * 0.34);
  }

  function setOrbitTargets() {
    const rect = stage.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    let strongestIndex = -1;
    let strongestProximity = 0;

    state.forEach((card) => {
      const angle = card.angle + spin;
      const orbitX = Math.cos(angle) * radius;
      const orbitY = Math.sin(angle) * radius;
      const cardX = centerX + orbitX;
      const cardY = centerY + orbitY;
      const dx = mouse.x - cardX;
      const dy = mouse.y - cardY;
      const distance = Math.hypot(dx, dy);
      const proximity = mouse.inside ? 1 - clamp(distance / 280, 0, 1) : 0;

      if (proximity > strongestProximity) {
        strongestProximity = proximity;
        strongestIndex = card.index;
      }

      const depth = (Math.sin(angle) + 1) / 2;
      const sideTilt = Math.cos(angle) * -16;
      const orbitalTilt = (0.5 - depth) * 12;
      card.targetX = orbitX;
      card.targetY = orbitY;
      card.targetZ = -120 + depth * 260 + proximity * 135;
      card.targetScale = 0.46 + depth * 0.38 + proximity * 0.32;
      card.targetRotateX = orbitalTilt + (proximity ? clamp(-dy / 13, -18, 18) : 0);
      card.targetRotateY = sideTilt + (proximity ? clamp(dx / 13, -22, 22) : 0);
      card.targetOpacity = card.revealed ? 0.36 + depth * 0.58 + proximity * 0.22 : 0;
      card.targetBlur = card.revealed ? Math.max(0, (1 - depth) * 5.2 - proximity * 3.2) : 10;
    });

    state.forEach((card) => {
      const isFocused = card.index === strongestIndex && strongestProximity > 0.1;
      const dofBlur = strongestProximity > 0.16 && !isFocused ? 5.2 * strongestProximity : 0;

      card.targetBlur += dofBlur;
      card.targetOpacity = Math.max(0.18, card.targetOpacity - dofBlur * 0.1);
      card.item.style.zIndex = String(300 + Math.round(card.targetZ) + (isFocused ? 500 : 0));
      card.item.classList.toggle("is-focused", isFocused);

      const video = card.item.querySelector("video");
      if (video) {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.removeAttribute("controls");
        if (isFocused) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }

  function render() {
    spin += 0.0009;
    setOrbitTargets();

    state.forEach((card) => {
      const stiffness = card.revealed ? 0.105 : 0.075;
      springTo(card, "x", "vx", card.targetX, stiffness, 0.74);
      springTo(card, "y", "vy", card.targetY, stiffness, 0.74);
      springTo(card, "z", "vz", card.targetZ, stiffness, 0.72);
      springTo(card, "scale", "vs", card.targetScale, 0.13, 0.68);
      springTo(card, "rotateX", "vrx", card.targetRotateX, 0.12, 0.7);
      springTo(card, "rotateY", "vry", card.targetRotateY, 0.12, 0.7);
      springTo(card, "opacity", "vo", card.targetOpacity, 0.12, 0.74);
      springTo(card, "blur", "vb", card.targetBlur, 0.14, 0.68);

      card.item.style.opacity = card.opacity.toFixed(3);
      const brightness = clamp(1.08 - card.blur * 0.06 + card.z / 1200, 0.62, 1.18);
      const saturation = clamp(1.12 - card.blur * 0.055, 0.62, 1.16);
      card.item.style.filter = "blur(" + card.blur.toFixed(2) + "px) brightness(" + brightness.toFixed(2) + ") saturate(" + saturation.toFixed(2) + ")";
      card.item.style.transform =
        "translate3d(calc(-50% + " + card.x.toFixed(2) + "px), calc(-50% + " + card.y.toFixed(2) + "px), " + card.z.toFixed(2) + "px) " +
        "rotateX(" + card.rotateX.toFixed(2) + "deg) " +
        "rotateY(" + card.rotateY.toFixed(2) + "deg) " +
        "scale(" + card.scale.toFixed(3) + ")";
    });

    requestAnimationFrame(render);
  }

  function reveal() {
    state.forEach((card, index) => {
      window.setTimeout(() => {
        card.revealed = true;
      }, 130 + index * 105);
    });
  }

  stage.addEventListener("mousemove", (event) => {
    const rect = stage.getBoundingClientRect();
    mouse = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      inside: true,
    };
  });

  stage.addEventListener("mouseleave", () => {
    mouse.inside = false;
  });

  window.addEventListener("resize", updateRadius);
  updateRadius();
  reveal();
  render();
})();`
};
