const {
  Plugin,
  Modal,
  PluginSettingTab,
  Setting,
  Notice,
  TFolder,
  MarkdownView,
  getLanguage,
} = require("obsidian");
const { execFile } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { fileURLToPath } = require("url");
let electronWebUtils = null;
try {
  electronWebUtils = require("electron").webUtils;
} catch (error) {
  electronWebUtils = null;
}

const STRINGS = {
  en: {
    "ribbon.tooltip": "MarkItDown Import",
    "command.openImporter": "Open MarkItDown Importer",
    "notice.converting": "MarkItDown is converting {count} source(s)...",
    "notice.conversionFailed": "Conversion failed: {source} {error}",
    "notice.conversionsComplete": "MarkItDown completed {count} conversion(s)",
    "notice.importFailed": "MarkItDown import failed: {error}",
    "notice.noFilePaths": "No file paths were read",
    "notice.invalidDest": "Destination cannot be an absolute path or contain ..",
    "notice.importFailedGeneric": "MarkItDown import failed",
    "notice.envCheckComplete": "Environment check complete",
    "notice.envInstallComplete": "MarkItDown environment installed",
    "notice.envInstallFailed": "Environment install failed; see settings status",
    "notice.venvSet": "Python path set to the vault .venv",
    "notice.ffmpegInstallComplete": "ffmpeg install complete",
    "notice.ffmpegInstallFailed": "ffmpeg install failed",
    "modal.title": "MarkItDown Import",
    "modal.subtitle": "Choose a destination folder, drag files or folders, or paste web, YouTube, and Bilibili links.",
    "modal.folderOptions": "Folder options",
    "modal.destFolder": "Destination folder",
    "modal.refreshFolders": "Refresh folders",
    "modal.urlPlaceholder": "Paste web, YouTube, or Bilibili links; one per line",
    "modal.convertUrls": "Convert links",
    "modal.dropTitle": "Drop files or folders to convert automatically",
    "modal.dropCopy": "Supports PDF, Office, Excel, image OCR, audio transcription, HTML, CSV/JSON/XML, ZIP, web pages, YouTube, and Bilibili subtitles",
    "modal.chooseFiles": "Choose files",
    "modal.chooseFolder": "Choose folder",
    "modal.waiting": "Waiting for sources",
    "modal.vaultRoot": "Vault root",
    "modal.customFolder": "Custom folder...",
    "result.failed": "Failed",
    "result.success": "Done",
    "result.fileRead": "File read",
    "result.fileReadDetail": "Obsidian did not provide local paths for these files. Re-drop them or use desktop Obsidian.",
    "result.unsupportedSource": "Unsupported source type.",
    "result.noSources": "No convertible sources",
    "result.converting": "Converting {count} source(s)...",
    "result.conversionRequest": "Conversion request",
    "result.unknownError": "Unknown error",
    "result.doneCount": "Completed {success} / {total} source(s)",
    "result.failedStatus": "Conversion failed",
    "settings.title": "JustMarkItDown",
    "settings.pythonPath.name": "Python path",
    "settings.pythonPath.desc": "Python used to run the bundled converter_bridge.py. Leave empty to use the vault .venv automatically.",
    "settings.defaultDest.name": "Default destination folder",
    "settings.defaultDest.desc": "Folder relative to the current Obsidian vault; created automatically if missing.",
    "settings.recursiveFolders.name": "Convert folders recursively",
    "settings.recursiveFolders.desc": "When dropping or choosing a folder, recursively convert all supported files inside.",
    "settings.insertLinks.name": "Insert links on editor drop",
    "settings.insertLinks.desc": "When dropping files, folders, or URLs into the Markdown editor, insert wiki links after conversion.",
    "settings.revealAfterImport.name": "Open first imported note",
    "settings.overwrite.name": "Overwrite existing notes",
    "settings.overwrite.desc": "When off, duplicate names get -2, -3 suffixes.",
    "settings.env.title": "Environment tools",
    "settings.env.note": "After first install or copying the plugin to another user, check and install the local runtime here.",
    "settings.env.notChecked": "Environment not checked yet",
    "settings.env.check.name": "Check environment",
    "settings.env.check.desc": "Check Python, MarkItDown, bridge script, YouTube captions, OCR, and ffmpeg.",
    "settings.env.check.button": "Check environment",
    "settings.env.install.name": "Install/update Python environment",
    "settings.env.install.desc": "Create a .venv in the current vault and install markitdown[all], YouTube caption tools, and related dependencies.",
    "settings.env.install.button": "Install environment",
    "settings.env.useVenv.name": "Use vault .venv",
    "settings.env.useVenv.desc": "Set the Python path to the cross-platform .venv Python under the current vault.",
    "settings.env.useVenv.button": "Use .venv",
    "settings.env.ffmpeg.name": "Install ffmpeg (optional)",
    "settings.env.ffmpeg.desc": "Audio transcription often needs ffmpeg. Installs into the vault Python environment without Homebrew.",
    "settings.env.ffmpeg.button": "Install ffmpeg",
    "settings.env.platform": "Platform: {platform}",
    "settings.env.vault": "Vault: {path}",
    "settings.env.python": "Python: {path}",
    "settings.env.pythonFound": "Python file: found",
    "settings.env.pythonMissing": "Python file: not found",
    "settings.env.bridgeFound": "Bridge script: found",
    "settings.env.bridgeMissing": "Bridge script: not found",
    "settings.env.ocrScriptFound": "macOS OCR script: found",
    "settings.env.ocrScriptMissing": "macOS OCR script: not found",
    "settings.env.swiftFound": "macOS OCR runtime: Swift found",
    "settings.env.swiftMissing": "macOS OCR runtime: Swift not found",
    "settings.env.ocrTesseractNote": "OCR: this platform uses optional Tesseract; without it, images fall back to MarkItDown defaults.",
    "settings.env.markitdownInstalled": "MarkItDown: installed",
    "settings.env.markitdownNotReady": "MarkItDown: not ready ({error})",
    "settings.env.youtubeTranscriptInstalled": "YouTube captions: youtube-transcript-api installed",
    "settings.env.youtubeTranscriptMissing": "YouTube captions: youtube-transcript-api not installed",
    "settings.env.ytdlpInstalled": "YouTube metadata: yt-dlp installed",
    "settings.env.ytdlpMissing": "YouTube metadata: yt-dlp not installed",
    "settings.env.pytesseractInstalled": "pytesseract: installed (system Tesseract executable still required)",
    "settings.env.pytesseractMissing": "pytesseract: not installed (affects image OCR only)",
    "settings.env.ffmpegSystemInstalled": "ffmpeg: installed",
    "settings.env.ffmpegInPython": "ffmpeg: installed in Python environment ({path})",
    "settings.env.ffmpegMissing": "ffmpeg: not found (affects some audio formats only)",
    "settings.env.installing": "Installing...",
    "settings.env.creatingVenv": "Creating .venv...",
    "settings.env.location": "Location: {path}",
    "settings.env.pythonNotFound": "Python 3.10 or newer was not found. Install Python 3.10+, then click Install again. On Windows, enable Add python.exe to PATH.",
    "settings.env.usingPython": "Using Python: {label}",
    "settings.env.upgradingPip": "Upgrading pip...",
    "settings.env.installingMarkitdown": "Installing MarkItDown dependencies...",
    "settings.env.installingMarkitdownNote": "This step may take a few minutes.",
    "settings.env.installingFfmpegTool": "Installing audio tool imageio-ffmpeg...",
    "settings.env.installingYoutubeTools": "Installing YouTube tools youtube-transcript-api and yt-dlp...",
    "settings.env.installingPytesseract": "Installing optional OCR package pytesseract...",
    "settings.env.installComplete": "Install complete",
    "settings.env.installFailed": "Install failed",
    "settings.env.ocrMac": "OCR: macOS Vision enabled when available",
    "settings.env.ocrTesseract": "OCR: pytesseract installed; install system Tesseract for OCR",
    "settings.env.pythonMissingForFfmpeg": "Python environment not found. Click Install environment first or set a valid Python path.",
    "settings.env.installingFfmpeg": "Installing bundled ffmpeg tool...",
    "settings.env.installingFfmpegNote": "Installing imageio-ffmpeg; Homebrew is not required.",
    "settings.env.ffmpegInstallComplete": "ffmpeg install complete",
    "settings.env.ffmpegInstallFailed": "ffmpeg install failed",
    "error.pythonMissing": "Python not found: {path}",
    "error.bridgeMissing": "Bridge script not found: {path}",
    "error.missingRuntimeFiles": "Missing plugin runtime files: {files}. Reinstall the plugin."
  },
  vi: {
    "ribbon.tooltip": "Nhập MarkItDown",
    "command.openImporter": "Mở trình nhập MarkItDown",
    "notice.converting": "MarkItDown đang chuyển đổi {count} nguồn...",
    "notice.conversionFailed": "Chuyển đổi thất bại: {source} {error}",
    "notice.conversionsComplete": "MarkItDown hoàn tất {count} lần chuyển đổi",
    "notice.importFailed": "Nhập MarkItDown thất bại: {error}",
    "notice.noFilePaths": "Không đọc được đường dẫn tệp",
    "notice.invalidDest": "Thư mục đích không được là đường dẫn tuyệt đối hoặc chứa ..",
    "notice.importFailedGeneric": "Nhập MarkItDown thất bại",
    "notice.envCheckComplete": "Kiểm tra môi trường hoàn tất",
    "notice.envInstallComplete": "Cài đặt môi trường MarkItDown hoàn tất",
    "notice.envInstallFailed": "Cài đặt môi trường thất bại; xem trạng thái trong cài đặt",
    "notice.venvSet": "Đã đặt Python sang .venv của vault",
    "notice.ffmpegInstallComplete": "Cài ffmpeg hoàn tất",
    "notice.ffmpegInstallFailed": "Cài ffmpeg thất bại",
    "modal.title": "Nhập MarkItDown",
    "modal.subtitle": "Chọn thư mục đích, kéo thả tệp/thư mục, hoặc dán liên kết web, YouTube và Bilibili.",
    "modal.folderOptions": "Tùy chọn thư mục",
    "modal.destFolder": "Thư mục đích",
    "modal.refreshFolders": "Làm mới thư mục",
    "modal.urlPlaceholder": "Dán liên kết web, YouTube hoặc Bilibili; mỗi dòng một liên kết",
    "modal.convertUrls": "Chuyển đổi liên kết",
    "modal.dropTitle": "Kéo thả tệp hoặc thư mục để tự động chuyển đổi",
    "modal.dropCopy": "Hỗ trợ PDF, Office, Excel, OCR ảnh, phiên âm âm thanh, HTML, CSV/JSON/XML, ZIP, trang web, YouTube và phụ đề Bilibili",
    "modal.chooseFiles": "Chọn tệp",
    "modal.chooseFolder": "Chọn thư mục",
    "modal.waiting": "Đang chờ nguồn",
    "modal.vaultRoot": "Gốc vault",
    "modal.customFolder": "Thư mục tùy chỉnh...",
    "result.failed": "Thất bại",
    "result.success": "Hoàn tất",
    "result.fileRead": "Đọc tệp",
    "result.fileReadDetail": "Obsidian không cung cấp đường dẫn cục bộ cho các tệp này. Hãy kéo thả lại hoặc dùng Obsidian desktop.",
    "result.unsupportedSource": "Loại nguồn không được hỗ trợ.",
    "result.noSources": "Không có nguồn có thể chuyển đổi",
    "result.converting": "Đang chuyển đổi {count} nguồn...",
    "result.conversionRequest": "Yêu cầu chuyển đổi",
    "result.unknownError": "Lỗi không xác định",
    "result.doneCount": "Hoàn tất {success} / {total} nguồn",
    "result.failedStatus": "Chuyển đổi thất bại",
    "settings.title": "JustMarkItDown",
    "settings.pythonPath.name": "Đường dẫn Python",
    "settings.pythonPath.desc": "Python chạy converter_bridge.py đi kèm plugin. Để trống sẽ dùng .venv của vault.",
    "settings.defaultDest.name": "Thư mục đích mặc định",
    "settings.defaultDest.desc": "Thư mục tương đối với vault Obsidian hiện tại; tự tạo nếu chưa có.",
    "settings.recursiveFolders.name": "Chuyển đổi thư mục đệ quy",
    "settings.recursiveFolders.desc": "Khi kéo thả hoặc chọn thư mục, xử lý đệ quy mọi tệp được hỗ trợ bên trong.",
    "settings.insertLinks.name": "Chèn liên kết khi thả vào trình soạn",
    "settings.insertLinks.desc": "Khi thả tệp, thư mục hoặc URL vào trình soạn Markdown, chèn wiki link sau khi chuyển đổi.",
    "settings.revealAfterImport.name": "Mở ghi chú đầu tiên sau khi nhập",
    "settings.overwrite.name": "Ghi đè ghi chú trùng tên",
    "settings.overwrite.desc": "Khi tắt, tệp trùng tên sẽ được thêm hậu tố -2, -3.",
    "settings.env.title": "Công cụ môi trường",
    "settings.env.note": "Sau khi cài lần đầu hoặc sao chép plugin cho người khác, kiểm tra và cài môi trường cục bộ tại đây.",
    "settings.env.notChecked": "Chưa kiểm tra môi trường",
    "settings.env.check.name": "Kiểm tra môi trường",
    "settings.env.check.desc": "Kiểm tra Python, MarkItDown, script cầu nối, phụ đề YouTube, OCR và ffmpeg.",
    "settings.env.check.button": "Kiểm tra môi trường",
    "settings.env.install.name": "Cài/cập nhật môi trường Python",
    "settings.env.install.desc": "Tạo .venv trong vault hiện tại và cài markitdown[all], công cụ phụ đề YouTube và các phụ thuộc liên quan.",
    "settings.env.install.button": "Cài môi trường",
    "settings.env.useVenv.name": "Dùng .venv của vault",
    "settings.env.useVenv.desc": "Đặt đường dẫn Python sang Python .venv đa nền tảng trong vault hiện tại.",
    "settings.env.useVenv.button": "Dùng .venv",
    "settings.env.ffmpeg.name": "Cài ffmpeg (tùy chọn)",
    "settings.env.ffmpeg.desc": "Phiên âm âm thanh thường cần ffmpeg. Cài vào môi trường Python của vault, không cần Homebrew.",
    "settings.env.ffmpeg.button": "Cài ffmpeg",
    "settings.env.platform": "Nền tảng: {platform}",
    "settings.env.vault": "Vault: {path}",
    "settings.env.python": "Python: {path}",
    "settings.env.pythonFound": "Tệp Python: đã tìm thấy",
    "settings.env.pythonMissing": "Tệp Python: không tìm thấy",
    "settings.env.bridgeFound": "Script cầu nối: đã tìm thấy",
    "settings.env.bridgeMissing": "Script cầu nối: không tìm thấy",
    "settings.env.ocrScriptFound": "Script OCR macOS: đã tìm thấy",
    "settings.env.ocrScriptMissing": "Script OCR macOS: không tìm thấy",
    "settings.env.swiftFound": "Runtime OCR macOS: đã tìm thấy Swift",
    "settings.env.swiftMissing": "Runtime OCR macOS: không tìm thấy Swift",
    "settings.env.ocrTesseractNote": "OCR: nền tảng này dùng Tesseract tùy chọn; nếu chưa cài, ảnh sẽ dùng mặc định MarkItDown.",
    "settings.env.markitdownInstalled": "MarkItDown: đã cài",
    "settings.env.markitdownNotReady": "MarkItDown: chưa sẵn sàng ({error})",
    "settings.env.youtubeTranscriptInstalled": "Phụ đề YouTube: đã cài youtube-transcript-api",
    "settings.env.youtubeTranscriptMissing": "Phụ đề YouTube: chưa cài youtube-transcript-api",
    "settings.env.ytdlpInstalled": "Siêu dữ liệu YouTube: đã cài yt-dlp",
    "settings.env.ytdlpMissing": "Siêu dữ liệu YouTube: chưa cài yt-dlp",
    "settings.env.pytesseractInstalled": "pytesseract: đã cài (vẫn cần Tesseract trên hệ thống)",
    "settings.env.pytesseractMissing": "pytesseract: chưa cài (chỉ ảnh hưởng OCR ảnh)",
    "settings.env.ffmpegSystemInstalled": "ffmpeg: đã cài",
    "settings.env.ffmpegInPython": "ffmpeg: đã cài trong môi trường Python ({path})",
    "settings.env.ffmpegMissing": "ffmpeg: không tìm thấy (chỉ ảnh hưởng một số định dạng âm thanh)",
    "settings.env.installing": "Đang cài...",
    "settings.env.creatingVenv": "Đang tạo .venv...",
    "settings.env.location": "Vị trí: {path}",
    "settings.env.pythonNotFound": "Không tìm thấy Python 3.10 trở lên. Hãy cài Python 3.10+ rồi bấm Cài lại. Trên Windows, bật Add python.exe to PATH.",
    "settings.env.usingPython": "Dùng Python: {label}",
    "settings.env.upgradingPip": "Đang nâng cấp pip...",
    "settings.env.installingMarkitdown": "Đang cài phụ thuộc MarkItDown...",
    "settings.env.installingMarkitdownNote": "Bước này có thể mất vài phút.",
    "settings.env.installingFfmpegTool": "Đang cài công cụ âm thanh imageio-ffmpeg...",
    "settings.env.installingYoutubeTools": "Đang cài công cụ YouTube youtube-transcript-api và yt-dlp...",
    "settings.env.installingPytesseract": "Đang cài gói OCR tùy chọn pytesseract...",
    "settings.env.installComplete": "Cài đặt hoàn tất",
    "settings.env.installFailed": "Cài đặt thất bại",
    "settings.env.ocrMac": "OCR: bật macOS Vision khi có sẵn",
    "settings.env.ocrTesseract": "OCR: đã cài pytesseract; cần cài Tesseract trên hệ thống để OCR",
    "settings.env.pythonMissingForFfmpeg": "Không tìm thấy môi trường Python. Bấm Cài môi trường trước hoặc đặt đường dẫn Python hợp lệ.",
    "settings.env.installingFfmpeg": "Đang cài công cụ ffmpeg tích hợp...",
    "settings.env.installingFfmpegNote": "Đang cài imageio-ffmpeg; không cần Homebrew.",
    "settings.env.ffmpegInstallComplete": "Cài ffmpeg hoàn tất",
    "settings.env.ffmpegInstallFailed": "Cài ffmpeg thất bại",
    "error.pythonMissing": "Không tìm thấy Python: {path}",
    "error.bridgeMissing": "Không tìm thấy script cầu nối: {path}",
    "error.missingRuntimeFiles": "Thiếu tệp runtime của plugin: {files}. Hãy cài lại plugin."
  }
};

