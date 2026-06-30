const canvas = document.getElementById("canvas");
const workspace = document.querySelector(".workspace");
const sidebarToggle = document.getElementById("sidebar-toggle");

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

function createPlaceholderBody(kind) {
  const body = document.createElement("div");
  body.className = "placeholder-body";
  body.textContent = kind.toUpperCase();
  return body;
}

function createCanvasItem(kind, title, x, y) {
  const item = document.createElement("section");
  item.className = "canvas-item";
  item.style.left = `${x}px`;
  item.style.top = `${y}px`;
  item.style.width = kind === "browser" ? "760px" : "360px";
  item.style.height = kind === "browser" ? "520px" : "280px";
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
  body.append(kind === "browser" ? createBrowserBody(item) : createPlaceholderBody(kind));

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

document.querySelectorAll(".asset-card").forEach((card) => {
  card.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData(
      "application/x-gallery-desktop-card",
      JSON.stringify({
        kind: card.dataset.kind,
        title: card.dataset.title,
      })
    );
    event.dataTransfer.effectAllowed = "copy";
  });
});

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
  createCanvasItem(card.kind, card.title, x, y);
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
