"use client";

import type { DragEvent } from "react";
import { useRef, useState } from "react";
import CanvasItem from "./CanvasItem";
import { BuilderAsset, CanvasItemData } from "./types";

interface CanvasWorkspaceProps {
  activeItemId: string | null;
  browserAsset: BuilderAsset;
  items: CanvasItemData[];
  onAddAsset: (asset: BuilderAsset, x: number, y: number) => void;
  onAddFiles: (files: FileList, x: number, y: number) => void;
  onBringToFront: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onSelectItem: (id: string | null) => void;
  onUpdateItem: (id: string, patch: Partial<CanvasItemData>) => void;
}

function parseAssetTransfer(event: DragEvent): BuilderAsset | null {
  const raw = event.dataTransfer.getData("application/x-gallery-asset");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as BuilderAsset;
  } catch {
    return null;
  }
}

export default function CanvasWorkspace({
  activeItemId,
  browserAsset,
  items,
  onAddAsset,
  onAddFiles,
  onBringToFront,
  onDeleteItem,
  onSelectItem,
  onUpdateItem,
}: CanvasWorkspaceProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const getDropPoint = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 40, y: 40 };
    return {
      x: Math.max(0, clientX - rect.left),
      y: Math.max(0, clientY - rect.top),
    };
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDraggingOver(false);

    const point = getDropPoint(event.clientX, event.clientY);

    if (event.dataTransfer.files.length > 0) {
      onAddFiles(event.dataTransfer.files, point.x, point.y);
      return;
    }

    const asset = parseAssetTransfer(event);
    if (asset) {
      onAddAsset(asset, point.x, point.y);
    }
  };

  return (
    <main className="relative min-w-0 flex-1 overflow-hidden bg-[#090b12]">
      <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-xs text-slate-400 backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Free canvas
      </div>

      <button
        type="button"
        onClick={() => onAddAsset(browserAsset, 80, 80)}
        className="absolute right-5 top-5 z-10 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
      >
        Add browser
      </button>

      <div
        ref={canvasRef}
        onClick={() => onSelectItem(null)}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = "copy";
          setIsDraggingOver(true);
        }}
        onDragLeave={(event) => {
          if (event.currentTarget === event.target) setIsDraggingOver(false);
        }}
        onDrop={handleDrop}
        className={`relative h-full w-full overflow-auto ${
          isDraggingOver ? "bg-indigo-500/10" : "bg-transparent"
        }`}
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      >
        {items.length === 0 && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(520px,calc(100%-48px))] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-dashed border-white/15 bg-slate-950/40 p-8 text-center">
            <div className="text-lg font-bold text-white">Drop media anywhere</div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Drag images, videos, PDFs, or the browser card here. Move items freely, resize them from the corner, and overlap layers by clicking them.
            </p>
          </div>
        )}

        {items.map((item) => (
          <CanvasItem
            key={item.id}
            active={activeItemId === item.id}
            item={item}
            onBringToFront={onBringToFront}
            onDelete={onDeleteItem}
            onSelect={onSelectItem}
            onUpdate={onUpdateItem}
          />
        ))}
      </div>
    </main>
  );
}