let currentLocale = "en";

function normalizeLocale(value) {
  const lang = String(value || "en").toLowerCase();
  if (lang.startsWith("vi")) {
    return "vi";
  }
  return "en";
}

function detectLocale() {
  try {
    if (typeof getLanguage === "function") {
      return normalizeLocale(getLanguage());
    }
  } catch (error) {
    // Obsidian versions before getLanguage() fall back below.
  }

  try {
    if (typeof localStorage !== "undefined") {
      return normalizeLocale(localStorage.getItem("language"));
    }
  } catch (error) {
    // Ignore storage access failures in non-browser contexts.
  }

  return "en";
}

function setLocale(locale) {
  currentLocale = normalizeLocale(locale);
}

function t(key, vars) {
  const table = STRINGS[currentLocale] || STRINGS.en;
  let text = table[key] ?? STRINGS.en[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replace(new RegExp(`\\{${name}\\}`, "g"), String(value));
    }
  }
  return text;
}

function getLocale() {
  return currentLocale;
}

const i18n = {
  detectLocale,
  setLocale,
  t,
  getLocale
};

const DEFAULT_SETTINGS = {
  pythonPath: "",
  defaultDest: "__IMPORTS",
  recursiveFolders: true,
  insertLinksOnEditorDrop: true,
  revealAfterImport: true,
  overwrite: false,
};

