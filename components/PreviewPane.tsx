"use client";

import React, { useState, useEffect } from "react";
import { Template } from "../lib/templates";

interface PreviewPaneProps {
  template: Template;
}

interface ScannedAssets {
  images: string[];
  videos: string[];
  pdfs: string[];
}

export default function PreviewPane({ template }: PreviewPaneProps) {
  const [viewportWidth, setViewportWidth] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [viewCode, setViewCode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState("");
  
  const [assets, setAssets] = useState<ScannedAssets>({
    images: [],
    videos: [],
    pdfs: []
  });

  // Fetch the latest assets list from the public/demo folder
  useEffect(() => {
    async function fetchAssets() {
      try {
        const res = await fetch("/api/scan");
        if (res.ok) {
          const data = await res.json();
          setAssets({
            images: data.images || [],
            videos: data.videos || [],
            pdfs: data.pdfs || []
          });
        }
      } catch (err) {
        console.error("Failed to scan public folder assets", err);
      }
    }
    fetchAssets();
  }, []);

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    // Generate inner gallery elements (using paths relative to the public root)
    const imageElements = assets.images.map(
      (img) => `<div class="gallery-item img-item"><img src="${origin}/demo/images/${img}" alt="${img}" /></div>`
    ).join("\n");

    const videoElements = assets.videos.map(
      (vid) => `<div class="gallery-item video-item"><video src="${origin}/demo/video/${vid}" controls></video></div>`
    ).join("\n");

    const pdfElements = assets.pdfs.map(
      (pdf) => `<div class="gallery-item pdf-item" data-pdf="${origin}/demo/pdf/${pdf}">
        <canvas class="pdf-canvas"></canvas>
        <div class="pdf-overlay">
          <svg class="pdf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span class="pdf-title">${pdf}</span>
        </div>
      </div>`
    ).join("\n");

    const allElements = [imageElements, videoElements, pdfElements].filter(Boolean).join("\n");

    // Replace placeholders
    let finalHtml = template.html;

    const pdfStyles = `
/* PDF Thumbnail Styles */
.pdf-item {
  position: relative;
  background: #1e293b;
  display: flex !important;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.pdf-canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.pdf-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.7) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  opacity: 0.85;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 5;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.pdf-item:hover .pdf-overlay {
  opacity: 1;
}
.pdf-icon {
  width: 40px;
  height: 40px;
  color: #ef4444;
  margin-bottom: 8px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
.pdf-title {
  font-size: 12px;
  font-weight: 600;
  color: #f1f5f9;
  text-align: center;
  max-width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0,0,0,0.6);
  font-family: system-ui, -apple-system, sans-serif;
}
`;

    // Replace CSS placeholder or inject into head
    if (finalHtml.includes("{{css}}")) {
      finalHtml = finalHtml.replace(/\{\{css\}\}/g, template.css + pdfStyles);
    } else {
      finalHtml = finalHtml.replace("</head>", `<style>${template.css + pdfStyles}</style></head>`);
    }

    // Replace content placeholders
    if (finalHtml.includes("{{gallery}}")) {
      finalHtml = finalHtml.replace(/\{\{gallery\}\}/g, allElements);
    }
    if (finalHtml.includes("{{images}}")) {
      finalHtml = finalHtml.replace(/\{\{images\}\}/g, imageElements);
    }
    if (finalHtml.includes("{{videos}}")) {
      finalHtml = finalHtml.replace(/\{\{videos\}\}/g, videoElements);
    }
    if (finalHtml.includes("{{pdfs}}")) {
      finalHtml = finalHtml.replace(/\{\{pdfs\}\}/g, pdfElements);
    }

    // If no placeholders are placed, append to body
    if (!template.html.includes("{{gallery}}") && !template.html.includes("{{images}}") && !template.html.includes("{{videos}}") && !template.html.includes("{{pdfs}}")) {
      finalHtml = finalHtml.replace("</body>", `<div class="gallery-fallback">${allElements}</div></body>`);
    }

    const pdfScripts = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"></script>
<script>
  (function() {
    function initPdfThumbnails() {
      if (typeof pdfjsLib === 'undefined') return;
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      
      document.querySelectorAll('.pdf-item').forEach(item => {
        const pdfUrl = item.getAttribute('data-pdf');
        const canvas = item.querySelector('.pdf-canvas');
        if (!pdfUrl || !canvas) return;
        
        pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
          return pdf.getPage(1);
        }).then(page => {
          const viewport = page.getViewport({ scale: 2.0 });
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          return page.render(renderContext).promise;
        }).catch(err => {
          console.error("PDF.js render error:", err);
        });
      });
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(initPdfThumbnails, 100);
    } else {
      window.addEventListener('DOMContentLoaded', initPdfThumbnails);
    }
  })();
