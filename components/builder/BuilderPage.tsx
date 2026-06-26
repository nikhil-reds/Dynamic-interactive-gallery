"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AssetSidebar from "./AssetSidebar";
import CanvasWorkspace from "./CanvasWorkspace";
import ThumbnailStrip from "./ThumbnailStrip";
import { BuilderAsset, CanvasItemData, ScannedAssets } from "./types";

const browserAsset: BuilderAsset = {
  id: "browser-google",
  kind: "browser",
  title: "Google Browser",
  src: "https://www.google.com",
};

function mediaAsset(kind: BuilderAsset["kind"], filename: string): BuilderAsset {
  const folder = kind === "video" ? "video" : kind === "pdf" ? "pdf" : "images";
  return {
    id: `${kind}-${filename}`,
    kind,
    title: filename,
    src: `/demo/${folder}/${filename}`,
  };
}

function getFileKind(file: File): BuilderAsset["kind"] | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) return "pdf";
  return null;
}

export default function BuilderPage() {
  const [assets, setAssets] = useState<ScannedAssets>({ images: [], videos: [], pdfs: [] });
  const [items, setItems] = useState<CanvasItemData[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(2);
  const objectUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    let alive = true;
    const objectUrls = objectUrlsRef.current;

    async function loadAssets() {
      try {
        const response = await fetch("/api/scan");
        if (!response.ok) return;
        const data = await response.json();
        if (alive) {
          setAssets({
            images: data.images || [],
            videos: data.videos || [],
            pdfs: data.pdfs || [],
          });
        }
      } catch (error) {
        console.error("Failed to load builder assets", error);
      }
    }

    loadAssets();

    return () => {
      alive = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const libraryAssets = useMemo(() => {
    const images = assets.images.map((file) => mediaAsset("image", file));
    const videos = assets.videos.map((file) => mediaAsset("video", file));
    const pdfs = assets.pdfs.map((file) => mediaAsset("pdf", file));
    return { images, videos, pdfs, browser: browserAsset };
  }, [assets]);

  const allGalleryAssets = useMemo(
    () => [...libraryAssets.images, ...libraryAssets.videos, ...libraryAssets.pdfs],
    [libraryAssets]
  );

  const addAssetToCanvas = (asset: BuilderAsset, x: number, y: number) => {
    const zIndex = nextZIndex;
    const isBrowser = asset.kind === "browser";
    const isPdf = asset.kind === "pdf";
    const itemId = `${asset.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    setItems((current) => [
      ...current,
      {
        ...asset,
        id: itemId,
        x,
        y,
        width: isBrowser ? 560 : isPdf ? 360 : 320,
        height: isBrowser ? 380 : isPdf ? 420 : 240,
        zIndex,
      },
    ]);
    setActiveItemId(itemId);
    setNextZIndex(zIndex + 1);
  };

  const addFilesToCanvas = (files: FileList, x: number, y: number) => {
    Array.from(files).forEach((file, index) => {
      const kind = getFileKind(file);
      if (!kind) return;

      const src = URL.createObjectURL(file);
      objectUrlsRef.current.push(src);
      addAssetToCanvas(
        {
          id: `local-${file.name}`,
          kind,
          title: file.name,
          src,
        },
        x + index * 28,
        y + index * 28
      );
    });
  };

  const updateItem = (id: string, patch: Partial<CanvasItemData>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const deleteItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    setActiveItemId((current) => (current === id ? null : current));
  };

  const bringToFront = (id: string) => {
    const zIndex = nextZIndex;
    updateItem(id, { zIndex });
    setActiveItemId(id);
    setNextZIndex(zIndex + 1);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#090b12] text-slate-100">
      <ThumbnailStrip assets={allGalleryAssets} />

      <div className="flex min-h-0 flex-1">
        <AssetSidebar assets={libraryAssets} />
        <CanvasWorkspace
          activeItemId={activeItemId}
          browserAsset={browserAsset}
          items={items}
          onAddAsset={addAssetToCanvas}
          onAddFiles={addFilesToCanvas}
          onBringToFront={bringToFront}
          onDeleteItem={deleteItem}
          onSelectItem={setActiveItemId}
          onUpdateItem={updateItem}
        />
      </div>
    </div>
  );
}
