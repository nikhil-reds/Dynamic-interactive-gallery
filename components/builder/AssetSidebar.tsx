"use client";

/* eslint-disable @next/next/no-img-element */
import type { DragEvent } from "react";
import { BuilderAsset } from "./types";

interface AssetSidebarProps {
  assets: {
    images: BuilderAsset[];
    videos: BuilderAsset[];
    pdfs: BuilderAsset[];
    browser: BuilderAsset;
  };
}

function startDrag(event: DragEvent, asset: BuilderAsset) {
  event.dataTransfer.setData("application/x-gallery-asset", JSON.stringify(asset));
  event.dataTransfer.effectAllowed = "copy";
}

function AssetCard({ asset }: { asset: BuilderAsset }) {
  return (
    <div
      draggable
      onDragStart={(event) => startDrag(event, asset)}
      className="group cursor-grab rounded-lg border border-white/10 bg-slate-900/70 p-2 transition hover:border-indigo-400/50 active:cursor-grabbing"
    >
      <div className="mb-2 aspect-video overflow-hidden rounded-md bg-slate-950">
        {asset.kind === "image" ? (
          <img src={asset.src} alt={asset.title} className="h-full w-full object-cover" draggable={false} />
        ) : asset.kind === "video" ? (
          <video src={asset.src} className="h-full w-full object-cover" muted preload="metadata" />
        ) : asset.kind === "pdf" ? (
          <div className="flex h-full w-full items-center justify-center bg-rose-500/10 text-xs font-black text-rose-200">
            PDF
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-emerald-500/10 text-xs font-black text-emerald-200">
            WEB
          </div>
        )}
      </div>
      <div className="truncate text-[11px] font-semibold text-slate-200" title={asset.title}>
        {asset.title}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">{asset.kind}</div>
    </div>
  );
}

function AssetGroup({ title, assets }: { title: string; assets: BuilderAsset[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{title}</h2>
      <div className="space-y-2">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </section>
  );
}

export default function AssetSidebar({ assets }: AssetSidebarProps) {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-white/10 bg-[#0d101a]">
      <div className="border-b border-white/10 px-4 py-4">
        <h2 className="text-sm font-bold text-white">Asset Library</h2>
        <p className="mt-1 text-xs text-slate-500">Drag any card onto the open workspace.</p>
      </div>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <AssetGroup title="Images" assets={assets.images} />
        <AssetGroup title="Videos" assets={assets.videos} />
        <AssetGroup title="PDF Cards" assets={assets.pdfs} />
      </div>

      <div className="border-t border-white/10 p-4">
        <h2 className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Browser Card</h2>
        <AssetCard asset={assets.browser} />
      </div>
    </aside>
  );
}
