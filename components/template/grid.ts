import { Template } from "../../lib/templates";

export const gridTemplate: Template = {
  id: "grid",
  name: "Modern Fluid Grid",
  description: "A clean, responsive grid layout with hover zoom effects, elegant framing, and responsive viewport sizing.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fluid Grid Gallery</title>
  <style>
    {{css}}
  </style>
</head>
<body>
  <div class="gallery-wrapper">
    <header class="gallery-header">
      <h1>Dynamic Media Grid</h1>
      <p>Click any item to view details</p>
    </header>
    <main class="gallery-grid">
      {{gallery}}
    </main>
  </div>
</body>
</html>`,
  css: `body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #0b0f19;
  color: #f1f5f9;
}
.gallery-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}
.gallery-header {
  text-align: center;
  margin-bottom: 40px;
}
.gallery-header h1 {
  font-size: 2.5rem;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #a5b4fc, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.gallery-header p {
  color: #64748b;
  font-size: 1.1rem;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.gallery-item {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  aspect-ratio: 4/3;
}
.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.2);
}
.gallery-item img, .gallery-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.gallery-item iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #0f172a;
}
.item-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent);
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.gallery-item:hover .item-info {
  opacity: 1;
}
.item-title {
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0;
}
.item-type {
  font-size: 0.75rem;
  color: #a5b4fc;
  text-transform: uppercase;
  margin-top: 4px;
  letter-spacing: 0.05em;
}`
};
