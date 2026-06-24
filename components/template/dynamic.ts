import { Template } from "../../lib/templates";

export const dynamicTemplate: Template = {
  id: "dynamic-orbit",
  name: "Dynamic Orbit Gallery",
  description: "A premium scroll-driven circular rotating gallery.",
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
  <section class="wrapper">
    {{gallery}}
  </section>

  <div class="icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mouse">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 3m0 4a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-4a4 4 0 0 1 -4 -4z" />
      <path d="M12 7l0 4" />
      <path d="M8 26l4 4l4 -4">
        <animateTransform attributeType="XML" attributeName="transform" type="translate" values="0 0; 0 4; 0 0" dur="1s" repeatCount="indefinite" />
      </path>
    </svg>
  </div>
</body>
</html>`,
  css: `@import url(https://fonts.bunny.net/css?family=just-me-again-down-here:400);
@layer base, mouse, demo;

@layer demo {
  @property --rotate {
    syntax: "<number>";
    inherits: true;
    initial-value: 0;
  }
 
  body {
    height: 1200svh;
    margin: 0;
   
    animation: --page-rotate 1s linear;
    animation-timeline: scroll(nearest block);
  
    /** this allows us to rotate to exactly each card.
    BUT, it either needs to be set via JS or hardcoded as we can't access the .wrapper sibling-count() value from the body */
    --cards: 20;
    animation-timing-function: steps(var(--cards)); 
  }
  
  @keyframes --page-rotate {
    to { --rotate: 1; }
  }
  
  .wrapper {
    --card-border-radius: 14px;
    --cards: 20;
    --card-width: max(150px, 20vw);
    
    --card-height: calc(var(--card-width) * 6 / 4);
    /* radius large enough so cards don't overlap */
    --radius: calc(var(--card-width) * var(--cards) / (2 * 3.1416));

    font-family: 'Just Me Again Down Here', handwriting;
    position: fixed;
    width: calc(var(--radius) * 2);
    height: calc(var(--radius) * 2);
  
    /* center circle so top card is visible */
    top: calc(50% + var(--radius) + var(--card-height) * 2);
    left: 50%;
    transform-origin: center center;
    transform: translateX(-50%) rotate(calc(var(--rotate) * 360deg));
    transition: transform 300ms linear;
  }
  
  .wrapper > div {
    --card-i: 1;
    
    /* card position around circle*/
    --card-offset-radius: circle(var(--radius) at 50% 50%);
    --card-offset-distance: calc((var(--card-i) - 1) / var(--cards) * 100%);
  
    /* current card positioning relative to --rotate to detect "top" card */
    --card-phase: calc((var(--card-i) - 1) / var(--cards) - 0.75);
    --card-pos: mod(calc(var(--card-phase) + var(--rotate) + 1), 1);
    --card-dist: min(var(--card-pos), calc(1 - var(--card-pos)));
    
    --card-grayscale: clamp(0, calc(var(--card-dist) * var(--cards)), 1);
    --card-opacity: calc(1 - (var(--card-dist) / 0.15 ));
  
    /* blur */
    --card-focus-range: .1;
    --card-max-blur: 7px;
    --card-norm-dist: min(var(--card-dist), var(--card-focus-range));
    --card-blur-progress: calc(var(--card-norm-dist) / var(--card-focus-range));
    --card-blur: calc(var(--card-blur-progress) * var(--card-max-blur));
  
    /* caption */
    --caption-active: clamp(0, 1 - (var(--card-dist) / 0.001), 1);
    --caption-opacity: var(--caption-active);
    --caption-y: calc(-150px * (1 - var(--caption-active)));
  
    filter: blur(var(--card-blur)) grayscale(var(--card-grayscale));
    opacity: var(--card-opacity);
    container: size;
    
    offset-path: var(--card-offset-radius);
    offset-distance: var(--card-offset-distance);
    offset-rotate: auto;
    offset-anchor: 50% 100%;
  
    position: absolute;
    width: var(--card-width);
    aspect-ratio: 4/6;
    border-radius: var(--card-border-radius);
    transition: all 300ms ease-in-out;
    transform-origin: center calc(var(--card-height) * 2 * -1);
  }
  
  .wrapper > div::after {
    content: attr(data-title);
    position: absolute;
    top: 100%;
    left: 1rem;
    opacity: var(--caption-opacity);
    translate: 0 var(--caption-y);
    font-size: clamp(1.8rem, 2vw + 0.5rem, 2.5rem);
    z-index: -1;
    transition: opacity 300ms ease-in-out, translate 300ms ease-in-out;
  }
  
  .wrapper > div > img,
  .wrapper > div > video,
  .wrapper > div > iframe {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
    display: block;
    border: none;
  }
}

@layer mouse {
  .mouse {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    translate: -50% 0;
    display: block;
    width: 50px;
    height: 50px;
    opacity: 1;
    color: var(--mouse-color);
    display: none;
    animation-name: mouse;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    animation-timeline: scroll(nearest block);
  }
  @supports (animation-timeline: scroll()) {
    .mouse {
      display: block;
    }
  }
  @keyframes mouse {
    75% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}

@layer base {
  * {
    box-sizing: border-box;
  }
  :root {
    color-scheme: light dark;
    --bg-dark: rgb(16, 24, 40);
    --bg-light: rgb(248, 244, 238);
    --txt-light: rgb(10, 10, 10);
    --txt-dark: rgb(245, 245, 245);
    --line-light: rgba(0 0 0 / .25);
    --line-dark: rgba(255 255 255 / .25);
    
    --clr-bg: light-dark(var(--bg-light), var(--bg-dark));
    --clr-txt: light-dark(var(--txt-light), var(--txt-dark));
    --clr-lines: light-dark(var(--line-light), var(--line-dark));
  }
 
  body {
    background-color: var(--clr-bg);
    color: var(--clr-txt);
    min-height: 100svh;
    margin: 0;
    padding: 2rem;
    font-family: system, sans-serif;
    font-size: 1rem;
    line-height: 1.5;
    display: grid;
    place-items: center;
    gap: 2rem;
  }
  h1 {
    margin: 0;
    font-size: 1.2rem;
  }
  @supports not (animation-timeline: scroll()) {
    body::before {
      content: "Sorry, your browser doesn't support animation-timeline";
      position: fixed;
      top: 2rem;
      left: 50%;
      translate: -50% 0;
      font-size: 0.8rem;
      z-index: 1000;
    }
  }
}`,
  js: `(() => {
  function initScrollOrbit() {
    const wrapper = document.querySelector('.wrapper');
    if (!wrapper) return;
    
    const items = Array.from(wrapper.children);
    const total = items.length;
    if (total === 0) return;

    // Set layout parameters on container and body
    document.body.style.setProperty('--cards', total);
    wrapper.style.setProperty('--cards', total);

    items.forEach((item, index) => {
      item.style.setProperty('--card-i', index + 1);
      
      // Pull dynamic titles
      const img = item.querySelector('img');
      const video = item.querySelector('video');
      const iframe = item.querySelector('iframe');
      
      let title = "Gallery Item";
      if (img) {
        title = img.alt || img.src.split('/').pop().split('?')[0] || "Image";
      } else if (video) {
        title = video.src.split('/').pop().split('?')[0] || "Video";
        video.muted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.removeAttribute("controls");
        video.play().catch(() => {});
      } else if (iframe) {
        const urlSegments = iframe.src.split('/');
        title = urlSegments[urlSegments.length - 1].split('?')[0] || "Document";
      }
      
      if (!item.getAttribute('data-title')) {
        item.setAttribute('data-title', title);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollOrbit);
  } else {
    initScrollOrbit();
  }
})()`
};
