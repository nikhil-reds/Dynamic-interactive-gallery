const canvas = document.getElementById("canvas");
const workspace = document.querySelector(".workspace");
const sidebarToggle = document.getElementById("sidebar-toggle");
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

function createCanvasItem(kind, title, x, y, src = "") {
  const item = document.createElement("section");
  item.className = "canvas-item";
  item.dataset.kind = kind;
  item.dataset.src = src;
  item.style.left = `${x}px`;
  item.style.top = `${y}px`;
  item.style.width = kind === "browser" ? "760px" : kind === "pdf" ? "480px" : "420px";
  item.style.height = kind === "browser" ? "520px" : kind === "pdf" ? "600px" : "320px";
  item.style.zIndex = String(nextZIndex++);

  const header = document.createElement("div");
  header.className = "item-header";

  const itemTitle = document.createElement("div");
  itemTitle.className = "item-title";
  itemTitle.textContent = kind === "browser" ? "https://www.google.com" : title;

  const tools = document.createElement("div");
  tools.className = "tool-row";

  const front = document.createElement("button");
  front.className = "tool-button";
  front.type = "button";
  front.textContent = "Front";

  const close = document.createElement("button");
  close.className = "tool-button";
  close.type = "button";
  close.textContent = "Delete";

  tools.append(front, close);
  header.append(itemTitle, tools);

  const body = document.createElement("div");
  body.className = "item-body";
  body.append(kind === "browser" ? createBrowserBody(item) : createMediaBody(kind, src, title));

  const resizeHandle = document.createElement("div");
  resizeHandle.className = "resize-handle";
  resizeHandle.title = "Resize";

  item.append(header, body, resizeHandle);
  canvas.append(item);
  canvas.querySelector(".empty-state")?.remove();
  setActive(item);

  front.addEventListener("click", (event) => {
    event.stopPropagation();
    setActive(item);
  });

  close.addEventListener("click", (event) => {
    event.stopPropagation();
    item.remove();
    if (activeItem === item) activeItem = null;
  });

  item.addEventListener("pointerdown", () => setActive(item));

  header.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActive(item);

    const startX = event.clientX;
    const startY = event.clientY;
    const initialLeft = item.offsetLeft;
    const initialTop = item.offsetTop;

    function move(pointerEvent) {
      item.style.left = `${Math.max(0, initialLeft + pointerEvent.clientX - startX)}px`;
      item.style.top = `${Math.max(0, initialTop + pointerEvent.clientY - startY)}px`;
    }

    function stop() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  });

  resizeHandle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActive(item);

    const startX = event.clientX;
    const startY = event.clientY;
    const initialWidth = item.offsetWidth;
    const initialHeight = item.offsetHeight;

    function resize(pointerEvent) {
      item.style.width = `${Math.max(220, initialWidth + pointerEvent.clientX - startX)}px`;
      item.style.height = `${Math.max(180, initialHeight + pointerEvent.clientY - startY)}px`;
    }

    function stop() {
      window.removeEventListener("pointermove", resize);
      window.removeEventListener("pointerup", stop);
    }

    window.addEventListener("pointermove", resize);
    window.addEventListener("pointerup", stop);
  });

  return item;
}

function makeCardDraggable(card) {
  card.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData(
      "application/x-gallery-desktop-card",
      JSON.stringify({
        kind: card.dataset.kind,
        title: card.dataset.title,
        src: card.dataset.src || "",
      })
    );
    event.dataTransfer.effectAllowed = "copy";
  });
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

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left + canvas.scrollLeft;
  const y = event.clientY - rect.top + canvas.scrollTop;
  const raw = event.dataTransfer.getData("application/x-gallery-desktop-card");
  if (!raw) return;

  const card = JSON.parse(raw);
  createCanvasItem(card.kind, card.title, x, y, card.src);
});

canvas.addEventListener("pointerdown", (event) => {
  if (event.target === canvas) setActive(null);
});

sidebarToggle.addEventListener("click", () => {
  const isCollapsed = workspace.classList.toggle("sidebar-collapsed");
  const action = isCollapsed ? "Show sidebar" : "Hide sidebar";

  sidebarToggle.textContent = isCollapsed ? "\u203a" : "\u2039";
  sidebarToggle.setAttribute("aria-expanded", String(!isCollapsed));
  sidebarToggle.setAttribute("aria-label", action);
  sidebarToggle.title = action;
});
