# JustMarkItDown

A cross-platform, desktop-only Obsidian plugin that imports files, folders, archives, images, audio, web pages, and YouTube/Bilibili links into your vault as Markdown notes.

Current release: `1.0.5`

> Fork of [RenoirTian/markitdown-obsidian-importer](https://github.com/RenoirTian/markitdown-obsidian-importer) (originally by **Elek**), rebranded and maintained by [phamhuulocforwork](https://github.com/phamhuulocforwork).

The plugin UI follows your Obsidian language: English by default, Vietnamese when Obsidian is set to Vietnamese.

## Installation

This fork is not published in the community plugin store. Install it manually:

1. Download `main.js`, `manifest.json`, `styles.css`, `converter_bridge.py`, and `macos_ocr.swift` from the latest release.
2. Copy them into `<vault>/.obsidian/plugins/justmarkitdown/`.
3. Enable the plugin in **Settings → Community plugins → Installed plugins**.
4. Open the plugin settings and run **Environment tools → Install environment**.

## Usage

1. Open the plugin settings and use **Environment tools** to check or install the local Python environment.
2. Click the upload ribbon icon or run **Open MarkItDown Importer** from the command palette.
3. Pick or type the destination folder.
4. Drag files/folders into the drop area, choose a file/folder, or paste URLs into the URL box.

You can also drag a supported file, folder, or URL directly into the Markdown editor. The plugin converts it and inserts a wiki link at the cursor.

## Supported Sources

- PDF
- Word: `.doc`, `.docx`
- PowerPoint: `.ppt`, `.pptx`
- Excel: `.xls`, `.xlsx`, `.xlsm`
- Images with OCR: `.png`, `.jpg`, `.jpeg`, `.tif`, `.tiff`, `.bmp`, `.gif`, `.webp`
- Audio transcription: `.wav`, `.mp3`, `.m4a`, `.flac`, `.ogg`, `.aac`
- Web and text formats: `.html`, `.htm`, `.txt`, `.md`, `.csv`, `.json`, `.xml`, `.rtf`
- ZIP archives with recursive conversion of supported files inside
- Web pages, YouTube URLs, and Bilibili URLs; YouTube imports prefer public/manual or automatic captions plus video metadata; Bilibili imports extract title, uploader, description, pages, and public/AI subtitles
- Whole folders, recursively by default

## Notes

- The plugin runs `converter_bridge.py` with the vault-local Python environment.
- The settings page can create `.venv` in the current vault and install `markitdown[all]`.
- Python 3.10 or newer is required for the current MarkItDown package.
- macOS image OCR uses Apple Vision through `macos_ocr.swift` when available.
- Windows and Linux image OCR can use optional Tesseract OCR if it is installed on the system. Without Tesseract, image handling falls back to MarkItDown defaults.
- Audio conversion uses `imageio-ffmpeg` installed into the vault Python environment, so Homebrew is not required.
- YouTube imports use `yt-dlp` and `youtube-transcript-api`. If a video has no public captions, is region-unavailable, or the current network cannot access transcript endpoints, the note records a clear failure reason.
- Bilibili imports use public metadata/subtitle endpoints. They do not import danmaku and do not download audio. If no public or AI subtitle is available, the note records the reason and stops.

## Platform Setup

- macOS: install Python 3.10+ if the system Python is too old. The plugin can create `.venv/bin/python`.
- Windows: install Python 3.10+ from Python.org and enable `Add python.exe to PATH`, or use the Python launcher `py`. The plugin creates `.venv\Scripts\python.exe`.
- Linux: install Python 3.10+ with your distribution package manager. The plugin creates `.venv/bin/python`.

## Settings

- **Environment tools**: check Python, MarkItDown, bridge scripts, YouTube caption tools, OCR, and ffmpeg; create/update `.venv`; optionally install ffmpeg into the vault Python environment.
- **Python path**: Python used to run the bridge.
- **Default destination folder**: destination folder relative to the vault.
- **Convert folders recursively**: convert supported files inside folders recursively.
- **Insert links on editor drop**: convert editor drops and insert wiki links.
- **Open first imported note**: open the first imported note after conversion.
- **Overwrite existing notes**: overwrite existing notes instead of creating numbered copies.

## Credits

- Original project: [markitdown-obsidian-importer](https://github.com/RenoirTian/markitdown-obsidian-importer) by Elek.
- Fork maintained by [phamhuulocforwork](https://github.com/phamhuulocforwork).

## License

[MIT](LICENSE). Based on `markitdown-obsidian-importer`, Copyright (c) 2026 Elek.

---

## Tổng quan

Đây là plugin Obsidian chỉ dành cho desktop, dùng để nhập tệp, thư mục, nén, ảnh, âm thanh, trang web, liên kết YouTube và Bilibili vào vault hiện tại dưới dạng ghi chú Markdown.

Bản phát hành hiện tại: `1.0.5`

> Bản fork của [RenoirTian/markitdown-obsidian-importer](https://github.com/RenoirTian/markitdown-obsidian-importer) (tác giả gốc **Elek**), được đổi tên và duy trì bởi [phamhuulocforwork](https://github.com/phamhuulocforwork).

Giao diện plugin theo ngôn ngữ Obsidian: mặc định tiếng Anh, chuyển sang tiếng Việt khi Obsidian đặt ngôn ngữ Việt.

## Cài đặt

Bản fork này chưa có trên community plugin store. Cài thủ công:

1. Tải `main.js`, `manifest.json`, `styles.css`, `converter_bridge.py` và `macos_ocr.swift` từ bản phát hành mới nhất.
2. Chép vào `<vault>/.obsidian/plugins/justmarkitdown/`.
3. Bật plugin trong **Cài đặt → Community plugins → Installed plugins**.
4. Mở cài đặt plugin và chạy **Công cụ môi trường → Cài đặt môi trường**.

## Cách dùng

1. Mở cài đặt plugin và dùng **Công cụ môi trường** để kiểm tra hoặc cài môi trường Python cục bộ.
2. Bấm biểu tượng upload trên ribbon hoặc chạy **Mở trình nhập MarkItDown** từ command palette.
3. Chọn hoặc nhập thư mục đích.
4. Kéo thả tệp/thư mục vào vùng thả, chọn tệp/thư mục, hoặc dán URL vào ô liên kết.

Bạn cũng có thể kéo tệp, thư mục hoặc URL được hỗ trợ trực tiếp vào trình soạn Markdown. Plugin sẽ chuyển đổi và chèn wiki link tại vị trí con trỏ.

## Nguồn được hỗ trợ

- PDF
- Word: `.doc`, `.docx`
- PowerPoint: `.ppt`, `.pptx`
- Excel: `.xls`, `.xlsx`, `.xlsm`
- Ảnh có OCR: `.png`, `.jpg`, `.jpeg`, `.tif`, `.tiff`, `.bmp`, `.gif`, `.webp`
- Phiên âm âm thanh: `.wav`, `.mp3`, `.m4a`, `.flac`, `.ogg`, `.aac`
- Web và văn bản: `.html`, `.htm`, `.txt`, `.md`, `.csv`, `.json`, `.xml`, `.rtf`
- ZIP với chuyển đổi đệ quy các tệp được hỗ trợ bên trong
- Trang web, YouTube và Bilibili; YouTube ưu tiên phụ đề công khai/tự động và siêu dữ liệu video; Bilibili trích tiêu đề, người đăng, mô tả, phân P và phụ đề công khai/AI
- Cả thư mục, mặc định xử lý đệ quy

## Ghi chú

- Plugin chạy `converter_bridge.py` bằng môi trường Python trong vault.
- Trang cài đặt có thể tạo `.venv` trong vault và cài `markitdown[all]`.
- MarkItDown hiện tại cần Python 3.10 trở lên.
- OCR ảnh trên macOS dùng Apple Vision qua `macos_ocr.swift` khi có sẵn.
- Windows và Linux có thể dùng Tesseract OCR tùy chọn. Nếu chưa cài, ảnh sẽ dùng mặc định MarkItDown.
- Chuyển đổi âm thanh dùng `imageio-ffmpeg` trong môi trường Python của vault, không cần Homebrew.
- Nhập YouTube dùng `yt-dlp` và `youtube-transcript-api`. Nếu video không có phụ đề công khai, bị giới hạn vùng, hoặc mạng không truy cập được endpoint phụ đề, ghi chú sẽ ghi rõ lý do thất bại.
- Nhập Bilibili dùng API công khai cho siêu dữ liệu/phụ đề. Không nhập danmaku và không tải âm thanh. Nếu không có phụ đề công khai hoặc AI, ghi chú sẽ ghi lý do và dừng.

## Cài đặt theo nền tảng

- macOS: cài Python 3.10+ nếu Python hệ thống quá cũ. Plugin tạo `.venv/bin/python`.
- Windows: cài Python 3.10+ từ Python.org và bật `Add python.exe to PATH`, hoặc dùng Python Launcher `py`. Plugin tạo `.venv\Scripts\python.exe`.
- Linux: cài Python 3.10+ bằng trình quản lý gói của distro. Plugin tạo `.venv/bin/python`.

## Cài đặt plugin

- **Công cụ môi trường**: kiểm tra Python, MarkItDown, script cầu nối, công cụ phụ đề YouTube, OCR và ffmpeg; tạo/cập nhật `.venv`; tùy chọn cài ffmpeg vào môi trường Python của vault.
- **Đường dẫn Python**: Python dùng để chạy cầu nối.
- **Thư mục đích mặc định**: thư mục đích tương đối với vault.
- **Chuyển đổi thư mục đệ quy**: xử lý đệ quy các tệp được hỗ trợ trong thư mục.
- **Chèn liên kết khi thả vào trình soạn**: chuyển đổi khi thả vào editor và chèn wiki link.
- **Mở ghi chú đầu tiên sau khi nhập**: mở ghi chú đầu tiên sau khi chuyển đổi xong.
- **Ghi đè ghi chú trùng tên**: ghi đè ghi chú cũ thay vì tạo bản sao có số thứ tự.

## Ghi công

- Dự án gốc: [markitdown-obsidian-importer](https://github.com/RenoirTian/markitdown-obsidian-importer) của Elek.
- Bản fork được duy trì bởi [phamhuulocforwork](https://github.com/phamhuulocforwork).

## Giấy phép

[MIT](LICENSE). Dựa trên `markitdown-obsidian-importer`, Copyright (c) 2026 Elek.
