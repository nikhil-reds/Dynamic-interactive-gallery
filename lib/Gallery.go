package main

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

var (
	embeddedHtmlB64 = ""
	embeddedCssB64  = ""
	embeddedJsB64   = ""
)

func main() {
	// 1. Get executable directory
	exePath, err := os.Executable()
	if err != nil {
		exePath = "."
	}
	baseDir := filepath.Dir(exePath)

	// 2. Scan folders
	imagesDir := filepath.Join(baseDir, "images")
	videosDir := filepath.Join(baseDir, "videos")
	pdfDir := filepath.Join(baseDir, "pdf")

	imgExts := map[string]bool{".jpg": true, ".jpeg": true, ".png": true, ".webp": true, ".gif": true, ".svg": true}
	vidExts := map[string]bool{".mp4": true, ".webm": true, ".mov": true}
	pdfExts := map[string]bool{".pdf": true}

	getFiles := func(dir string, exts map[string]bool) []string {
		var files []string
		infos, err := ioutil.ReadDir(dir)
		if err != nil {
			return files
		}
		for _, info := range infos {
			if !info.IsDir() {
				ext := strings.ToLower(filepath.Ext(info.Name()))
				if exts[ext] {
					files = append(files, info.Name())
				}
			}
		}
		return files
	}

	images := getFiles(imagesDir, imgExts)
	videos := getFiles(videosDir, vidExts)
	pdfs := getFiles(pdfDir, pdfExts)

	// 3. Generate HTML
	var imgHtmls []string
	for _, f := range images {
		imgHtmls = append(imgHtmls, fmt.Sprintf(`<div class="gallery-item img-item"><img src="images/%s" alt="%s" /><div class="item-caption">%s</div></div>`, f, f, f))
	}
	imgHtml := strings.Join(imgHtmls, "\n")

	var vidHtmls []string
	for _, f := range videos {
		vidHtmls = append(vidHtmls, fmt.Sprintf(`<div class="gallery-item video-item"><video src="videos/%s" controls></video><div class="item-caption">%s</div></div>`, f, f))
	}
	vidHtml := strings.Join(vidHtmls, "\n")

	var pdfHtmls []string
	for _, f := range pdfs {
		pdfHtmls = append(pdfHtmls, fmt.Sprintf(`<div class="gallery-item pdf-item" data-pdf="pdf/%s"><iframe src="pdf/%s" style="width: 100%; height: 100%; border: none; display: block;"></iframe><div class="item-caption">%s</div></div>`, f, f, f))
	}
	pdfHtml := strings.Join(pdfHtmls, "\n")

	allHtml := strings.Join([]string{imgHtml, vidHtml, pdfHtml}, "\n")

	// 4. Load/Read templates
	var html, css, js string

	if embeddedHtmlB64 != "" {
		decHtml, _ := base64.StdEncoding.DecodeString(embeddedHtmlB64)
		html = string(decHtml)
		decCss, _ := base64.StdEncoding.DecodeString(embeddedCssB64)
		css = string(decCss)
		decJs, _ := base64.StdEncoding.DecodeString(embeddedJsB64)
		js = string(decJs)
	} else {
		htmlBytes, err := ioutil.ReadFile(filepath.Join(baseDir, "template.html"))
		if err != nil {
			// Fallback skeleton
			htmlBytes = []byte(`<!DOCTYPE html><html><head><title>Local Gallery</title><style>{{css}}</style></head><body>{{gallery}}</body></html>`)
		}
		html = string(htmlBytes)

		cssBytes, _ := ioutil.ReadFile(filepath.Join(baseDir, "template.css"))
		css = string(cssBytes)

		jsBytes, _ := ioutil.ReadFile(filepath.Join(baseDir, "template.js"))
		js = string(jsBytes)
	}

	// 5. Replace placeholders
	hasPlaceholder := strings.Contains(html, "{{gallery}}") ||
		strings.Contains(html, "{{images}}") ||
		strings.Contains(html, "{{videos}}") ||
		strings.Contains(html, "{{pdfs}}")

	if strings.Contains(html, "{{css}}") {
		html = strings.ReplaceAll(html, "{{css}}", css)
	} else {
		html = strings.Replace(html, "</head>", "<style>"+css+"</style></head>", 1)
	}

	if strings.Contains(html, "{{gallery}}") {
		html = strings.ReplaceAll(html, "{{gallery}}", allHtml)
	}
	if strings.Contains(html, "{{images}}") {
		html = strings.ReplaceAll(html, "{{images}}", imgHtml)
	}
	if strings.Contains(html, "{{videos}}") {
		html = strings.ReplaceAll(html, "{{videos}}", vidHtml)
	}
	if strings.Contains(html, "{{pdfs}}") {
		html = strings.ReplaceAll(html, "{{pdfs}}", pdfHtml)
	}

	if !hasPlaceholder {
		html = strings.Replace(html, "</body>", `<div class="gallery-fallback">`+allHtml+`</div></body>`, 1)
	}

	if strings.TrimSpace(js) != "" {
		html = strings.Replace(html, "</body>", "<script>"+js+"</script></body>", 1)
	}

	_ = ioutil.WriteFile(filepath.Join(baseDir, "index.html"), []byte(html), 0644)

	// 6. Find a random open port
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		panic(err)
	}
	port := listener.Addr().(*net.TCPAddr).Port
	listener.Close()

	// 7. Start HTTP Server
	serverAddr := fmt.Sprintf("127.0.0.1:%d", port)
	
	// Open browser in background
	go func() {
		url := fmt.Sprintf("http://%s/index.html", serverAddr)
		var cmd *exec.Cmd
		switch runtime.GOOS {
		case "windows":
			cmd = exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
		case "darwin":
			cmd = exec.Command("open", url)
		default: // linux, etc.
			cmd = exec.Command("xdg-open", url)
		}
		_ = cmd.Start()
	}()

	fmt.Printf("Gallery server running at http://%s/\n", serverAddr)
	fmt.Println("Press Ctrl+C to stop.")
	
	http.Handle("/", http.FileServer(http.Dir(baseDir)))
	if err := http.ListenAndServe(serverAddr, nil); err != nil {
		panic(err)
	}
}
