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
      (img) => `<div class="gallery-item img-item"><img src="${origin}/demo/images/${img}" alt="${img}" /><div class="item-caption">${img}</div></div>`
    ).join("\n");

    const videoElements = assets.videos.map(
      (vid) => `<div class="gallery-item video-item"><video src="${origin}/demo/video/${vid}" controls></video><div class="item-caption">${vid}</div></div>`
    ).join("\n");

    const pdfElements = assets.pdfs.map(
      (pdf) => `<div class="gallery-item pdf-item"><iframe src="${origin}/demo/pdf/${pdf}"></iframe><div class="item-caption">${pdf}</div></div>`
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
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
            className={`p-2 bg-slate-900 border border-white/5 hover:border-indigo-500/30 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center disabled:opacity-50`}
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
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden flex flex-col">
          <div className="bg-slate-950/60 p-3 border-b border-white/5 flex items-center justify-between">
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
          <pre className="p-6 bg-slate-950/40 text-indigo-200 font-mono text-xs overflow-x-auto max-h-[500px]">
            {generatedHtml}
          </pre>
        </div>
      ) : (
        <div className="flex justify-center w-full bg-slate-950/40 rounded-2xl border border-white/5 p-4 min-h-[550px] transition-all">
          <div
            className={`transition-all duration-300 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-white ${
              viewportWidth === "desktop"
                ? "w-full h-[550px]"
                : viewportWidth === "tablet"
                ? "w-[768px] h-[550px]"
                : "w-[375px] h-[550px]"
            }`}
          >
            <iframe
              title="Interactive Gallery Preview"
              srcDoc={generatedHtml}
              className="w-full h-full border-none"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      )}
    </div>
  );
}
