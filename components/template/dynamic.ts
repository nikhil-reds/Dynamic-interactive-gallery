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
  perspective: 1400px;
  isolation: isolate;
  cursor: none;
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
}

.orbit-ring-one {
  width: min(72vw, 820px);
  height: min(72vw, 820px);
}

.orbit-ring-two {
  width: min(56vw, 620px);
  height: min(56vw, 620px);
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
  width: clamp(86px, 10vw, 148px);
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
  will-change: transform, opacity, filter;
}

.gallery-item::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent 32%),
    linear-gradient(0deg, rgba(0, 0, 0, 0.42), transparent 38%);
  opacity: 0.65;
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
}

.item-caption {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: 2;
  padding: 8px 10px;
  border-radius: 999px;
  color: #fff;
  background: rgba(4, 8, 16, 0.62);
  backdrop-filter: blur(10px);
  font-size: clamp(0.62rem, 1vw, 0.78rem);
  font-weight: 750;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  }));

  let radius = 300;
  let mouse = { x: 0, y: 0, inside: false };
  let spin = 0;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const spring = (current, target, strength) => current + (target - current) * strength;

  function updateRadius() {
    const rect = stage.getBoundingClientRect();
    const cardWidth = items[0].getBoundingClientRect().width || 120;
    radius = Math.max(150, Math.min(rect.width, rect.height) * 0.38 - cardWidth * 0.34);
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
      const proximity = mouse.inside ? 1 - clamp(distance / 230, 0, 1) : 0;

      if (proximity > strongestProximity) {
        strongestProximity = proximity;
        strongestIndex = card.index;
      }

      const depth = (Math.sin(angle) + 1) / 2;
      card.targetX = orbitX;
      card.targetY = orbitY;
      card.targetZ = depth * 90;
      card.targetScale = 0.86 + depth * 0.18 + proximity * 0.36;
      card.targetRotateX = proximity ? clamp(-dy / 16, -15, 15) : 0;
      card.targetRotateY = proximity ? clamp(dx / 16, -18, 18) : 0;
      card.targetOpacity = card.revealed ? 0.72 + depth * 0.22 + proximity * 0.18 : 0;
      card.targetBlur = card.revealed ? Math.max(0, 2.2 - depth * 1.6 - proximity * 2.2) : 8;
    });

    state.forEach((card) => {
      const isFocused = card.index === strongestIndex && strongestProximity > 0.14;
      const dofBlur = strongestProximity > 0.18 && !isFocused ? 3.8 * strongestProximity : 0;

      card.targetBlur += dofBlur;
      card.targetOpacity = Math.max(0.34, card.targetOpacity - dofBlur * 0.08);
      card.item.style.zIndex = String(100 + Math.round(card.targetZ) + (isFocused ? 300 : 0));
      card.item.classList.toggle("is-proximate", isFocused);

      const video = card.item.querySelector("video");
      if (video) {
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
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
      const strength = card.revealed ? 0.14 : 0.09;
      card.x = spring(card.x, card.targetX, strength);
      card.y = spring(card.y, card.targetY, strength);
      card.z = spring(card.z, card.targetZ, strength);
      card.scale = spring(card.scale, card.targetScale, strength);
      card.rotateX = spring(card.rotateX, card.targetRotateX, 0.18);
      card.rotateY = spring(card.rotateY, card.targetRotateY, 0.18);
      card.opacity = spring(card.opacity, card.targetOpacity, 0.13);
      card.blur = spring(card.blur, card.targetBlur, 0.16);

      card.item.style.opacity = card.opacity.toFixed(3);
      card.item.style.filter = "blur(" + card.blur.toFixed(2) + "px) saturate(" + (1.06 - card.blur * 0.05).toFixed(2) + ")";
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
