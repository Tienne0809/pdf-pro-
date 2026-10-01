import { PDFDocument } from "pdf-lib";
import { fileToUint8Array } from "../utils";

export interface SignaturePlacement {
  pageIndex: number; // 0-indexed
  xPercent: number; // 0 to 1 (from left)
  yPercent: number; // 0 to 1 (from top)
  widthPercent: number; // 0 to 1
  heightPercent: number; // 0 to 1
  signatureDataUrl: string; // PNG data URL
}

function dataUriToUint8Array(dataUri: string): Uint8Array {
  const base64 = dataUri.split(",")[1] || dataUri;
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function signPdf(
  file: File,
  placements: SignaturePlacement[],
  onProgress?: (percent: number, message: string) => void
): Promise<Blob> {
  onProgress?.(15, "Đang nạp file PDF gốc...");
  const fileBytes = await fileToUint8Array(file);
  const pdfDoc = await PDFDocument.load(fileBytes);
  const totalPages = pdfDoc.getPageCount();

  onProgress?.(40, "Đang xử lý chữ ký điện tử...");

  // Cache embedded PNGs by signatureDataUrl to prevent redundant embedding
  const embeddedMap = new Map<string, any>();

  for (let i = 0; i < placements.length; i++) {
    const p = placements[i];
    if (p.pageIndex < 0 || p.pageIndex >= totalPages) continue;

    let embeddedPng = embeddedMap.get(p.signatureDataUrl);
    if (!embeddedPng) {
      const pngBytes = dataUriToUint8Array(p.signatureDataUrl);
      embeddedPng = await pdfDoc.embedPng(pngBytes);
      embeddedMap.set(p.signatureDataUrl, embeddedPng);
    }

    const page = pdfDoc.getPage(p.pageIndex);
    const { width, height } = page.getSize();

    const targetWidth = Math.max(20, p.widthPercent * width);
    const targetHeight = Math.max(10, p.heightPercent * height);
    const targetX = Math.max(0, Math.min(width - targetWidth, p.xPercent * width));
    // In PDF space, coordinate system origin (0,0) is bottom-left
    const targetY = Math.max(0, Math.min(height - targetHeight, height - (p.yPercent * height) - targetHeight));

    page.drawImage(embeddedPng, {
      x: targetX,
      y: targetY,
      width: targetWidth,
      height: targetHeight,
    });
  }

  onProgress?.(85, "Đang xuất file PDF đã ký...");
  const signedBytes = await pdfDoc.save();
  onProgress?.(100, "Hoàn tất ký tên PDF!");

  return new Blob([signedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
