# Guide: How to Add a New Gallery Layout Template

This document explains the architecture of the Gallery Compiler presets and provides the exact layout specification, format details, and instructions needed to add a new custom gallery template to the application.

---

## 1. Directory Structure

Templates are separated into individual TypeScript files within the components folder and registered in the unified templates library:

```txt
gallery/
├── components/
│   └── template/
│       ├── grid.ts       <-- Modern Fluid Grid
│       ├── masonry.ts    <-- Pinterest-Style Columns
│       ├── carousel.ts   <-- Slider Carousel
│       └── [new-name].ts <-- Your New Template File
└── lib/
    └── templates.ts      <-- Preset Registration Registry
```

---

## 2. Template Interface Specification

Every gallery layout must export a `Template` object matching this TypeScript interface (defined in [templates.ts](file:///Users/nikhil/Desktop/gallery/lib/templates.ts)):

```typescript
export interface Template {
  id: string;          // Unique URL/state-safe identifier
  name: string;        // Human-readable title shown in Layout Presets
  description: string; // Description shown under the title in the sidebar
  html: string;        // Complete HTML page skeleton string
  css: string;         // Accompanying Vanilla CSS stylesheet string
  js?: string;         // Optional JavaScript block (injected at body end)
}
```

---

## 3. Placeholders and Injection Rules

The compiler engine parses templates by replacing the following string placeholders in your layout code:

### HTML Placeholders
* `{{css}}` — Injected inside the `<style>` block in the head. *(Optional: if omitted, the compiler dynamically injects it inside a `<style>` block before `</head>`)*.
* `{{gallery}}` — Injected with all items (images, videos, PDFs) combined.
* `{{images}}` — Injected with image elements only.
* `{{videos}}` — Injected with video elements only.
* `{{pdfs}}` — Injected with PDF iframe elements only.

### HTML Element Structures
When placeholders are replaced, the media scanner injects HTML strings formatted exactly as follows:

* **Images**:
  ```html
  <div class="gallery-item img-item">
    <img src="[URL_OR_PATH]" alt="[FILENAME]" />
    <div class="item-caption">[FILENAME]</div>
  </div>
  ```
* **Videos**:
  ```html
  <div class="gallery-item video-item">
    <video src="[URL_OR_PATH]" controls></video>
    <div class="item-caption">[FILENAME]</div>
  </div>
  ```
* **PDF Documents**:
  ```html
  <div class="gallery-item pdf-item">
    <iframe src="[URL_OR_PATH]"></iframe>
    <div class="item-caption">[FILENAME]</div>
  </div>
  ```

*Note: Your CSS classes should target `.gallery-item`, `.img-item`, `.video-item`, `.pdf-item`, and `.item-caption` to style the respective elements.*

---

## 4. Step-by-Step Template Integration

### Step 1: Create the template file
Create a new file under `components/template/` (e.g. `components/template/mystyle.ts`) and define your layout exports:

```typescript
import { Template } from "../../lib/templates";

export const mystyleTemplate: Template = {
  id: "mystyle",
  name: "My Custom Gallery",
  description: "A gorgeous, responsive layout description.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Gallery Preview</title>
  <style>
    {{css}}
  </style>
</head>
<body>
  <div class="custom-wrapper">
    <div class="items-list">
      {{gallery}}
    </div>
  </div>
</body>
</html>`,
  css: `
body {
  margin: 0;
  background-color: #121212;
  color: #fff;
  font-family: sans-serif;
}
.custom-wrapper {
  padding: 40px;
}
.items-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.gallery-item {
  width: calc(33.333% - 16px);
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
}
.gallery-item img, .gallery-item video, .gallery-item iframe {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border: none;
}
.item-caption {
  padding: 8px;
  font-size: 12px;
  text-align: center;
}
  `,
  js: `
console.log("My Custom Gallery initialized!");
  `
};
```

### Step 2: Register in templates library
Open [templates.ts](file:///Users/nikhil/Desktop/gallery/lib/templates.ts) and add your new template to the presets:

```typescript
import { gridTemplate } from "../components/template/grid";
import { masonryTemplate } from "../components/template/masonry";
import { carouselTemplate } from "../components/template/carousel";
import { mystyleTemplate } from "../components/template/mystyle"; // <-- Add this import

export interface Template {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js?: string;
}

export const defaultTemplates: Template[] = [
  gridTemplate,
  masonryTemplate,
  carouselTemplate,
  mystyleTemplate // <-- Append to the registry array
];
```

Once registered, your layout preset will immediately appear in the sidebar selector and can be previewed or exported dynamically.
