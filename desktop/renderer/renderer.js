const canvas = document.getElementById("canvas");
const canvasSurface = document.getElementById("canvas-surface");
const workspace = document.querySelector(".workspace");
const sidebarToggle = document.getElementById("sidebar-toggle");
const canvasZoomOut = document.getElementById("canvas-zoom-out");
const canvasZoomReset = document.getElementById("canvas-zoom-reset");
const canvasZoomIn = document.getElementById("canvas-zoom-in");
const canvasZoomLabel = document.getElementById("canvas-zoom-label");
const assetLists = {
  image: document.getElementById("image-assets"),
  video: document.getElementById("video-assets"),
  pdf: document.getElementById("pdf-assets"),
};
const assetCounts = {
  image: document.getElementById("image-count"),
  video: document.getElementById("video-count"),
  pdf: document.getElementById("pdf-count"),
};

let nextZIndex = 2;
let activeItem = null;
let canvasZoom = 1;
let surfaceWidth = 12000;
let surfaceHeight = 8000;

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function updateSurfaceSize(width, height) {
  surfaceWidth = Math.max(surfaceWidth, width);
  surfaceHeight = Math.max(surfaceHeight, height);
  canvasSurface.style.width = `${surfaceWidth}px`;
  canvasSurface.style.height = `${surfaceHeight}px`;
}

function ensureSurfaceSpace(x, y, width = 0, height = 0) {
  const growth = 4000;
  const edgePadding = 1200;
  let requiredWidth = surfaceWidth;
  let requiredHeight = surfaceHeight;

  while (x + width + edgePadding > requiredWidth) requiredWidth += growth;
  while (y + height + edgePadding > requiredHeight) requiredHeight += growth;
  updateSurfaceSize(requiredWidth, requiredHeight);
}

function clientToSurface(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.max(0, (clientX - rect.left + canvas.scrollLeft) / canvasZoom),
    y: Math.max(0, (clientY - rect.top + canvas.scrollTop) / canvasZoom),
  };
}

function setCanvasZoom(nextZoom) {
  const zoom = clamp(nextZoom, 0.35, 2.5);
  const centerX = (canvas.scrollLeft + canvas.clientWidth / 2) / canvasZoom;
  const centerY = (canvas.scrollTop + canvas.clientHeight / 2) / canvasZoom;

  canvasZoom = zoom;
  canvasSurface.style.zoom = String(canvasZoom);
  canvasZoomLabel.textContent = `${Math.round(canvasZoom * 100)}%`;
  canvas.scrollLeft = centerX * canvasZoom - canvas.clientWidth / 2;
  canvas.scrollTop = centerY * canvasZoom - canvas.clientHeight / 2;
}

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "https://www.google.com";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.includes(".") && !trimmed.includes(" ")) return `https://${trimmed}`;
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}

function setActive(item) {
  document.querySelectorAll(".canvas-item.active").forEach((node) => node.classList.remove("active"));
  activeItem = item;
  if (item) {
    item.classList.add("active");
    item.style.zIndex = String(nextZIndex++);
  }
}

function createBrowserBody(item) {
  const shell = document.createElement("div");
  shell.className = "browser-shell";

  const toolbar = document.createElement("form");
  toolbar.className = "browser-toolbar";

  const back = document.createElement("button");
  back.type = "button";
  back.textContent = "Back";

  const forward = document.createElement("button");
  forward.type = "button";
  forward.textContent = "Forward";

  const reload = document.createElement("button");
  reload.type = "button";
  reload.textContent = "Reload";

  const input = document.createElement("input");
  input.value = "https://www.google.com";
  input.setAttribute("aria-label", "Internet card URL");

  const go = document.createElement("button");
  go.type = "submit";
  go.textContent = "Go";

  const open = document.createElement("button");
  open.type = "button";
  open.textContent = "Open";

  const webview = document.createElement("webview");
  webview.src = "https://www.google.com";
  webview.setAttribute("allowpopups", "true");

  toolbar.append(back, forward, reload, input, go, open);
  shell.append(toolbar, webview);

  toolbar.addEventListener("submit", (event) => {
    event.preventDefault();
    const url = normalizeUrl(input.value);
    input.value = url;
    webview.loadURL(url);
  });

  back.addEventListener("click", () => {
    if (webview.canGoBack()) webview.goBack();
  });

  forward.addEventListener("click", () => {
    if (webview.canGoForward()) webview.goForward();
  });

  reload.addEventListener("click", () => webview.reload());

  open.addEventListener("click", () => {
    window.galleryDesktop.openExternal(webview.getURL() || input.value);
  });

  webview.addEventListener("did-navigate", (event) => {
    input.value = event.url;
    item.querySelector(".item-title").textContent = event.url;
  });

  webview.addEventListener("did-navigate-in-page", (event) => {
    input.value = event.url;
    item.querySelector(".item-title").textContent = event.url;
  });

  webview.addEventListener("focus", () => setActive(item));

  return shell;
}