const SUPPORTED_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".xlsm",
  ".csv",
  ".json",
  ".xml",
  ".html",
  ".htm",
  ".txt",
  ".md",
  ".rtf",
  ".png",
  ".jpg",
  ".jpeg",
  ".tif",
  ".tiff",
  ".bmp",
  ".gif",
  ".webp",
  ".wav",
  ".mp3",
  ".m4a",
  ".flac",
  ".ogg",
  ".aac",
  ".zip",
]);

const ACCEPT_EXTENSIONS = Array.from(SUPPORTED_EXTENSIONS).join(",");
const IS_WINDOWS = process.platform === "win32";
const IS_MAC = process.platform === "darwin";
const REQUIRED_RUNTIME_FILES = ["converter_bridge.py", "macos_ocr.swift"];

module.exports = class MarkItDownImporterPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.refreshLocale();
    this.ensureRuntimeFiles();

    this.addRibbonIcon("upload", i18n.t("ribbon.tooltip"), () => {
      new MarkItDownImportModal(this).open();
    });

    this.addCommand({
      id: "open-justmarkitdown",
      name: i18n.t("command.openImporter"),
      callback: () => new MarkItDownImportModal(this).open(),
    });

    this.registerDomEvent(document, "drop", (event) => this.handleEditorDrop(event), true);

    this.addSettingTab(new MarkItDownImporterSettingTab(this.app, this));
  }

  getVaultPath() {
    return this.app.vault.adapter.getBasePath?.() || "";
  }

  getPluginPath() {
    return path.join(this.getVaultPath(), ".obsidian", "plugins", this.manifest.id);
  }

  getBridgeScript() {
    return path.join(this.getPluginPath(), "converter_bridge.py");
  }

  getOcrScript() {
    return path.join(this.getPluginPath(), "macos_ocr.swift");
  }

  getToolsDir() {
    return path.join(this.getVaultPath(), "tools");
  }

  getDefaultPythonPath() {
    return IS_WINDOWS
      ? path.join(this.getVaultPath(), ".venv", "Scripts", "python.exe")
      : path.join(this.getVaultPath(), ".venv", "bin", "python");
  }

  getPythonPath() {
    return this.settings.pythonPath || this.getDefaultPythonPath();
  }

  refreshLocale() {
    i18n.setLocale(i18n.detectLocale());
  }

  ensureRuntimeFiles() {
    const pluginPath = this.getPluginPath();
    const missing = REQUIRED_RUNTIME_FILES.filter(
      (filename) => !fs.existsSync(path.join(pluginPath, filename)),
    );
    if (missing.length) {
      const message = i18n.t("error.missingRuntimeFiles", { files: missing.join(", ") });
      console.error(message);
      new Notice(message);
    }
  }

  async runImport(sources, dest, options = {}) {
    const normalizedSources = Array.from(new Set(sources.filter(Boolean)));
    if (!normalizedSources.length) {
      return [];
    }
    return runBridge(this, normalizedSources, dest, options);
  }

  async handleEditorDrop(event) {
    if (!this.settings.insertLinksOnEditorDrop) {
      return;
    }

    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view || !event.target?.closest?.(".cm-editor")) {
      return;
    }

    const sources = getSourcesFromDataTransfer(event.dataTransfer);
    if (!sources.length) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const dest = normalizeDest(this.settings.defaultDest);
    new Notice(i18n.t("notice.converting", { count: sources.length }));

    try {
      const results = await this.runImport(sources, dest, {
        recursive: this.settings.recursiveFolders,
      });
      const successes = results.filter((result) => result.ok && result.output);
      const failures = results.filter((result) => !result.ok);

      if (successes.length) {
        const links = successes.map((result) => outputToWikiLink(this, result.output));
        view.editor.replaceSelection(`${links.join("\n")}\n`);
      }

      for (const failure of failures) {
        new Notice(
          i18n.t("notice.conversionFailed", {
            source: failure.source || "",
            error: failure.error || "",
          }),
        );
      }
      new Notice(i18n.t("notice.conversionsComplete", { count: successes.length }));
    } catch (error) {
      new Notice(i18n.t("notice.importFailed", { error: error.message }));
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
};

