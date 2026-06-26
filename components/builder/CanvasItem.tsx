"use client";

/* eslint-disable @next/next/no-img-element */
import type { PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { CanvasItemData } from "./types";

interface CanvasItemProps {
  active: boolean;
  item: CanvasItemData;
  onBringToFront: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  onUpdate: (id: string, patch: Partial<CanvasItemData>) => void;
}

type Interaction =
  | {
      mode: "move";
      pointerId: number;
      startX: number;
      startY: number;
      initialX: number;
      initialY: number;
    }
  | {
      mode: "resize";
      pointerId: number;
      startX: number;
      startY: number;
      initialWidth: number;
      initialHeight: number;
    };

function normalizeUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "https://www.google.com";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function BrowserCard({ item, onUpdate }: { item: CanvasItemData; onUpdate: CanvasItemProps["onUpdate"] }) {
  const [address, setAddress] = useState(item.src);
  const isGoogle = item.src.includes("google.com");

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-950">
      <form
        className="flex gap-2 border-b border-white/10 bg-slate-900 p-2"
        onSubmit={(event) => {
          event.preventDefault();
          onUpdate(item.id, { src: normalizeUrl(address) });
        }}
      >
        <input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-slate-950 px-2 py-1 text-xs text-slate-200 outline-none focus:border-emerald-400/60"
          aria-label="Browser URL"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-500 px-2 py-1 text-xs font-bold text-emerald-950 transition hover:bg-emerald-400"
        >
          Go
        </button>
        <a
          href={item.src}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-white/10 px-2 py-1 text-xs font-semibold text-slate-300 transition hover:text-white"
        >
          Open
        </a>
      </form>
      {isGoogle ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-white p-6 text-center text-slate-900">
          <div className="text-3xl font-bold tracking-tight">Google</div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            This browser card starts at google.com. Google blocks normal web-page embedding, so use Open for a full tab or enter another embeddable URL.
          </p>
          <a
            href={item.src}
            target="_blank"
            rel="noreferrer"
            className="mt-5 rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500"
          >
            Open Google
          </a>
        </div>
      ) : (
        <iframe
          src={item.src}
          title={item.title}
          className="min-h-0 flex-1 border-0 bg-white"
          referrerPolicy="no-referrer"
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
        />
      )}
    </div>
  );
}

function ItemBody({ item, onUpdate }: { item: CanvasItemData; onUpdate: CanvasItemProps["onUpdate"] }) {
  if (item.kind === "image") {
    return <img src={item.src} alt={item.title} className="h-full w-full select-none object-cover" draggable={false} />;
  }

  if (item.kind === "video") {
    return <video src={item.src} className="h-full w-full bg-black object-contain" controls />;
  }

  if (item.kind === "pdf") {
    return <iframe src={item.src} title={item.title} className="h-full w-full border-0 bg-white" />;
  }

  return <BrowserCard item={item} onUpdate={onUpdate} />;
}

export default function CanvasItem({
  active,
  item,
  onBringToFront,
  onDelete,
  onSelect,
  onUpdate,
}: CanvasItemProps) {
  const interaction = useRef<Interaction | null>(null);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const current = interaction.current;
      if (!current || event.pointerId !== current.pointerId) return;

      const deltaX = event.clientX - current.startX;
      const deltaY = event.clientY - current.startY;

      if (current.mode === "move") {
        onUpdate(item.id, {
          x: Math.max(0, current.initialX + deltaX),
          y: Math.max(0, current.initialY + deltaY),
        });
      } else {
        onUpdate(item.id, {
          width: Math.max(160, current.initialWidth + deltaX),
          height: Math.max(120, current.initialHeight + deltaY),
        });
      }
    }

    function handlePointerUp(event: PointerEvent) {
      if (interaction.current?.pointerId === event.pointerId) {
        interaction.current = null;
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [item.id, onUpdate]);

  const startMove = (event: ReactPointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(item.id);
    onBringToFront(item.id);
    interaction.current = {
      mode: "move",
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      initialX: item.x,
      initialY: item.y,
    };
  };

  const startResize = (event: ReactPointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onSelect(item.id);
    onBringToFront(item.id);
    interaction.current = {
      mode: "resize",
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      initialWidth: item.width,
      initialHeight: item.height,
    };
  };

  return (
    <section
      onClick={(event) => {
        event.stopPropagation();
        onSelect(item.id);
        onBringToFront(item.id);
      }}
      className={`absolute overflow-hidden rounded-lg border bg-slate-950 shadow-2xl ${
        active ? "border-indigo-400 ring-2 ring-indigo-400/30" : "border-white/10"
      }`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        zIndex: item.zIndex,
      }}
    >
      <div
        onPointerDown={startMove}
        className="flex h-9 cursor-move items-center justify-between border-b border-white/10 bg-slate-900/95 px-3"
      >
        <div className="min-w-0">
          <div className="truncate text-xs font-bold text-slate-100">{item.title}</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onBringToFront(item.id);
            }}
            className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-300 hover:text-white"
            title="Bring to front"
          >
            Front
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(item.id);
            }}
            className="rounded border border-rose-400/30 px-1.5 py-0.5 text-[10px] font-bold text-rose-200 hover:bg-rose-500 hover:text-white"
            title="Delete"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-36px)] min-h-0">
        <ItemBody item={item} onUpdate={onUpdate} />
      </div>

      <div
        onPointerDown={startResize}
        className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize border-b-2 border-r-2 border-indigo-300 bg-indigo-400/20"
        title="Resize"
      />
    </section>
  );
}
