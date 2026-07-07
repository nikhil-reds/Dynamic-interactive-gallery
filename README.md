# Gallery

Web-to-desktop interactive gallery builder. Paste or choose HTML/CSS/JS gallery templates, preview them against images, videos, and PDFs, then export a ZIP bundle that can run as a packaged standalone desktop gallery app.

## What It Does

 - is a Next.js app for building local media gallery experiences without hand-packaging a desktop app every time.

- Preview responsive gallery templates in desktop, tablet, and mobile widths.
- Render images, videos, and PDFs into template placeholders.
- Switch between bundled templates such as grid, masonry, carousel, bento, glow, accordion, sphere, cylinder, fluid, dynamic, and clay.
- Inspect the compiled HTML output before export.
- Download a ZIP package containing a Windows desktop gallery app and media folders.
- Let the exported app scan local `images/`, `videos/`, and `pdf/` folders next to the executable.

## Tech Used

- **Next.js 16 App Router** - application shell, route handlers, and local API endpoints.
- **React 19** - interactive preview UI and template switching.
- **TypeScript** - typed components, template definitions, and API handlers.
- **Tailwind CSS 4** - app styling through the PostCSS plugin.
- **Node.js filesystem APIs** - scans demo assets and prepares export build folders.
- **adm-zip** - creates the downloadable ZIP bundle.
- **Electron packaging flow** - builds a Windows desktop app shell during export.
- **Go launcher** - `lib/Gallery.go` contains a lightweight local HTTP gallery runner that scans asset folders and opens the gallery in a browser.

## Project Structure

```txt
app/
  page.tsx                 Main gallery builder screen
  api/
    scan/route.ts          Lists demo assets from public/demo
    export/route.ts        Builds and returns gallery-export.zip
    download/route.ts      Downloads generated ZIP files from builds/

components/
  PreviewPane.tsx          Live preview, compiled source view, ZIP export action
  Sidebar.tsx              Template navigation
  AssetSelector.tsx        Client-side file picker/preview component
  template/                Built-in gallery template definitions

lib/
  templates.ts             Template registry
  Gallery.go               Local desktop/gallery launcher source
  bin/Gallery.exe          Prebuilt Windows executable asset

public/demo/
  images/                  Demo images used in preview/export
  video/                   Demo videos used in preview/export
  pdf/                     Demo PDFs used in preview/export

desktop/
  main.js                  Electron desktop shell
  preload.js               Safe desktop bridge for external URL actions
  renderer/                Desktop canvas with a real webview internet card

.github/workflows/
  windows-exe.yml          Builds and uploads the Windows EXE artifact
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app at:

```txt
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Run the production server:

```bash
npm run start
```

Lint the project:

```bash
npm run lint
```

## Export Flow

1. Choose a template in the sidebar.
2. Preview the generated gallery using demo assets from `public/demo`.
3. Optionally switch to source view to inspect the compiled HTML.
4. Click **Download ZIP**.
5. The server creates `gallery-export.zip`.
6. The ZIP contains a packaged gallery app plus media folders.

The exported folder is intended to include:

```txt
Gallery.exe
images/
videos/
pdf/
```

Place media files into those folders next to `Gallery.exe`. When the desktop gallery runs, it scans those folders and injects the media into the selected template.

## Template Placeholders

Templates can include these placeholders:

```txt
{{gallery}}  Inject images, videos, and PDFs together
{{images}}   Inject only images
{{videos}}   Inject only videos
{{pdfs}}     Inject only PDFs
{{css}}      Inline the selected template CSS
```

If a template does not include a media placeholder, the generated gallery is appended to the document body.

## Supported Media

```txt
Images: jpg, jpeg, png, webp, gif, svg
Videos: mp4, webm, mov
PDFs:   pdf
```

## Export Requirements

The export route performs local build work from the server process. For full ZIP/desktop export support, the machine running the Next.js app should have:

- Node.js and npm
- Go, for compiling the launcher path
- Network/package access for Electron dependencies if they are not already cached

Generated temporary build files are written under `tmp_builds/` and cleaned up after the ZIP response is created.

## Desktop Internet Card

The `desktop/` app contains the full desktop version of the browser card. It uses Electron `webview`, so the card can load Google and other websites inside the draggable canvas instead of falling back to an external tab.

Desktop browser card controls:

```txt
Back
Forward
Reload
URL/search input
Go
Open externally
```

Build the Windows EXE from GitHub Actions:

1. Open the repository on GitHub.
2. Go to **Actions**.
3. Select **Build Windows EXE**.
4. Run the workflow manually, or push changes under `desktop/`.
5. Download the `gallery-builder-windows` artifact.

The downloaded artifact contains:

```txt
Gallery-Builder.exe
images/
videos/
pdf/
```

Keep the media folders beside the executable. The desktop app scans them at startup, displays supported files as draggable sidebar cards, and watches for files that are added, renamed, or removed while the app is running.

## Notes

- Preview assets are read from `public/demo`, while selected client-side files are used for in-browser preview workflows.
- Exported galleries are designed for local, offline media browsing after packaging.
- This project uses the Next.js App Router. Route handlers live under `app/api/**/route.ts`.
