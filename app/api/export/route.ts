import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");

    const body = await req.json();
    const html = body.html;
    const css = body.css;
    const js = body.js;

    if (!html) {
      return NextResponse.json({ error: "Missing HTML content" }, { status: 400 });
    }

    // Set up a temporary build directory inside the workspace
    const buildId = Math.random().toString(36).substring(2, 9);
    const tempDir = path.join(process.cwd(), "tmp_builds", buildId);
    
    // Create folders
    const imagesDir = path.join(tempDir, "images");
    const videosDir = path.join(tempDir, "videos");
    const pdfDir = path.join(tempDir, "pdf");

    await fs.mkdir(imagesDir, { recursive: true });
    await fs.mkdir(videosDir, { recursive: true });
    await fs.mkdir(pdfDir, { recursive: true });

    // Add README.txt files inside each folder
    await fs.writeFile(
      path.join(imagesDir, "README.txt"),
      "Put your image files in this folder.\nSupported: jpg, jpeg, png, webp, gif, svg",
      "utf-8"
    );
    await fs.writeFile(
      path.join(videosDir, "README.txt"),
      "Put your video files in this folder.\nSupported: mp4, webm, mov",
      "utf-8"
    );
    await fs.writeFile(
      path.join(pdfDir, "README.txt"),
      "Put your PDF files in this folder.\nSupported: pdf",
      "utf-8"
    );

    // Save templates
    await fs.writeFile(path.join(tempDir, "template.html"), html, "utf-8");
    await fs.writeFile(path.join(tempDir, "template.css"), css || "", "utf-8");
    await fs.writeFile(path.join(tempDir, "template.js"), js || "", "utf-8");

    // Write Electron main.js
    const mainJsContent = `
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Necessary to load local file:// assets
    }
  });

  // Run the scanner script to generate index.html dynamically
  try {
    require('./gallery-scanner.js')();
  } catch (err) {
    console.error("Scanner error:", err);
  }

  win.loadFile(path.join(__dirname, 'index.html'));
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
`;
    await fs.writeFile(path.join(tempDir, "main.js"), mainJsContent, "utf-8");

    // Write gallery-scanner.js
    const scannerJsContent = `
const fs = require('fs');
const path = require('path');

module.exports = function scanAndCompile() {
  const baseDir = __dirname;
  const imagesDir = path.join(baseDir, 'images');
  const videosDir = path.join(baseDir, 'videos');
  const pdfDir = path.join(baseDir, 'pdf');

  const extensions = {
    images: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
    videos: ['mp4', 'webm', 'mov'],
    pdfs: ['pdf']
  };

  const getFiles = (dir, extList) => {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(file => {
      const ext = path.extname(file).toLowerCase().substring(1);
      return extList.includes(ext);
    });
  };

  const images = getFiles(imagesDir, extensions.images);
  const videos = getFiles(videosDir, extensions.videos);
  const pdfs = getFiles(pdfDir, extensions.pdfs);

  // Generate HTML blocks
  const imgHtml = images.map(file => 
    \`<div class="gallery-item img-item"><img src="file://\${path.join(imagesDir, file)}" alt="\${file}" /><div class="item-caption">\${file}</div></div>\`
  ).join('\\n');

  const vidHtml = videos.map(file => 
    \`<div class="gallery-item video-item"><video src="file://\${path.join(videosDir, file)}" controls></video><div class="item-caption">\${file}</div></div>\`
  ).join('\\n');

  const pdfHtml = pdfs.map(file => 
    \`<div class="gallery-item pdf-item"><iframe src="file://\${path.join(pdfDir, file)}"></iframe><div class="item-caption">\${file}</div></div>\`
  ).join('\\n');

  const allHtml = [imgHtml, vidHtml, pdfHtml].filter(Boolean).join('\\n');

  // Load template
  let html = fs.readFileSync(path.join(baseDir, 'template.html'), 'utf-8');
  const css = fs.readFileSync(path.join(baseDir, 'template.css'), 'utf-8');
  const js = fs.readFileSync(path.join(baseDir, 'template.js'), 'utf-8');

  // Replace CSS
  if (html.includes('{{css}}')) {
    html = html.replace(/\\{\\{css\\}\\}/g, css);
  } else {
    html = html.replace('</head>', \`<style>\${css}</style></head>\`);
  }

  // Replace content placeholders
  if (html.includes('{{gallery}}')) {
    html = html.replace(/\\{\\{gallery\\}\\}/g, allHtml);
  }
  if (html.includes('{{images}}')) {
    html = html.replace(/\\{\\{images\\}\\}/g, imgHtml);
  }
  if (html.includes('{{videos}}')) {
    html = html.replace(/\\{\\{videos\\}\\}/g, vidHtml);
  }
  if (html.includes('{{pdfs}}')) {
    html = html.replace(/\\{\\{pdfs\\}\\}/g, pdfHtml);
  }

  // If no placeholder, append to body
  if (!html.includes('{{gallery}}') && !html.includes('{{images}}') && !html.includes('{{videos}}') && !html.includes('{{pdfs}}')) {
    html = html.replace('</body>', \`<div class="gallery-fallback">\${allHtml}</div></body>\`);
  }

  // Inject Custom JS script block
  if (js.trim()) {
    html = html.replace('</body>', \`<script>\${js}</script></body>\`);
  }

  fs.writeFileSync(path.join(baseDir, 'index.html'), html, 'utf-8');
};
`;
    await fs.writeFile(path.join(tempDir, "gallery-scanner.js"), scannerJsContent, "utf-8");

    // Write package.json
    const packageJsonContent = {
      name: "gallery-desktop-player",
      version: "1.0.0",
      main: "main.js",
      description: "Standalone local media gallery player.",
      author: "Gallery Compiler",
      license: "MIT",
      scripts: {
        start: "electron ."
      },
      dependencies: {
        electron: "^30.0.0"
      }
    };
    await fs.writeFile(
      path.join(tempDir, "package.json"),
      JSON.stringify(packageJsonContent, null, 2),
      "utf-8"
    );

    // Launch scripts
    const launchBat = `@echo off\necho Installing Electron wrapper...\ncall npm install\necho Launching local media gallery...\ncall npm start\n`;
    const launchCmd = `#!/bin/bash\ncd "$(dirname "$0")"\necho "Installing Electron wrapper..."\nnpm install\necho "Launching local media gallery..."\nnpm start\n`;

    await fs.writeFile(path.join(tempDir, "LaunchGallery.bat"), launchBat, "utf-8");
    await fs.writeFile(path.join(tempDir, "LaunchGallery.command"), launchCmd, "utf-8");
    await fs.chmod(path.join(tempDir, "LaunchGallery.command"), 0o755);

    // Create zip
    const zipPath = path.join(process.cwd(), "tmp_builds", `${buildId}.zip`);
    await execPromise(`zip -r "${zipPath}" .`, { cwd: tempDir });

    const zipBuffer = await fs.readFile(zipPath);

    // Clean up async
    fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    fs.unlink(zipPath).catch(() => {});

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="gallery-export.zip"`,
      },
    });
  } catch (err: any) {
    console.error("Export API error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
