/* eslint-disable @typescript-eslint/no-require-imports */
const { contextBridge, ipcRenderer, shell } = require("electron");

contextBridge.exposeInMainWorld("galleryDesktop", {
  getMediaAssets: () => ipcRenderer.invoke("gallery:media:list"),
  onMediaAssetsChanged: (callback) => {
    const listener = (_event, assets) => callback(assets);
    ipcRenderer.on("gallery:media:changed", listener);
    return () => ipcRenderer.removeListener("gallery:media:changed", listener);
  },
  openExternal: (url) => shell.openExternal(url),
});
