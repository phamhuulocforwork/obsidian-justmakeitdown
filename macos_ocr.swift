import AppKit
import Foundation
import Vision

if CommandLine.arguments.count < 2 {
    fputs("Usage: macos_ocr.swift /path/to/image\n", stderr)
    exit(2)
}

let url = URL(fileURLWithPath: CommandLine.arguments[1])
guard let image = NSImage(contentsOf: url),
      let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
    fputs("Could not load image\n", stderr)
    exit(1)
}

let supported = (try? VNRecognizeTextRequest.supportedRecognitionLanguages()) ?? []
var languages: [String] = []
if supported.contains("vi-VN") {
    languages.append("vi-VN")
}
if supported.contains("en-US") {
    languages.append("en-US")
} else if supported.contains("en-GB") {
    languages.append("en-GB")
}
if languages.isEmpty {
    languages = ["en-US"]
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.usesLanguageCorrection = true
request.recognitionLanguages = languages

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
do {
    try handler.perform([request])
    let text = (request.results ?? [])
        .compactMap { $0.topCandidates(1).first?.string }
        .joined(separator: "\n")
    print(text)
} catch {
    fputs(error.localizedDescription + "\n", stderr)
    exit(1)
}
