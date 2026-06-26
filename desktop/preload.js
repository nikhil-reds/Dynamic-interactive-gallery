const { contextBridge, shell } = require("electron");

contextBridge.exposeInMainWorld("galleryDesktop", {
  openExternal: (url) => shell.openExternal(url),
});