</script>
`;

    finalHtml = finalHtml.replace("</body>", `${pdfScripts}</body>`);

    // Inject Custom JS if defined
    if (template.js?.trim()) {
      finalHtml = finalHtml.replace("</body>", `<script>${template.js}</script></body>`);
    }

    setGeneratedHtml(finalHtml);
  }, [template, assets]);

  const handleExportZip = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportStatus("Compiling ZIP package...");

    try {
      const response = await fetch("/api/export?format=zip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html: template.html,
          css: template.css,
          js: template.js || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Server package compiler failed");
      }

      setExportStatus("Downloading package...");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Automatically trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = "gallery-export.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportStatus("ZIP Package downloaded!");
      setTimeout(() => setExportStatus(""), 4000);
    } catch (err: any) {
      setExportStatus("Failed: " + err.message);
      setTimeout(() => setExportStatus(""), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col p-6 md:p-8 space-y-6 overflow-hidden animate-fade-in">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Live Preview Viewer</h2>
          <p className="text-slate-400 text-sm mt-1">
            Displaying layout <span className="text-indigo-400 font-semibold">{template.name}</span> with {assets.images.length} images, {assets.pdfs.length} PDFs, and {assets.videos.length} videos from the public folder.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Export Status Label */}
          {exportStatus && (
            <span className="text-xs text-indigo-400 font-medium bg-indigo-950/40 border border-indigo-500/20 px-3 py-1.5 rounded-xl animate-pulse">
              {exportStatus}
            </span>
          )}

          {/* Export ZIP Icon Button */}
          <button
            disabled={isExporting}
            onClick={handleExportZip}
            className="p-2 bg-slate-900 border border-white/5 hover:border-indigo-500/30 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center disabled:opacity-50"
            title="Export ZIP Package"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
          </button>

          {/* View Code Toggle */}
          <button
            onClick={() => setViewCode(!viewCode)}
            className="px-4 py-2 bg-slate-900 border border-white/5 hover:border-white/10 text-xs font-semibold rounded-xl text-slate-300 cursor-pointer"
          >
            {viewCode ? "Show Gallery Viewer" : "View Source HTML"}
          </button>

          {/* Viewport Toggles */}
          {!viewCode && (
            <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/5 gap-1">
              {[
                { id: "desktop", label: "Desktop", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
                { id: "tablet", label: "Tablet", icon: "M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
                { id: "mobile", label: "Mobile", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" }
              ].map((viewport) => (
                <button
                  key={viewport.id}
                  onClick={() => setViewportWidth(viewport.id as any)}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    viewportWidth === viewport.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                  title={`${viewport.label} View`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={viewport.icon} />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {viewCode ? (
        <div className="flex-1 min-h-0 rounded-2xl overflow-hidden flex flex-col bg-slate-950/40 border border-white/5">
          <div className="bg-slate-950/60 p-3 border-b border-white/5 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-400 font-mono">Compiled Code View</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedHtml);
                alert("Source code copied to clipboard!");
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Copy Code
            </button>
          </div>
          <pre className="flex-1 overflow-auto p-6 bg-slate-950/20 text-indigo-200 font-mono text-xs">
            {generatedHtml}
          </pre>
        </div>
      ) : (
        <div className="flex-1 min-h-0 w-full flex justify-center p-2 bg-slate-950/10 rounded-2xl">
          <div
            className={`transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl bg-white h-full ${
              viewportWidth === "desktop"
                ? "w-full"
                : viewportWidth === "tablet"
                ? "w-[768px]"
                : "w-[375px]"
            }`}
          >
            <iframe
              title="Interactive Gallery Preview"
              srcDoc={generatedHtml}
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}
    </div>
  );
}
