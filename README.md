# Gallery EXE Template Exporter

Simple project plan for an app where the user pastes HTML, CSS, and JavaScript for a gallery template, then exports a ZIP package that contains an `.exe` file and asset folders.

## Main Idea

This app does not need asset upload inside the dashboard.

The user only needs:

1. A box to paste HTML.
2. A box to paste CSS.
3. A box to paste JavaScript.
4. A preview button.
5. An export button that creates a ZIP file.

The exported ZIP should contain:

```txt
gallery-export.zip
├── Gallery.exe
├── images/
├── videos/
└── pdf/
```

The user can place files inside these folders after export:

- Put images inside `images/`
- Put videos inside `videos/`
- Put PDF files inside `pdf/`

When `Gallery.exe` opens, it should automatically scan those folders and show the gallery using the pasted template.

## Final User Flow

```txt
Open the app
      ↓
Paste HTML template
      ↓
Paste CSS template
      ↓
Paste JavaScript template
      ↓
Preview the template
      ↓
Export ZIP
      ↓
Add images, videos, and PDFs into the exported folders
      ↓
Open Gallery.exe
      ↓
EXE auto-detects files and shows the gallery
```

## App Pages

### 1. Template Editor

This is the main page.

It should have three large boxes:

- HTML
- CSS
- JavaScript

The user pastes template code into these boxes.

Template placeholders:

```html
{{gallery}}
{{images}}
{{videos}}
{{pdfs}}
```

Example HTML:

```html
<main class="page">
  <h1>My Gallery</h1>

  <section class="gallery">
    {{gallery}}
  </section>
</main>
```

Example CSS:

```css
.page {
  font-family: Arial, sans-serif;
  padding: 32px;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.gallery img,
.gallery video,
.gallery iframe {
  width: 100%;
  height: 240px;
  object-fit: cover;
  border-radius: 8px;
}
```

Example JavaScript:

```js
console.log("Gallery loaded");
```

### 2. Preview Page

The preview page shows the template before export.

Since there is no upload system, the preview can use sample demo assets.

Preview features:

- Render pasted HTML, CSS, and JS
- Replace `{{gallery}}` with sample image, video, and PDF blocks
- Replace `{{images}}` with sample image blocks
- Replace `{{videos}}` with sample video blocks
- Replace `{{pdfs}}` with sample PDF blocks
- Show desktop preview
- Show mobile preview

### 3. Export Page

The export page creates the final ZIP file.

Export output:

```txt
gallery-export.zip
├── Gallery.exe
├── images/
│   └── README.txt
├── videos/
│   └── README.txt
└── pdf/
    └── README.txt
```

The folder README files should explain where to place files.

Example:

```txt
Put your image files in this folder.
Supported: jpg, jpeg, png, webp, gif, svg
```

## EXE Behavior

When the user opens `Gallery.exe`, it should:

1. Find its own folder location.
2. Look for these folders next to the EXE:
   - `images/`
   - `videos/`
   - `pdf/`
3. Scan supported files inside those folders.
4. Build gallery HTML automatically.
5. Inject the generated gallery into the pasted template.
6. Open a desktop window showing the final gallery.

Supported files:

```txt
images: jpg, jpeg, png, webp, gif, svg
videos: mp4, webm, mov
pdf: pdf
```

## Auto Gallery Rules

The EXE should generate HTML from local folders.

Image output:

```html
<img src="./images/photo.jpg" alt="photo" />
```

Video output:

```html
<video src="./videos/movie.mp4" controls></video>
```

PDF output:

```html
<iframe src="./pdf/document.pdf"></iframe>
```

Placeholder rules:

- `{{gallery}}` injects images, videos, and PDFs together.
- `{{images}}` injects only files from the `images/` folder.
- `{{videos}}` injects only files from the `videos/` folder.
- `{{pdfs}}` injects only files from the `pdf/` folder.
- If the HTML has no placeholder, append the generated gallery at the end.

## Recommended Technology

Use Electron for the desktop export.

Why Electron:

- Easy to create a Windows `.exe`
- Can read local folders using Node.js
- Can open a desktop window
- Can load generated HTML, CSS, and JS
- Works well for this type of local gallery app

Useful packages:

```txt
electron
electron-builder
archiver
```

## Export Architecture

```txt
Template Editor App
      ↓
Save pasted HTML, CSS, and JS
      ↓
Generate Electron app files
      ↓
Package Gallery.exe
      ↓
Create images/, videos/, and pdf/ folders
      ↓
Zip everything
```

## ZIP Structure

The final ZIP should be simple and user-friendly.

```txt
gallery-export.zip
├── Gallery.exe
├── images/
│   ├── README.txt
│   └── user images go here
├── videos/
│   ├── README.txt
│   └── user videos go here
└── pdf/
    ├── README.txt
    └── user PDF files go here
```

## Internal EXE Structure

The packaged EXE should include:

```txt
template.html
template.css
template.js
gallery-scanner.js
electron-main.js
```

Responsibilities:

- `electron-main.js` opens the desktop window.
- `gallery-scanner.js` scans `images/`, `videos/`, and `pdf/`.
- `template.html` stores the pasted HTML.
- `template.css` stores the pasted CSS.
- `template.js` stores the pasted JavaScript.

## Implementation Phases

### Phase 1: Simple App Shell

- Create a clean page with three editor boxes:
  - HTML
  - CSS
  - JavaScript
- Add buttons:
  - Preview
  - Export ZIP

### Phase 2: Template Preview

- Render pasted HTML/CSS/JS inside an iframe.
- Use sample demo files for preview.
- Replace placeholders with generated sample gallery blocks.
- Show a helpful message if the template is empty.

### Phase 3: Gallery Scanner

- Build scanner logic for the exported EXE.
- Scan folders beside the EXE:
  - `images/`
  - `videos/`
  - `pdf/`
- Detect supported files.
- Generate gallery HTML blocks.

### Phase 4: Electron Wrapper

- Create Electron main process.
- Load generated template content.
- Inject scanned gallery files.
- Open the final gallery in a desktop window.

### Phase 5: ZIP Export

- Build the Windows `.exe`.
- Create export folders:
  - `images/`
  - `videos/`
  - `pdf/`
- Add README files inside each folder.
- Create final ZIP file.

### Phase 6: Testing

- Export ZIP.
- Extract ZIP.
- Add image files into `images/`.
- Add video files into `videos/`.
- Add PDF files into `pdf/`.
- Open `Gallery.exe`.
- Confirm gallery appears automatically.
- Test empty folders.
- Test unsupported files.

## MVP Checklist

- HTML editor box
- CSS editor box
- JavaScript editor box
- Preview with demo gallery
- Placeholder replacement
- Electron EXE generation
- ZIP export
- `images/` folder
- `videos/` folder
- `pdf/` folder
- Auto-scan folders when EXE opens
- Auto-render gallery from detected files

## Important Notes

- No asset upload feature is needed.
- No media library is needed.
- No dashboard asset manager is needed.
- The exported EXE must work with files placed beside it in the folders.
- Start with Windows `.exe` export first.
- Add macOS `.dmg` later only if needed.
