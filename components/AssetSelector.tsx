"use client";

import React, { useRef } from "react";

export interface SelectedAsset {
  id: string;
  name: string;
  type: string; // 'image' | 'video' | 'pdf' | 'other'
  size: number;
  url: string;
  file: File;
}

interface AssetSelectorProps {
  assets: SelectedAsset[];
  onAssetsChanged: (assets: SelectedAsset[]) => void;
}

export default function AssetSelector({ assets, onAssetsChanged }: AssetSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files);
    
    const newAssets: SelectedAsset[] = fileList.map((file) => {
      let type = "other";
      if (file.type.startsWith("image/")) type = "image";
      else if (file.type.startsWith("video/")) type = "video";
      else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) type = "pdf";

      return {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type,
        size: file.size,
        url: URL.createObjectURL(file),
        file,
      };
    });

    onAssetsChanged([...assets, ...newAssets]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAsset = (id: string) => {
    const assetToRemove = assets.find((a) => a.id === id);
    if (assetToRemove) {
      URL.revokeObjectURL(assetToRemove.url);
    }
    onAssetsChanged(assets.filter((a) => a.id !== id));
  };

  const clearAll = () => {
    assets.forEach((a) => URL.revokeObjectURL(a.url));
    onAssetsChanged([]);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Select Assets</h2>
          <p className="text-slate-400 text-sm mt-1">
            Import images, videos, or PDFs for previewing and packaging.
          </p>
        </div>
        {assets.length > 0 && (
          <button
            onClick={clearAll}
            className="px-4 py-2 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white rounded-lg text-sm transition cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Select Area */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/30 hover:bg-indigo-950/10 rounded-2xl p-12 text-center transition-all cursor-pointer group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-indigo-500/20 text-slate-400 group-hover:text-indigo-400 flex items-center justify-center transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0l-3-3m3 3l3-3m-6 5h12M4 18h16" />
            </svg>
          </div>
          <div>
            <p className="text-slate-300 font-semibold text-lg">Click to select files</p>
            <p className="text-slate-500 text-sm mt-1">Supports Images (PNG, JPG, SVG, WebP), Videos (MP4, WebM), and PDFs</p>
          </div>
        </div>
      </div>

      {/* Asset Grid */}
      {assets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="glass-panel rounded-xl overflow-hidden group relative flex flex-col border border-white/5 bg-slate-900/50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeAsset(asset.id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-rose-600 rounded-full text-white/80 hover:text-white transition z-10 cursor-pointer"
                title="Remove asset"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Asset Preview */}
              <div className="aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden border-b border-white/5 relative">
                {asset.type === "image" ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                ) : asset.type === "video" ? (
                  <video src={asset.url} className="w-full h-full object-cover" preload="metadata" muted />
                ) : asset.type === "pdf" ? (
                  <div className="flex flex-col items-center gap-2 text-indigo-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">PDF File</span>
                  </div>
                ) : (
                  <div className="text-slate-500 text-xs">Unknown Asset</div>
                )}
              </div>

              {/* Asset Meta */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <p className="text-slate-200 text-xs font-semibold truncate" title={asset.name}>
                  {asset.name}
                </p>
                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                  <span className="capitalize px-1.5 py-0.5 bg-slate-800 rounded text-slate-400 font-medium">
                    {asset.type}
                  </span>
                  <span>{formatSize(asset.size)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-panel rounded-2xl border border-white/5">
          <p className="text-slate-500">No assets selected yet. Pick some files above to build your gallery.</p>
        </div>
      )}
    </div>
  );
}
