# Release Checklist

## English

1. Make sure `manifest.json` has the release version, for example `1.0.0`.
2. Run syntax checks:

   ```bash
   node --check main.js
   python3 -m py_compile converter_bridge.py
   ```

3. Generate release assets:

   ```bash
   ./scripts/prepare-release.sh
   ```

4. Create a GitHub release whose tag exactly matches the manifest version.
5. Upload these files from `dist/justmarkitdown-<version>/`:

   - `main.js`
   - `manifest.json`
   - `styles.css`
   - `converter_bridge.py`
   - `macos_ocr.swift`

6. Submit the GitHub repository URL at `community.obsidian.md`.

## Tiếng Việt

1. Đảm bảo `manifest.json` có đúng phiên bản phát hành, ví dụ `1.0.0`.
2. Chạy kiểm tra cú pháp:

   ```bash
   node --check main.js
   python3 -m py_compile converter_bridge.py
   ```

3. Tạo gói phát hành:

   ```bash
   ./scripts/prepare-release.sh
   ```

4. Tạo GitHub release với tag khớp chính xác phiên bản trong manifest.
5. Tải lên các tệp sau từ `dist/justmarkitdown-<version>/`:

   - `main.js`
   - `manifest.json`
   - `styles.css`
   - `converter_bridge.py`
   - `macos_ocr.swift`

6. Gửi URL GitHub repository tại `community.obsidian.md`.