function createMediaBody(kind, src, title) {
  if (kind === "image") {
    const image = document.createElement("img");
    image.className = "media-content";
    image.src = src;
    image.alt = title;
    image.draggable = false;
    return image;
  }

  if (kind === "video") {
    const video = document.createElement("video");
    video.className = "media-content";
    video.src = src;
    video.controls = true;
    video.preload = "metadata";
    return video;
  }

  const pdf = document.createElement("embed");
  pdf.className = "media-content pdf-content";
  pdf.src = src;
  pdf.type = "application/pdf";
  return pdf;
}

function createTrashIcon() {
  const namespace = "http://www.w3.org/2000/svg";
  const icon = document.createElementNS(namespace, "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");

  const path = document.createElementNS(namespace, "path");
  path.setAttribute(
    "d",
    "M9 3h6l1 2h4v2h-1l-1 14H6L5 7H4V5h4l1-2Zm-1.99 4 .86 12h8.26l.86-12H7.01ZM9 9h2v8H9V9Zm4 0h2v8h-2V9Z"
  );
  icon.append(path);
  return icon;
}

function createToolButton(label, title, className = "") {
  const button = document.createElement("button");
  button.className = `tool-button icon-button ${className}`.trim();
  button.type = "button";
  button.textContent = label;
  button.title = title;
  button.setAttribute("aria-label", title);
  return button;
}

