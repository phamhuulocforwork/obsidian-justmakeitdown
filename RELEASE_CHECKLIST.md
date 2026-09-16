# Release Checklist

## English

1. Make sure `manifest.json` has the release version, for example `1.0.0`.
2. Run syntax checks:

   ```bash
   node --check main.js
   python3 -m py_compile converter_bridge.py
   ```

3. Manual PDF test (Docling engine + MarkItDown fallback):

   - Install Docling into the vault environment: enable **Install Docling for PDF** in Environment tools, then run **Install environment** (or install manually: `<vault>/.venv/bin/pip install docling`, Windows `<vault>\.venv\Scripts\pip install docling`).
   - While installing, the Environment tools panel shows live pip output (Collecting/Downloading lines plus an ascii progress bar); confirm it updates during the Docling download.
   - Convert a sample PDF that has H1/H2 headings and at least one real table.
   - Open the generated `.md` and verify heading levels use `#`/`##` and the table is a pipe table (`| ... | ... |`), not a wall of text.
   - Uninstall Docling (`<vault>/.venv/bin/pip uninstall -y docling docling-core docling-ibm-models`), convert the same PDF again: it must still succeed via the MarkItDown fallback with no crash.
   - Convert one `.docx` and one `.xlsx`: output must be identical to before this change (no regression).

4. Generate release assets:

   ```bash
   ./scripts/prepare-release.sh
   ```

5. Create a GitHub release whose tag exactly matches the manifest version.
6. Upload these files from `dist/justmarkitdown-<version>/`:

   - `main.js`
   - `manifest.json`
   - `styles.css`
   - `converter_bridge.py`
   - `macos_ocr.swift`

7. Submit the GitHub repository URL at `community.obsidian.md`.

## Tiếng Việt

1. Đảm bảo `manifest.json` có đúng phiên bản phát hành, ví dụ `1.0.0`.
2. Chạy kiểm tra cú pháp:

   ```bash
   node --check main.js
   python3 -m py_compile converter_bridge.py
   ```

3. Kiểm tra PDF thủ công (engine Docling + fallback MarkItDown):

   - Cài Docling vào môi trường của vault: bật **Cài Docling cho PDF** trong Công cụ môi trường, rồi chạy **Cài đặt môi trường** (hoặc cài tay: `<vault>/.venv/bin/pip install docling`, Windows `<vault>\.venv\Scripts\pip install docling`).
   - Trong lúc cài, bảng Công cụ môi trường hiện log pip trực tiếp (dòng Collecting/Downloading kèm thanh tiến trình ascii); kiểm tra nó cập nhật trong khi tải Docling.
   - Chuyển đổi một PDF mẫu có heading H1/H2 và ít nhất một bảng thật.
   - Mở tệp `.md` vừa tạo, kiểm tra heading đúng cấp `#`/`##` và bảng ở dạng pipe table (`| ... | ... |`), không phải text dồn cục.
   - Gỡ Docling (`<vault>/.venv/bin/pip uninstall -y docling docling-core docling-ibm-models`), chuyển đổi lại PDF đó: vẫn phải thành công bằng fallback MarkItDown, không crash.
   - Chuyển đổi một tệp `.docx` và một tệp `.xlsx`: kết quả phải y hệt trước khi sửa (không regression).

4. Tạo gói phát hành:

   ```bash
   ./scripts/prepare-release.sh
   ```

5. Tạo GitHub release với tag khớp chính xác phiên bản trong manifest.
6. Tải lên các tệp sau từ `dist/justmarkitdown-<version>/`:

   - `main.js`
   - `manifest.json`
   - `styles.css`
   - `converter_bridge.py`
   - `macos_ocr.swift`

7. Gửi URL GitHub repository tại `community.obsidian.md`.
