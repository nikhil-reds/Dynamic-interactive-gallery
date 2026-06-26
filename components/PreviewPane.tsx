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
        <iframe src="${origin}/demo/pdf/${pdf}" style="width: 100%; height: 100%; border: none; display: block;"></iframe>
      </div>`
    ).join("\n");

    const allElements = [imageElements, videoElements, pdfElements].filter(Boolean).join("\n");

    // Replace placeholders
    let finalHtml = template.html;

    // Replace CSS placeholder or inject into head
    if (finalHtml.includes("{{css}}")) {
      finalHtml = finalHtml.replace(/\{\{css\}\}/g, template.css);
    } else {
      finalHtml = finalHtml.replace("</head>", `<style>${template.css}</style></head>`);
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

    // Inject Custom JS if defined
    if (template.js?.trim()) {
      finalHtml = finalHtml.replace("</body>", `<script>${template.js}</script></body>`);
    }

    // Inject lightbox pop-and-blur script block
    finalHtml = finalHtml.replace("</body>", `<script>${lightboxScript}</script></body>`);

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
          js: (template.js || "") + "\n\n" + lightboxScript,
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



          {/* View Code Toggle */}
          <button
            onClick={() => setViewCode(!viewCode)}
            className="px-4 py-2 bg-slate-900 border border-white/5 hover:border-white/10 text-xs font-semibold rounded-xl text-slate-300 cursor-pointer"
          >
            {viewCode ? "Show Gallery Viewer" : "View Source HTML"}
          </button>

          {/* Download Zip Button */}
          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850/50 disabled:text-indigo-400 border border-indigo-500/20 hover:border-indigo-500/40 text-xs font-semibold rounded-xl text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Download ZIP package"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{isExporting ? "Exporting..." : "Download ZIP"}</span>
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
            />
          </div>
        </div>
      )}
    </div>
  );
}

const lightboxScript = `
// LIGHTBOX POP-AND-BLUR SYSTEM
(function() {
  function initLightbox() {
    if (document.getElementById('gallery-lightbox')) return;
    
    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.id = 'gallery-lightbox';
    lightbox.className = 'gallery-lightbox';
    lightbox.innerHTML = \`
      <div class="lightbox-content"></div>
      <div class="lightbox-caption"></div>
    \`;
    document.body.appendChild(lightbox);
    
    // Inject lightbox styling
    const style = document.createElement('style');
    style.textContent = \`
      .gallery-lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 12, 20, 0.85);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .gallery-lightbox.active {
        opacity: 1;
        pointer-events: auto;
      }
      .lightbox-content {
        max-width: 90%;
        max-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(0.85);
        opacity: 0;
        transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
      }
      .gallery-lightbox.active .lightbox-content {
        transform: scale(1);
        opacity: 1;
      }
      .lightbox-content img, .lightbox-content video {
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 16px;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
      .lightbox-caption {
        margin-top: 24px;
        color: rgba(255, 255, 255, 0.9);
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      }
      .gallery-lightbox.active .lightbox-caption {
        opacity: 1;
        transform: translateY(0);
      }
      
      /* Blur direct children of body when lightbox is active */
      body.lightbox-active > *:not(#gallery-lightbox) {
        filter: blur(12px);
        transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      }
      
      /* Hover cursor styling */
      .gallery-item, .gallery-item img, .gallery-item video {
        cursor: pointer;
      }
      
      /* Override template pointer-events issues so items are clickable */
      .carousel-container, .carousel, .carousel-item-container, .item, .card {
        pointer-events: auto !important;
      }
    \`;
    document.head.appendChild(style);
    
    const contentContainer = lightbox.querySelector('.lightbox-content');
    const captionContainer = lightbox.querySelector('.lightbox-caption');
    
    const openLightbox = (src, isVideo, altText) => {
      contentContainer.innerHTML = '';
      if (isVideo) {
        const video = document.createElement('video');
        video.src = src;
        video.controls = true;
        video.autoplay = true;
        contentContainer.appendChild(video);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = altText || 'Gallery Image';
        contentContainer.appendChild(img);
      }
      captionContainer.textContent = altText || '';
      document.body.classList.add('lightbox-active');
      lightbox.classList.add('active');
    };
    
    const closeLightbox = () => {
      document.body.classList.remove('lightbox-active');
      lightbox.classList.remove('active');
      setTimeout(() => {
        contentContainer.innerHTML = '';
      }, 400);
    };
    
    lightbox.addEventListener('click', (e) => {
      if (!e.target.closest('video')) {
        closeLightbox();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
    
    // Drag detection to prevent opening during rotation/swipe gestures
    let dragStartX = 0;
    let dragStartY = 0;
    let isDraggingGesture = false;

    const onStart = (clientX, clientY) => {
      dragStartX = clientX;
      dragStartY = clientY;
      isDraggingGesture = false;
    };

    const onMove = (clientX, clientY) => {
      if (Math.abs(clientX - dragStartX) > 8 || Math.abs(clientY - dragStartY) > 8) {
        isDraggingGesture = true;
      }
    };

    document.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
    document.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));

    document.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    // Handle clicks
    document.addEventListener('click', (e) => {
      if (isDraggingGesture) return;
      
      const target = e.target;
      if (target.closest('#gallery-lightbox')) return;
      
      let img = null;
      let video = null;
      
      if (target.tagName === 'IMG') {
        img = target;
      } else if (target.tagName === 'VIDEO') {
        video = target;
      } else {
        const item = target.closest('.gallery-item, .carousel-item-container, .item, .card, article, .carousel-item');
        if (item) {
          img = item.querySelector('img');
          video = item.querySelector('video');
        }
      }
      
      if (img) {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(img.src, false, img.alt || img.title || img.src.split('/').pop().split('?')[0]);
      } else if (video) {
        e.preventDefault();
        e.stopPropagation();
        openLightbox(video.src, true, video.title || video.src.split('/').pop().split('?')[0]);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
`;