function createCanvasItem(kind, title, x, y, src = "") {
  const item = document.createElement("section");
  item.className = "canvas-item";
  item.dataset.kind = kind;
  item.dataset.src = src;
  const initialWidth = kind === "browser" ? 760 : kind === "pdf" ? 480 : 420;
  const initialHeight = kind === "browser" ? 520 : kind === "pdf" ? 600 : 320;
  item.style.left = `${x}px`;
  item.style.top = `${y}px`;
  item.style.width = `${initialWidth}px`;
  item.style.height = `${initialHeight}px`;
  item.style.zIndex = String(nextZIndex++);
  item.dataset.pinned = "false";
  item.dataset.rotation = "0";
  ensureSurfaceSpace(x, y, initialWidth, initialHeight);

  const header = document.createElement("div");
  header.className = "item-header";

  const itemTitle = document.createElement("div");
  itemTitle.className = "item-title";
  itemTitle.textContent = kind === "browser" ? "https://www.google.com" : title;

  const tools = document.createElement("div");
  tools.className = "tool-row";

  const pin = createToolButton("📌", "Pin card", "pin-button");
  const zoomOut = createToolButton("−", "Zoom card out");
  const zoomIn = createToolButton("+", "Zoom card in");
  const rotate = kind === "image" ? createToolButton("↻", "Rotate image 90 degrees") : null;

  const close = document.createElement("button");
  close.className = "tool-button icon-button delete-button";
  close.type = "button";
  close.setAttribute("aria-label", `Delete ${title}`);
  close.title = "Delete";
  close.append(createTrashIcon());

  tools.append(pin, zoomOut, zoomIn);
  if (rotate) tools.append(rotate);
  tools.append(close);
  header.append(itemTitle, tools);

  const body = document.createElement("div");
  body.className = "item-body";
  body.append(kind === "browser" ? createBrowserBody(item) : createMediaBody(kind, src, title));

  const resizeHandle = document.createElement("div");
  resizeHandle.className = "resize-handle";
  resizeHandle.title = "Resize";

  item.append(header, body, resizeHandle);
  canvasSurface.append(item);
  canvasSurface.querySelector(".empty-state")?.remove();
  setActive(item);

  function setPinned(pinned) {
    item.dataset.pinned = String(pinned);
    item.classList.toggle("pinned", pinned);
    pin.classList.toggle("active", pinned);
    pin.textContent = pinned ? "📍" : "📌";
    pin.title = pinned ? "Unpin card" : "Pin card";
    pin.setAttribute("aria-label", pin.title);
    resizeHandle.setAttribute("aria-hidden", String(pinned));
  }

  function scaleCard(factor) {
    const width = clamp(item.offsetWidth * factor, 220, 1800);
    const height = clamp(item.offsetHeight * factor, 180, 1400);
    const left = Math.max(0, item.offsetLeft - (width - item.offsetWidth) / 2);
    const top = Math.max(0, item.offsetTop - (height - item.offsetHeight) / 2);
    item.style.left = `${left}px`;
    item.style.top = `${top}px`;
    item.style.width = `${width}px`;
    item.style.height = `${height}px`;
    ensureSurfaceSpace(left, top, width, height);
  }

  pin.addEventListener("click", (event) => {
    event.stopPropagation();
    setPinned(item.dataset.pinned !== "true");
    setActive(item);
  });

  zoomOut.addEventListener("click", (event) => {
    event.stopPropagation();
    scaleCard(0.85);
  });

  zoomIn.addEventListener("click", (event) => {
    event.stopPropagation();
    scaleCard(1.15);
  });

  rotate?.addEventListener("click", (event) => {
    event.stopPropagation();
    const rotation = (Number(item.dataset.rotation) + 90) % 360;
    item.dataset.rotation = String(rotation);
    body.querySelector(".media-content").style.transform = `rotate(${rotation}deg)`;
  });

  close.addEventListener("click", (event) => {
    event.stopPropagation();
    item.remove();
    if (activeItem === item) activeItem = null;
  });

  function beginMove(event) {
    if (item.dataset.pinned === "true") return;
    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startY = event.clientY;
    const initialLeft = item.offsetLeft;
    const initialTop = item.offsetTop;
    item.setPointerCapture(pointerId);

    function move(pointerEvent) {
      if (pointerEvent.pointerId !== pointerId) return;
      const left = Math.max(0, initialLeft + (pointerEvent.clientX - startX) / canvasZoom);
      const top = Math.max(0, initialTop + (pointerEvent.clientY - startY) / canvasZoom);
      item.style.left = `${left}px`;
      item.style.top = `${top}px`;
      ensureSurfaceSpace(left, top, item.offsetWidth, item.offsetHeight);
    }

    function stop(pointerEvent) {
      if (pointerEvent.pointerId !== pointerId) return;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      if (item.hasPointerCapture(pointerId)) item.releasePointerCapture(pointerId);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  }

  item.addEventListener("pointerdown", (event) => {
    setActive(item);
    if (item.dataset.pinned === "true") return;
    if (event.target.closest("button, input, form, video, webview, embed, .resize-handle")) return;

    event.preventDefault();
    event.stopPropagation();
    beginMove(event);
  });

  resizeHandle.addEventListener("pointerdown", (event) => {
    if (item.dataset.pinned === "true") return;
    event.preventDefault();
    event.stopPropagation();
    setActive(item);

    const pointerId = event.pointerId;
    const startX = event.clientX;
    const startY = event.clientY;
    const initialWidth = item.offsetWidth;
    const initialHeight = item.offsetHeight;
    resizeHandle.setPointerCapture(pointerId);

    function resize(pointerEvent) {
      if (pointerEvent.pointerId !== pointerId) return;
      const width = Math.max(220, initialWidth + (pointerEvent.clientX - startX) / canvasZoom);
      const height = Math.max(180, initialHeight + (pointerEvent.clientY - startY) / canvasZoom);
      item.style.width = `${width}px`;
      item.style.height = `${height}px`;
      ensureSurfaceSpace(item.offsetLeft, item.offsetTop, width, height);
    }

    function stop(pointerEvent) {
      if (pointerEvent.pointerId !== pointerId) return;
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      if (resizeHandle.hasPointerCapture(pointerId)) resizeHandle.releasePointerCapture(pointerId);
    }

    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
  });

  return item;
}

function getCardData(card) {
  return {
    kind: card.dataset.kind,
    title: card.dataset.title,
    src: card.dataset.src || "",
  };
}

function pointIsInsideCanvas(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}

function beginTouchCardDrag(event, card) {
  if (event.pointerType === "mouse" || !event.isPrimary || event.button !== 0) return;

  event.preventDefault();
  const pointerId = event.pointerId;
  const preview = card.cloneNode(true);
  preview.classList.add("touch-drag-preview");
  preview.setAttribute("aria-hidden", "true");
  document.body.append(preview);

  function positionPreview(pointerEvent) {
    preview.style.left = `${pointerEvent.clientX}px`;
    preview.style.top = `${pointerEvent.clientY}px`;
    canvas.classList.toggle("drag-over", pointIsInsideCanvas(pointerEvent.clientX, pointerEvent.clientY));
  }

  function cleanup() {
    preview.remove();
    canvas.classList.remove("drag-over");
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", drop);
    window.removeEventListener("pointercancel", cancel);
    if (card.hasPointerCapture(pointerId)) card.releasePointerCapture(pointerId);
  }

  function move(pointerEvent) {
    if (pointerEvent.pointerId !== pointerId) return;
    pointerEvent.preventDefault();
    positionPreview(pointerEvent);
  }

  function drop(pointerEvent) {
    if (pointerEvent.pointerId !== pointerId) return;

    if (pointIsInsideCanvas(pointerEvent.clientX, pointerEvent.clientY)) {
      const { x, y } = clientToSurface(pointerEvent.clientX, pointerEvent.clientY);
      const data = getCardData(card);
      createCanvasItem(data.kind, data.title, x, y, data.src);
    }
    cleanup();
  }

  function cancel(pointerEvent) {
    if (pointerEvent.pointerId === pointerId) cleanup();
  }

  card.setPointerCapture(pointerId);
  positionPreview(event);
  window.addEventListener("pointermove", move, { passive: false });
  window.addEventListener("pointerup", drop);
  window.addEventListener("pointercancel", cancel);
}

function makeCardDraggable(card) {
  card.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData(
      "application/x-gallery-desktop-card",
      JSON.stringify(getCardData(card))
    );
    event.dataTransfer.effectAllowed = "copy";
  });

  card.addEventListener("pointerdown", (event) => beginTouchCardDrag(event, card));
}

