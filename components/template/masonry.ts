import { Template } from "../../lib/templates";

export const masonryTemplate: Template = {
  id: "masonry",
  name: "Interactive Masonry Columnist",
  description: "A gorgeous Pinterest-style column layout that scales automatically and fits vertical/horizontal layouts seamlessly.",
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Masonry Gallery</title>
  <style>
    {{css}}
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1>Portfolio Showcase</h1>
      <p>Curated creative collection</p>
    </header>
    <div class="masonry-gallery">
      {{gallery}}
    </div>
  </div>
</body>
</html>`,
  css: `body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #090d16;
  color: #e2e8f0;
}
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 50px 20px;
}
.header {
  margin-bottom: 50px;
  text-align: center;
}
.header h1 {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin: 0 0 10px 0;
}
.header p {
  color: #94a3b8;
  font-size: 1.2rem;
}
.masonry-gallery {
  column-count: 3;
  column-gap: 20px;
}
@media (max-width: 900px) {
  .masonry-gallery {
    column-count: 2;
  }
}
@media (max-width: 600px) {
  .masonry-gallery {
    column-count: 1;
  }
}
.gallery-item {
  display: inline-block;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 28px;
  overflow: hidden;
  background: #111827;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.25s ease;
}
.gallery-item:hover {
  transform: scale(1.02);
}
.gallery-item img {
  width: 100%;
  height: auto;
  display: block;
}
.gallery-item video {
  width: 100%;
  height: auto;
  display: block;
}
.gallery-item iframe {
  width: 100%;
  height: 350px;
  border: none;
  background: #000;
}`
};
