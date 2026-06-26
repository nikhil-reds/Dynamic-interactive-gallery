"use client";

/* eslint-disable @next/next/no-img-element */
import { BuilderAsset } from "./types";

interface ThumbnailStripProps {
  assets: BuilderAsset[];
}

export default function ThumbnailStrip({ assets }: ThumbnailStripProps) {
  return (
    <header className="h-28 shrink-0 border-b border-white/10 bg-[#0d101a] px-5 py-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold uppercase tracking-[0.22em] text-white">Gallery Builder</h1>
          <p className="text-xs text-slate-500">Drag media from the library or drop files directly onto the canvas.</p>
        </div>
        <div className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-200">
          {assets.length} gallery assets
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="h-12 w-20 shrink-0 overflow-hidden rounded-md border border-white/10 bg-slate-950"
            title={asset.title}
          >
            {asset.kind === "image" ? (
              <img src={asset.src} alt={asset.title} className="h-full w-full object-cover" draggable={false} />
            ) : asset.kind === "video" ? (
              <video src={asset.src} className="h-full w-full object-cover" muted preload="metadata" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-rose-500/10 text-[10px] font-black uppercase text-rose-200">
                PDF
              </div>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}