function createAssetPreview(asset) {
  const preview = document.createElement("div");
  preview.className = `asset-preview ${asset.kind}-preview`;

  if (asset.kind === "image") {
    const image = document.createElement("img");
    image.src = asset.src;
    image.alt = "";
    image.draggable = false;
    preview.append(image);
  } else if (asset.kind === "video") {
    const video = document.createElement("video");
    video.src = asset.src;
    video.muted = true;
    video.preload = "metadata";
    preview.append(video);
  } else {
    preview.textContent = "PDF";
  }

  return preview;
}

function createAssetCard(asset) {
  const card = document.createElement("button");
  card.className = "asset-card media-asset-card";
  card.type = "button";
  card.draggable = true;
  card.dataset.kind = asset.kind;
  card.dataset.title = asset.title;
  card.dataset.src = asset.src;
  card.title = `Drag ${asset.title} onto the canvas`;

  const name = document.createElement("span");
  name.className = "asset-name";
  name.textContent = asset.title;

  card.append(createAssetPreview(asset), name);
  makeCardDraggable(card);
  return card;
}

function renderMediaAssets(assets) {
  const grouped = { image: [], video: [], pdf: [] };
  assets.forEach((asset) => {
    if (grouped[asset.kind]) grouped[asset.kind].push(asset);
  });

  Object.entries(assetLists).forEach(([kind, list]) => {
    const kindAssets = grouped[kind];
    list.replaceChildren(...kindAssets.map(createAssetCard));
    list.classList.toggle("is-empty", kindAssets.length === 0);
    assetCounts[kind].textContent = String(kindAssets.length);
  });

  const availableSources = new Set(assets.map((asset) => asset.src));
  document.querySelectorAll('.canvas-item:not([data-kind="browser"])').forEach((item) => {
    item.classList.toggle("source-missing", !availableSources.has(item.dataset.src));
  });
}

