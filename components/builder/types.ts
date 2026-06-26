export type BuilderAssetKind = "image" | "video" | "pdf" | "browser";

export interface BuilderAsset {
  id: string;
  kind: BuilderAssetKind;
  title: string;
  src: string;
}

export interface CanvasItemData extends BuilderAsset {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface ScannedAssets {
  images: string[];
  videos: string[];
  pdfs: string[];
}