class MarkItDownImportModal extends Modal {
  constructor(plugin) {
    super(plugin.app);
    this.plugin = plugin;
    this.selectedDest = plugin.settings.defaultDest;
    this.isBusy = false;
  }

  onOpen() {
    i18n.setLocale(i18n.detectLocale());
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl?.addClass("justmarkitdown-shell");
    contentEl.addClass("justmarkitdown-modal");

    const header = contentEl.createDiv({ cls: "justmarkitdown-header" });
    header.createEl("h2", { text: i18n.t("modal.title") });
    header.createEl("p", {
      text: i18n.t("modal.subtitle"),
    });
    this.installDragHandle(header);

    const controls = contentEl.createDiv({ cls: "justmarkitdown-controls" });
    const folderWrap = controls.createDiv({ cls: "justmarkitdown-field" });
    folderWrap.createEl("label", { text: i18n.t("modal.folderOptions") });
    this.folderSelect = folderWrap.createEl("select");

    const destWrap = controls.createDiv({ cls: "justmarkitdown-field" });
    destWrap.createEl("label", { text: i18n.t("modal.destFolder") });
    this.destInput = destWrap.createEl("input", {
      type: "text",
      value: this.selectedDest,
    });

    const refreshButton = controls.createEl("button", { text: i18n.t("modal.refreshFolders") });
    refreshButton.type = "button";
    refreshButton.addEventListener("click", () => this.refreshFolders());

    const urlRow = contentEl.createDiv({ cls: "justmarkitdown-url-row" });
    this.urlInput = urlRow.createEl("textarea", {
      attr: {
        placeholder: i18n.t("modal.urlPlaceholder"),
      },
    });
    const convertUrlButton = urlRow.createEl("button", { text: i18n.t("modal.convertUrls") });
    convertUrlButton.type = "button";
    convertUrlButton.addEventListener("click", () => this.importUrls());

    this.dropzone = contentEl.createDiv({ cls: "justmarkitdown-dropzone" });
    this.dropzone.createDiv({ cls: "justmarkitdown-drop-title", text: i18n.t("modal.dropTitle") });
    this.dropzone.createDiv({
      cls: "justmarkitdown-drop-copy",
      text: i18n.t("modal.dropCopy"),
    });

    const buttonRow = this.dropzone.createDiv({ cls: "justmarkitdown-button-row" });
    const chooseButton = buttonRow.createEl("button", { text: i18n.t("modal.chooseFiles") });
    chooseButton.type = "button";
    const chooseFolderButton = buttonRow.createEl("button", { text: i18n.t("modal.chooseFolder") });
    chooseFolderButton.type = "button";

    this.fileInput = this.dropzone.createEl("input", {
      type: "file",
      attr: {
        multiple: true,
        accept: ACCEPT_EXTENSIONS,
      },
    });
    this.folderInput = this.dropzone.createEl("input", {
      type: "file",
      attr: {
        multiple: true,
        webkitdirectory: true,
      },
    });

    this.statusEl = contentEl.createDiv({
      cls: "justmarkitdown-status",
      text: i18n.t("modal.waiting"),
    });
    this.resultsEl = contentEl.createDiv({ cls: "justmarkitdown-results" });

    chooseButton.addEventListener("click", () => this.fileInput.click());
    chooseFolderButton.addEventListener("click", () => this.folderInput.click());
    this.fileInput.addEventListener("change", () => {
      this.importFiles(Array.from(this.fileInput.files || []));
      this.fileInput.value = "";
    });
    this.folderInput.addEventListener("change", () => {
      this.importFiles(Array.from(this.folderInput.files || []));
      this.folderInput.value = "";
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      this.dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        this.dropzone.addClass("is-dragging");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      this.dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        this.dropzone.removeClass("is-dragging");
      });
    });

    this.dropzone.addEventListener("drop", (event) => {
      const sources = getSourcesFromDataTransfer(event.dataTransfer);
      this.importSources(sources);
    });

    this.folderSelect.addEventListener("change", () => {
      if (this.folderSelect.value === "__custom__") {
        this.destInput.focus();
        return;
      }
      this.destInput.value = this.folderSelect.value;
      this.selectedDest = this.folderSelect.value;
    });

    this.destInput.addEventListener("input", () => {
      this.selectedDest = this.destInput.value.trim();
      this.syncFolderSelect();
    });

    this.refreshFolders();
  }

  onClose() {
    this.removeDragHandle?.();
    this.modalEl?.removeClass("justmarkitdown-shell");
  }

  installDragHandle(handle) {
    const modal = this.modalEl;
    if (!modal) {
      return;
    }

    let offsetX = 0;
    let offsetY = 0;
    let dragging = false;

    const moveModal = (event) => {
      if (!dragging) {
        return;
      }
      const width = modal.offsetWidth;
      const height = modal.offsetHeight;
      const maxLeft = Math.max(0, window.innerWidth - width);
      const maxTop = Math.max(0, window.innerHeight - height);
      const left = Math.min(Math.max(0, event.clientX - offsetX), maxLeft);
      const top = Math.min(Math.max(0, event.clientY - offsetY), maxTop);
      modal.style.left = `${left}px`;
      modal.style.top = `${top}px`;
      modal.style.right = "auto";
      modal.style.bottom = "auto";
      modal.style.margin = "0";
    };

    const stopDrag = () => {
      dragging = false;
      document.body.classList.remove("justmarkitdown-dragging");
    };

    const startDrag = (event) => {
      if (event.button !== 0 || event.target.closest("button, input, textarea, select, a")) {
        return;
      }
      const rect = modal.getBoundingClientRect();
      modal.style.position = "fixed";
      modal.style.left = `${rect.left}px`;
      modal.style.top = `${rect.top}px`;
      modal.style.right = "auto";
      modal.style.bottom = "auto";
      modal.style.margin = "0";
      modal.style.transform = "none";
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
      dragging = true;
      document.body.classList.add("justmarkitdown-dragging");
      event.preventDefault();
    };

    handle.addEventListener("mousedown", startDrag);
    window.addEventListener("mousemove", moveModal);
    window.addEventListener("mouseup", stopDrag);

    this.removeDragHandle = () => {
      handle.removeEventListener("mousedown", startDrag);
      window.removeEventListener("mousemove", moveModal);
      window.removeEventListener("mouseup", stopDrag);
      document.body.classList.remove("justmarkitdown-dragging");
    };
  }

  getFolders() {
    const folders = ["."];
    for (const file of this.app.vault.getAllLoadedFiles()) {
      if (file instanceof TFolder && file.path) {
        folders.push(file.path);
      }
    }
    return Array.from(new Set(folders)).sort((a, b) => {
      const depth = a.split("/").length - b.split("/").length;
      return depth || a.localeCompare(b);
    });
  }

  refreshFolders() {
    const folders = this.getFolders();
    this.folderSelect.empty();
    for (const folder of folders) {
      const option = document.createElement("option");
      option.value = folder;
      option.textContent = folder === "." ? i18n.t("modal.vaultRoot") : folder;
      this.folderSelect.appendChild(option);
    }

    const custom = document.createElement("option");
    custom.value = "__custom__";
    custom.textContent = i18n.t("modal.customFolder");
    this.folderSelect.appendChild(custom);
    this.syncFolderSelect();
  }

  syncFolderSelect() {
    const value = normalizeDest(this.destInput.value || this.plugin.settings.defaultDest);
    const hasOption = Array.from(this.folderSelect.options).some(
      (option) => option.value === value,
    );
    this.folderSelect.value = hasOption ? value : "__custom__";
  }

  importFiles(files) {
    const sources = files.map(getPathForFile).filter(Boolean);
    if (!sources.length && files.length) {
      this.addResult(
        i18n.t("result.failed"),
        i18n.t("result.fileRead"),
        i18n.t("result.fileReadDetail"),
        true,
      );
      new Notice(i18n.t("notice.noFilePaths"));
      return;
    }
    this.importSources(sources);
  }

  importUrls() {
    const urls = this.urlInput.value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(isUrl);
    this.importSources(urls);
  }

  async importSources(sources) {
    if (this.isBusy || !sources.length) {
      return;
    }

    const dest = normalizeDest(this.destInput.value || this.plugin.settings.defaultDest);
    if (!isSafeVaultPath(dest)) {
      new Notice(i18n.t("notice.invalidDest"));
      return;
    }

    const unsupported = sources.filter((source) => !isSupportedSource(source));
    const supported = sources.filter(isSupportedSource);
    for (const source of unsupported) {
      this.addResult(i18n.t("result.failed"), source, i18n.t("result.unsupportedSource"), true);
    }
    if (!supported.length) {
      this.setStatus(i18n.t("result.noSources"));
      return;
    }

    this.isBusy = true;
    this.setStatus(i18n.t("result.converting", { count: supported.length }));

    try {
      const results = await this.plugin.runImport(supported, dest, {
        recursive: this.plugin.settings.recursiveFolders,
        overwrite: this.plugin.settings.overwrite,
      });
      const successes = results.filter((result) => result.ok);
      const failures = results.filter((result) => !result.ok);

      for (const result of successes) {
        this.addResult(
          i18n.t("result.success"),
          path.basename(result.output),
          result.output,
          false,
        );
      }
      for (const result of failures) {
        this.addResult(
          i18n.t("result.failed"),
          result.source || i18n.t("result.conversionRequest"),
          result.error || i18n.t("result.unknownError"),
          true,
        );
      }

      this.setStatus(
        i18n.t("result.doneCount", { success: successes.length, total: results.length }),
      );
      new Notice(i18n.t("notice.conversionsComplete", { count: successes.length }));

      if (this.plugin.settings.revealAfterImport && successes[0]?.output) {
        await this.openImportedNote(successes[0].output);
      }
    } catch (error) {
      this.addResult(
        i18n.t("result.failed"),
        i18n.t("result.conversionRequest"),
        error.message,
        true,
      );
      this.setStatus(i18n.t("result.failedStatus"));
      new Notice(i18n.t("notice.importFailedGeneric"));
    } finally {
      this.isBusy = false;
    }
  }

  async openImportedNote(outputPath) {
    const relativePath = outputToVaultRelativePath(this.plugin, outputPath);
    if (!relativePath) {
      return;
    }
    const file = this.app.vault.getAbstractFileByPath(relativePath);
    if (file) {
      await this.app.workspace.getLeaf(false).openFile(file);
    }
  }

  setStatus(text) {
    this.statusEl.setText(text);
  }

  addResult(status, name, detail, isError) {
    const item = this.resultsEl.createDiv({ cls: "justmarkitdown-result" });
    item.createDiv({
      cls: `justmarkitdown-badge ${isError ? "is-error" : ""}`,
      text: status,
    });
    const body = item.createDiv();
    body.createDiv({ cls: "justmarkitdown-result-name", text: name });
    body.createDiv({ cls: "justmarkitdown-result-detail", text: detail });
    this.resultsEl.prepend(item);
  }
}

class MarkItDownImporterSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    i18n.setLocale(i18n.detectLocale());
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "MarkItDown Importer" });

    this.renderEnvironmentSection(containerEl);

    new Setting(containerEl)
      .setName(i18n.t("settings.pythonPath.name"))
      .setDesc(i18n.t("settings.pythonPath.desc"))
      .addText((text) => {
        text
          .setPlaceholder(this.plugin.getDefaultPythonPath())
          .setValue(this.plugin.settings.pythonPath)
          .onChange(async (value) => {
            this.plugin.settings.pythonPath = value.trim();
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(i18n.t("settings.defaultDest.name"))
      .setDesc(i18n.t("settings.defaultDest.desc"))
      .addText((text) => {
        text
          .setPlaceholder("__IMPORTS")
          .setValue(this.plugin.settings.defaultDest)
          .onChange(async (value) => {
            this.plugin.settings.defaultDest = normalizeDest(value || DEFAULT_SETTINGS.defaultDest);
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName(i18n.t("settings.recursiveFolders.name"))
      .setDesc(i18n.t("settings.recursiveFolders.desc"))
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.recursiveFolders).onChange(async (value) => {
          this.plugin.settings.recursiveFolders = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(i18n.t("settings.insertLinks.name"))
      .setDesc(i18n.t("settings.insertLinks.desc"))
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.insertLinksOnEditorDrop).onChange(async (value) => {
          this.plugin.settings.insertLinksOnEditorDrop = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(i18n.t("settings.revealAfterImport.name"))
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.revealAfterImport).onChange(async (value) => {
          this.plugin.settings.revealAfterImport = value;
          await this.plugin.saveSettings();
        });
      });

    new Setting(containerEl)
      .setName(i18n.t("settings.overwrite.name"))
      .setDesc(i18n.t("settings.overwrite.desc"))
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.overwrite).onChange(async (value) => {
          this.plugin.settings.overwrite = value;
          await this.plugin.saveSettings();
        });
      });
  }

  renderEnvironmentSection(containerEl) {
    containerEl.createEl("h3", { text: i18n.t("settings.env.title") });
    containerEl.createEl("p", {
      cls: "justmarkitdown-setting-note",
      text: i18n.t("settings.env.note"),
    });

    this.envStatusEl = containerEl.createDiv({
      cls: "justmarkitdown-env-status",
      text: i18n.t("settings.env.notChecked"),
    });

    new Setting(containerEl)
      .setName(i18n.t("settings.env.check.name"))
      .setDesc(i18n.t("settings.env.check.desc"))
      .addButton((button) => {
        button.setButtonText(i18n.t("settings.env.check.button")).onClick(async () => {
          await this.checkEnvironment();
        });
      });

    new Setting(containerEl)
      .setName(i18n.t("settings.env.install.name"))
      .setDesc(i18n.t("settings.env.install.desc"))
      .addButton((button) => {
        button
          .setButtonText(i18n.t("settings.env.install.button"))
          .setCta()
          .onClick(async () => {
            await this.installPythonEnvironment(button.buttonEl);
          });
      });

    new Setting(containerEl)
      .setName(i18n.t("settings.env.useVenv.name"))
      .setDesc(i18n.t("settings.env.useVenv.desc"))
      .addButton((button) => {
        button.setButtonText(i18n.t("settings.env.useVenv.button")).onClick(async () => {
          this.plugin.settings.pythonPath = this.plugin.getDefaultPythonPath();
          await this.plugin.saveSettings();
          new Notice(i18n.t("notice.venvSet"));
          this.display();
        });
      });

    new Setting(containerEl)
      .setName(i18n.t("settings.env.ffmpeg.name"))
      .setDesc(i18n.t("settings.env.ffmpeg.desc"))
      .addButton((button) => {
        button.setButtonText(i18n.t("settings.env.ffmpeg.button")).onClick(async () => {
          await this.installFfmpeg(button.buttonEl);
        });
      });
  }

  setEnvironmentStatus(lines, isError = false) {
    if (!this.envStatusEl) {
      return;
    }
    this.envStatusEl.empty();
    this.envStatusEl.classList.toggle("is-error", isError);
    for (const line of lines) {
      this.envStatusEl.createDiv({ text: line });
    }
  }

  async checkEnvironment() {
    const pythonPath = this.plugin.getPythonPath();
    const lines = [
      i18n.t("settings.env.platform", { platform: process.platform }),
      i18n.t("settings.env.vault", { path: this.plugin.getVaultPath() }),
      i18n.t("settings.env.python", { path: pythonPath }),
    ];

    lines.push(
      fs.existsSync(pythonPath)
        ? i18n.t("settings.env.pythonFound")
        : i18n.t("settings.env.pythonMissing"),
    );
    lines.push(
      fs.existsSync(this.plugin.getBridgeScript())
        ? i18n.t("settings.env.bridgeFound")
        : i18n.t("settings.env.bridgeMissing"),
    );
    if (IS_MAC) {
      lines.push(
        fs.existsSync(this.plugin.getOcrScript())
          ? i18n.t("settings.env.ocrScriptFound")
          : i18n.t("settings.env.ocrScriptMissing"),
      );
      lines.push(
        fs.existsSync("/usr/bin/swift")
          ? i18n.t("settings.env.swiftFound")
          : i18n.t("settings.env.swiftMissing"),
      );
    } else {
      lines.push(i18n.t("settings.env.ocrTesseractNote"));
    }

    if (fs.existsSync(pythonPath)) {
      try {
        await execFilePromise(
          pythonPath,
          ["-c", "from markitdown import MarkItDown; print('ok')"],
          { timeout: 30000 },
        );
        lines.push(i18n.t("settings.env.markitdownInstalled"));
      } catch (error) {
        lines.push(i18n.t("settings.env.markitdownNotReady", { error: error.message }));
      }
      try {
        await execFilePromise(
          pythonPath,
          ["-c", "from youtube_transcript_api import YouTubeTranscriptApi; print('ok')"],
          { timeout: 30000 },
        );
        lines.push(i18n.t("settings.env.youtubeTranscriptInstalled"));
      } catch (error) {
        lines.push(i18n.t("settings.env.youtubeTranscriptMissing"));
      }
      try {
        await execFilePromise(pythonPath, ["-c", "import yt_dlp; print('ok')"], { timeout: 30000 });
        lines.push(i18n.t("settings.env.ytdlpInstalled"));
      } catch (error) {
        lines.push(i18n.t("settings.env.ytdlpMissing"));
      }
      if (!IS_MAC) {
        try {
          await execFilePromise(pythonPath, ["-c", "import pytesseract; print('ok')"], {
            timeout: 30000,
          });
          lines.push(i18n.t("settings.env.pytesseractInstalled"));
        } catch (error) {
          lines.push(i18n.t("settings.env.pytesseractMissing"));
        }
      }
    }

    try {
      await execFilePromise("ffmpeg", ["-version"], { timeout: 10000 });
      lines.push(i18n.t("settings.env.ffmpegSystemInstalled"));
    } catch (error) {
      if (fs.existsSync(pythonPath)) {
        try {
          const result = await execFilePromise(
            pythonPath,
            ["-c", "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"],
            { timeout: 30000 },
          );
          lines.push(i18n.t("settings.env.ffmpegInPython", { path: result.stdout }));
        } catch (ffmpegError) {
          lines.push(i18n.t("settings.env.ffmpegMissing"));
        }
      } else {
        lines.push(i18n.t("settings.env.ffmpegMissing"));
      }
    }

    this.setEnvironmentStatus(lines);
    new Notice(i18n.t("notice.envCheckComplete"));
  }

  async installPythonEnvironment(buttonEl) {
    const previousText = buttonEl.textContent;
    buttonEl.disabled = true;
    buttonEl.textContent = i18n.t("settings.env.installing");

    const vaultPath = this.plugin.getVaultPath();
    const venvDir = path.join(vaultPath, ".venv");
    const venvPython = this.plugin.getDefaultPythonPath();

    this.setEnvironmentStatus([
      i18n.t("settings.env.creatingVenv"),
      i18n.t("settings.env.location", { path: venvDir }),
    ]);
    try {
      const installerPython = await this.findPythonForVenv();
      if (!installerPython) {
        throw new Error(i18n.t("settings.env.pythonNotFound"));
      }
      this.setEnvironmentStatus([
        i18n.t("settings.env.creatingVenv"),
        i18n.t("settings.env.usingPython", { label: installerPython.label }),
        i18n.t("settings.env.location", { path: venvDir }),
      ]);
      await execFilePromise(
        installerPython.command,
        [...installerPython.args, "-m", "venv", venvDir],
        { timeout: 120000 },
      );
      this.setEnvironmentStatus([i18n.t("settings.env.upgradingPip")]);
      await execFilePromise(venvPython, ["-m", "pip", "install", "--upgrade", "pip"], {
        timeout: 180000,
      });
      this.setEnvironmentStatus([
        i18n.t("settings.env.installingMarkitdown"),
        i18n.t("settings.env.installingMarkitdownNote"),
      ]);
      await execFilePromise(venvPython, ["-m", "pip", "install", "markitdown[all]"], {
        timeout: 20 * 60 * 1000,
        maxBuffer: 1024 * 1024 * 20,
      });
      this.setEnvironmentStatus([i18n.t("settings.env.installingFfmpegTool")]);
      await execFilePromise(venvPython, ["-m", "pip", "install", "imageio-ffmpeg"], {
        timeout: 10 * 60 * 1000,
        maxBuffer: 1024 * 1024 * 20,
      });
      this.setEnvironmentStatus([i18n.t("settings.env.installingYoutubeTools")]);
      await execFilePromise(
        venvPython,
        ["-m", "pip", "install", "youtube-transcript-api", "yt-dlp"],
        {
          timeout: 10 * 60 * 1000,
          maxBuffer: 1024 * 1024 * 20,
        },
      );
      if (!IS_MAC) {
        this.setEnvironmentStatus([i18n.t("settings.env.installingPytesseract")]);
        await execFilePromise(venvPython, ["-m", "pip", "install", "pytesseract"], {
          timeout: 10 * 60 * 1000,
          maxBuffer: 1024 * 1024 * 20,
        });
      }

      this.plugin.settings.pythonPath = venvPython;
      await this.plugin.saveSettings();
      this.setEnvironmentStatus([
        i18n.t("settings.env.installComplete"),
        i18n.t("settings.env.python", { path: venvPython }),
        i18n.t("settings.env.markitdownInstalled"),
        i18n.t("settings.env.youtubeTranscriptInstalled"),
        i18n.t("settings.env.ytdlpInstalled"),
        i18n.t("settings.env.ffmpegInPython", { path: venvPython }),
        IS_MAC ? i18n.t("settings.env.ocrMac") : i18n.t("settings.env.ocrTesseract"),
      ]);
      new Notice(i18n.t("notice.envInstallComplete"));
      this.display();
    } catch (error) {
      this.setEnvironmentStatus([i18n.t("settings.env.installFailed"), error.message], true);
      new Notice(i18n.t("notice.envInstallFailed"));
    } finally {
      buttonEl.disabled = false;
      buttonEl.textContent = previousText;
    }
  }

  async findPythonForVenv() {
    const configured = this.plugin.settings.pythonPath
      ? [
          {
            command: this.plugin.settings.pythonPath,
            args: [],
            label: this.plugin.settings.pythonPath,
          },
        ]
      : [];
    const windowsCandidates = [
      { command: "py", args: ["-3.13"], label: "py -3.13" },
      { command: "py", args: ["-3.12"], label: "py -3.12" },
      { command: "py", args: ["-3.11"], label: "py -3.11" },
      { command: "py", args: ["-3.10"], label: "py -3.10" },
      { command: "python", args: [], label: "python" },
      { command: "python3", args: [], label: "python3" },
    ];
    const unixCandidates = [
      this.plugin.settings.pythonPath
        ? {
            command: this.plugin.settings.pythonPath,
            args: [],
            label: this.plugin.settings.pythonPath,
          }
        : null,
      { command: "/opt/homebrew/bin/python3.13", args: [], label: "/opt/homebrew/bin/python3.13" },
      { command: "/opt/homebrew/bin/python3.12", args: [], label: "/opt/homebrew/bin/python3.12" },
      { command: "/opt/homebrew/bin/python3.11", args: [], label: "/opt/homebrew/bin/python3.11" },
      { command: "/opt/homebrew/bin/python3.10", args: [], label: "/opt/homebrew/bin/python3.10" },
      { command: "/usr/local/bin/python3.13", args: [], label: "/usr/local/bin/python3.13" },
      { command: "/usr/local/bin/python3.12", args: [], label: "/usr/local/bin/python3.12" },
      { command: "/usr/local/bin/python3.11", args: [], label: "/usr/local/bin/python3.11" },
      { command: "/usr/local/bin/python3.10", args: [], label: "/usr/local/bin/python3.10" },
      { command: "python3.13", args: [], label: "python3.13" },
      { command: "python3.12", args: [], label: "python3.12" },
      { command: "python3.11", args: [], label: "python3.11" },
      { command: "python3.10", args: [], label: "python3.10" },
      { command: "python3", args: [], label: "python3" },
      { command: "/usr/bin/python3", args: [], label: "/usr/bin/python3" },
    ].filter(Boolean);
    const candidates = [...configured, ...(IS_WINDOWS ? windowsCandidates : unixCandidates)];

    for (const candidate of candidates) {
      try {
        const result = await execFilePromise(
          candidate.command,
          [
            ...candidate.args,
            "-c",
            "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')",
          ],
          { timeout: 10000 },
        );
        const [major, minor] = result.stdout.split(".").map((part) => Number(part));
        if (major > 3 || (major === 3 && minor >= 10)) {
          return candidate;
        }
      } catch (error) {
        continue;
      }
    }
    return null;
  }

  async installFfmpeg(buttonEl) {
    const previousText = buttonEl.textContent;
    buttonEl.disabled = true;
    buttonEl.textContent = i18n.t("settings.env.installing");

    const pythonPath = this.plugin.getPythonPath();
    try {
      if (!fs.existsSync(pythonPath)) {
        throw new Error(i18n.t("settings.env.pythonMissingForFfmpeg"));
      }
      this.setEnvironmentStatus([
        i18n.t("settings.env.installingFfmpeg"),
        i18n.t("settings.env.installingFfmpegNote"),
      ]);
      await execFilePromise(pythonPath, ["-m", "pip", "install", "--upgrade", "imageio-ffmpeg"], {
        timeout: 10 * 60 * 1000,
        maxBuffer: 1024 * 1024 * 20,
      });
      const result = await execFilePromise(
        pythonPath,
        ["-c", "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())"],
        { timeout: 30000 },
      );
      this.setEnvironmentStatus([
        i18n.t("settings.env.ffmpegInstallComplete"),
        i18n.t("settings.env.location", { path: result.stdout }),
      ]);
      new Notice(i18n.t("notice.ffmpegInstallComplete"));
    } catch (error) {
      this.setEnvironmentStatus([i18n.t("settings.env.ffmpegInstallFailed"), error.message], true);
      new Notice(i18n.t("notice.ffmpegInstallFailed"));
    } finally {
      buttonEl.disabled = false;
      buttonEl.textContent = previousText;
    }
  }
}

function execFilePromise(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    execFile(command, args, options, (error, stdout, stderr) => {
      const cleanStdout = String(stdout || "").trim();
      const cleanStderr = String(stderr || "").trim();
      if (error) {
        reject(new Error(cleanStderr || error.message));
        return;
      }
      resolve({ stdout: cleanStdout, stderr: cleanStderr });
    });
  });
}