document.querySelectorAll(".asset-card").forEach(makeCardDraggable);

if (window.galleryDesktop?.getMediaAssets) {
  window.galleryDesktop.getMediaAssets().then(renderMediaAssets).catch((error) => {
    console.error("Could not load media folders:", error);
  });
  window.galleryDesktop.onMediaAssetsChanged(renderMediaAssets);
}

canvas.addEventListener("dragover", (event) => {
  event.preventDefault();
  canvas.classList.add("drag-over");
});

canvas.addEventListener("dragleave", (event) => {
  if (event.target === canvas) canvas.classList.remove("drag-over");
});

canvas.addEventListener("drop", (event) => {
  event.preventDefault();
  canvas.classList.remove("drag-over");

  const { x, y } = clientToSurface(event.clientX, event.clientY);
  const raw = event.dataTransfer.getData("application/x-gallery-desktop-card");
  if (!raw) return;

  const card = JSON.parse(raw);
  createCanvasItem(card.kind, card.title, x, y, card.src);
});

canvas.addEventListener("pointerdown", (event) => {
  if (event.target !== canvas && event.target !== canvasSurface) return;

  setActive(null);
  if (event.button !== 0) return;

  event.preventDefault();
  const pointerId = event.pointerId;
  const startX = event.clientX;
  const startY = event.clientY;
  const initialScrollLeft = canvas.scrollLeft;
  const initialScrollTop = canvas.scrollTop;
  canvas.setPointerCapture(pointerId);
  canvas.classList.add("panning");

  function pan(pointerEvent) {
    if (pointerEvent.pointerId !== pointerId) return;
    canvas.scrollLeft = initialScrollLeft - (pointerEvent.clientX - startX);
    canvas.scrollTop = initialScrollTop - (pointerEvent.clientY - startY);
  }

  function stopPan(pointerEvent) {
    if (pointerEvent.pointerId !== pointerId) return;
    window.removeEventListener("pointermove", pan);
    window.removeEventListener("pointerup", stopPan);
    window.removeEventListener("pointercancel", stopPan);
    canvas.classList.remove("panning");
    if (canvas.hasPointerCapture(pointerId)) canvas.releasePointerCapture(pointerId);
  }

  window.addEventListener("pointermove", pan);
  window.addEventListener("pointerup", stopPan);
  window.addEventListener("pointercancel", stopPan);
});

canvas.addEventListener(
  "wheel",
  (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    setCanvasZoom(canvasZoom * (event.deltaY > 0 ? 0.9 : 1.1));
  },
  { passive: false }
);

canvasZoomOut.addEventListener("click", () => setCanvasZoom(canvasZoom - 0.1));
canvasZoomReset.addEventListener("click", () => setCanvasZoom(1));
canvasZoomIn.addEventListener("click", () => setCanvasZoom(canvasZoom + 0.1));

sidebarToggle.addEventListener("click", () => {
  const isCollapsed = workspace.classList.toggle("sidebar-collapsed");
  const action = isCollapsed ? "Show sidebar" : "Hide sidebar";

  sidebarToggle.textContent = isCollapsed ? "\u203a" : "\u2039";
  sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
  sidebarToggle.setAttribute("aria-label", action);
  sidebarToggle.title = action;
});

updateSurfaceSize(surfaceWidth, surfaceHeight);
requestAnimationFrame(() => {
  canvas.scrollLeft = (surfaceWidth - canvas.clientWidth) / 2;
  canvas.scrollTop = (surfaceHeight - canvas.clientHeight) / 2;
});
