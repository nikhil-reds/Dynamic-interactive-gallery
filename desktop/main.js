/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const fs = require("fs");
const { promises: fileSystem } = fs;
const path = require("path");
const { pathToFileURL } = require("url");

const mediaFolders = {
  image: { directory: "images", extensions: new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]) },
  video: { directory: "videos", extensions: new Set([".mp4", ".webm", ".mov"]) },
  pdf: { directory: "pdf", extensions: new Set([".pdf"]) },
};

let mainWindow = null;
let mediaWatchers = [];
let rescanTimer = null;
let reconciliationTimer = null;
let lastMediaSignature = "";

function getMediaBaseDirectory() {
  if (!app.isPackaged) return path.join(__dirname, "gallery-data");

  // electron-builder's portable target extracts the app to a temporary folder.
  // This environment value points back to the directory containing the portable EXE.
  return process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath);
}

async function ensureMediaDirectories() {
  const baseDirectory = getMediaBaseDirectory();
  await Promise.all(
    Object.values(mediaFolders).map(({ directory }) =>
      fileSystem.mkdir(path.join(baseDirectory, directory), { recursive: true })
    )
  );
  return baseDirectory;
}

async function scanMediaAssets() {
  const baseDirectory = await ensureMediaDirectories();
  const assets = [];

  for (const [kind, config] of Object.entries(mediaFolders)) {
    const directory = path.join(baseDirectory, config.directory);
    const entries = await fileSystem.readdir(directory, { withFileTypes: true }).catch(() => []);

    for (const entry of entries) {
      if (!entry.isFile()) continue;

      const extension = path.extname(entry.name).toLowerCase();
      if (!config.extensions.has(extension)) continue;

      const absolutePath = path.join(directory, entry.name);
      const stats = await fileSystem.stat(absolutePath).catch(() => null);
      if (!stats) continue;

      assets.push({
        id: `${kind}:${entry.name}`,
        kind,
        title: entry.name,
        src: pathToFileURL(absolutePath).href,
        size: stats.size,
        modifiedAt: stats.mtimeMs,
      });
    }
  }

  return assets.sort((left, right) => {
    if (left.kind !== right.kind) return left.kind.localeCompare(right.kind);
    return left.title.localeCompare(right.title, undefined, { numeric: true, sensitivity: "base" });
  });
}

async function broadcastMediaAssets(force = false) {
  const assets = await scanMediaAssets();
  const signature = JSON.stringify(assets.map(({ id, size, modifiedAt }) => [id, size, modifiedAt]));
  if (!force && signature === lastMediaSignature) return;

  lastMediaSignature = signature;
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("gallery:media:changed", assets);
  }
}

function scheduleMediaRescan() {
  clearTimeout(rescanTimer);
  rescanTimer = setTimeout(() => {
    broadcastMediaAssets().catch((error) => console.error("Media rescan failed:", error));
  }, 500);
}

async function startMediaWatchers() {
  const baseDirectory = await ensureMediaDirectories();
  mediaWatchers.forEach((watcher) => watcher.close());
  mediaWatchers = Object.values(mediaFolders).map(({ directory }) =>
    fs.watch(path.join(baseDirectory, directory), { persistent: false }, scheduleMediaRescan)
  );

  clearInterval(reconciliationTimer);
  reconciliationTimer = setInterval(() => {
    broadcastMediaAssets().catch((error) => console.error("Media reconciliation failed:", error));
  }, 5000);
}

function stopMediaWatchers() {
  clearTimeout(rescanTimer);
  clearInterval(reconciliationTimer);
  mediaWatchers.forEach((watcher) => watcher.close());
  mediaWatchers = [];
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: "#090b12",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webviewTag: true,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, "renderer", "index.html"));
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  ipcMain.handle("gallery:media:list", () => scanMediaAssets());

  app.on("web-contents-created", (_event, contents) => {
    if (contents.getType() !== "webview") return;

    contents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: "deny" };
    });
  });

  await ensureMediaDirectories();
  await startMediaWatchers();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", stopMediaWatchers);
