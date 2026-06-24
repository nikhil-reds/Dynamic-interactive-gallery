import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const zipName = "gallery-export.zip";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const html = body.html;
    const css = body.css;
    const js = body.js;

    if (!html) {
      return NextResponse.json({ error: "Missing HTML content" }, { status: 400 });
    }

    // Set up temporary build directories inside the workspace.
    const buildId = Math.random().toString(36).substring(2, 9);
    const tempDir = path.join(process.cwd(), "tmp_builds", buildId);
    const appSourceDir = path.join(tempDir, "app-source");
    const packageDir = path.join(tempDir, "gallery-export");
    
    // Create only the folders that should appear in the downloaded package.
    const imagesDir = path.join(packageDir, "images");
    const videosDir = path.join(packageDir, "videos");
    const pdfDir = path.join(packageDir, "pdf");

    await fs.mkdir(appSourceDir, { recursive: true });
    await fs.mkdir(imagesDir, { recursive: true });
    await fs.mkdir(videosDir, { recursive: true });
    await fs.mkdir(pdfDir, { recursive: true });

    // Copy public demo assets if they exist
    const publicImagesDir = path.join(process.cwd(), "public", "demo", "images");
    const publicVideoDir = path.join(process.cwd(), "public", "demo", "video");
    const publicPdfDir = path.join(process.cwd(), "public", "demo", "pdf");

    await fs.cp(publicImagesDir, imagesDir, { recursive: true }).catch(() => {});
    await fs.cp(publicVideoDir, videosDir, { recursive: true }).catch(() => {});
    await fs.cp(publicPdfDir, pdfDir, { recursive: true }).catch(() => {});

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
    await fs.writeFile(path.join(appSourceDir, "template.html"), html, "utf-8");
    await fs.writeFile(path.join(appSourceDir, "template.css"), css || "", "utf-8");
    await fs.writeFile(path.join(appSourceDir, "template.js"), js || "", "utf-8");

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
    await fs.writeFile(path.join(appSourceDir, "main.js"), mainJsContent, "utf-8");

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
    await fs.writeFile(path.join(appSourceDir, "gallery-scanner.js"), scannerJsContent, "utf-8");

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
      path.join(appSourceDir, "package.json"),
      JSON.stringify(packageJsonContent, null, 2),
      "utf-8"
    );

    // Base64 encode the user's customized templates
    const htmlB64 = Buffer.from(html).toString("base64");
    const cssB64 = Buffer.from(css || "").toString("base64");
    const jsB64 = Buffer.from(js || "").toString("base64");

    // Write a data.go file that overrides the template variables
    const dataGoContent = `package main

func init() {
	embeddedHtmlB64 = "${htmlB64}"
	embeddedCssB64 = "${cssB64}"
	embeddedJsB64 = "${jsB64}"
}
`;
    await fs.writeFile(path.join(appSourceDir, "data.go"), dataGoContent, "utf-8");

    // Copy the Go launcher source code to the temp build directory
    const launcherSourcePath = path.join(process.cwd(), "lib", "Gallery.go");
    const launcherSource = await fs.readFile(launcherSourcePath, "utf-8");
    await fs.writeFile(path.join(appSourceDir, "Gallery.go"), launcherSource, "utf-8");

    // Compile the binary dynamically with embedded layout data (disable modules for script compilation)
    await execPromise(
      `GO111MODULE=off GOOS=windows GOARCH=amd64 go build -ldflags "-s -w" -o "${path.join(packageDir, "Gallery.exe")}" .`,
      { cwd: appSourceDir }
    );

    // Create a ZIP that contains the executable and asset folders only (no separate HTML/CSS/JS files).
    const zipPath = path.join(tempDir, zipName);
    await execPromise(`zip -r -X "../${zipName}" "Gallery.exe" "images" "videos" "pdf"`, { cwd: packageDir });

    const zipBuffer = await fs.readFile(zipPath);

    // Clean up async
    fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${zipName}"`,
        "Content-Length": String(zipBuffer.length),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    console.error("Export API error:", err);
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