function runBridge(plugin, sources, dest, options) {
  return new Promise((resolve, reject) => {
    const pythonPath = plugin.getPythonPath();
    const bridgeScript = plugin.getBridgeScript();
    const resultFile = path.join(
      os.tmpdir(),
      `justmarkitdown-result-${Date.now()}-${Math.random().toString(16).slice(2)}.json`,
    );

    if (!pythonPath || !fs.existsSync(pythonPath)) {
      reject(new Error(i18n.t("error.pythonMissing", { path: pythonPath })));
      return;
    }
    if (!fs.existsSync(bridgeScript)) {
      reject(new Error(i18n.t("error.bridgeMissing", { path: bridgeScript })));
      return;
    }

    const args = [
      bridgeScript,
      "--vault",
      plugin.getVaultPath(),
      "--dest",
      dest,
      "--locale",
      i18n.getLocale(),
      "--tools-dir",
      plugin.getToolsDir(),
      "--ocr-script",
      plugin.getOcrScript(),
      "--result-file",
      resultFile,
    ];
    if (options.recursive) args.push("--recursive");
    if (options.overwrite) args.push("--overwrite");
    for (const source of sources) {
      args.push("--source", source);
    }

    execFile(
      pythonPath,
      args,
      { timeout: 30 * 60 * 1000, maxBuffer: 1024 * 1024 * 20 },
      (error, stdout, stderr) => {
        const cleanStdout = stdout.trim();
        const cleanStderr = stderr.trim();
        let payload = null;
        try {
          if (fs.existsSync(resultFile)) {
            payload = JSON.parse(fs.readFileSync(resultFile, "utf8"));
          } else {
            payload = cleanStdout ? JSON.parse(cleanStdout) : null;
          }
        } catch (parseError) {
          reject(new Error(cleanStderr || cleanStdout || parseError.message));
          return;
        } finally {
          try {
            fs.unlinkSync(resultFile);
          } catch (unlinkError) {
            // Ignore cleanup failures for temp result files.
          }
        }

        if (payload?.results) {
          resolve(payload.results);
          return;
        }
        if (error) {
          reject(new Error(cleanStderr || error.message));
          return;
        }
        resolve([]);
      },
    );
  });
}

function getSourcesFromDataTransfer(dataTransfer) {
  if (!dataTransfer) {
    return [];
  }
  const sources = [];
  for (const item of Array.from(dataTransfer.items || [])) {
    if (item.kind === "file") {
      const file = item.getAsFile?.();
      const filePath = getPathForFile(file);
      if (filePath) {
        sources.push(filePath);
      }
    }
  }
  for (const file of Array.from(dataTransfer.files || [])) {
    const filePath = getPathForFile(file);
    if (filePath) {
      sources.push(filePath);
    }
  }
  const text = dataTransfer.getData("text/uri-list") || dataTransfer.getData("text/plain") || "";
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (isUrl(trimmed)) {
      sources.push(trimmed);
    } else if (/^file:\/\//i.test(trimmed)) {
      sources.push(decodeFileUrl(trimmed));
    }
  }
  return Array.from(new Set(sources));
}

function getPathForFile(file) {
  if (!file) {
    return "";
  }
  if (file.path) {
    return file.path;
  }
  try {
    return electronWebUtils?.getPathForFile?.(file) || "";
  } catch (error) {
    return "";
  }
}

function decodeFileUrl(value) {
  try {
    return fileURLToPath(value);
  } catch (error) {
    return value;
  }
}

function isSupportedSource(source) {
  if (isUrl(source)) {
    return true;
  }
  try {
    const stat = fs.statSync(source);
    if (stat.isDirectory()) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return SUPPORTED_EXTENSIONS.has(path.extname(source).toLowerCase());
}

function normalizeDest(value) {
  const cleaned = String(value || DEFAULT_SETTINGS.defaultDest)
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .trim();
  return cleaned || DEFAULT_SETTINGS.defaultDest;
}

function isSafeVaultPath(value) {
  if (path.isAbsolute(value)) {
    return false;
  }
  return !value.split("/").some((part) => part === "..");
}

function isUrl(value) {
  return /^https?:\/\/\S+/i.test(String(value || "").trim());
}

function outputToVaultRelativePath(plugin, outputPath) {
  const vaultPath = plugin.getVaultPath();
  if (!vaultPath || !outputPath) {
    return "";
  }
  return path.relative(vaultPath, outputPath).split(path.sep).join("/");
}

function outputToWikiLink(plugin, outputPath) {
  const relativePath = outputToVaultRelativePath(plugin, outputPath);
  if (!relativePath) {
    return "";
  }
  const withoutExt = relativePath.replace(/\.md$/i, "");
  const basename = path.basename(withoutExt);
  return `[[${withoutExt}|${basename}]]`;
}
