import JSZip from "jszip";
import { loadPdfDocument } from "./client";
import { generateResultFileName } from "../utils";

export type ImageFormat = "jpg" | "png";
export type ImageDpi = 72 | 150 | 300;

export interface PdfToImageOptions {
  format: ImageFormat;
  dpi: ImageDpi;
  pageIndices?: number[]; // 0-based
}

export interface PdfToImageResult {
  isZip: boolean;
  blob: Blob;
  filename: string;
  totalImages: number;
}

export async function convertPdfToImages(
  file: File,
  options: PdfToImageOptions,
  onProgress?: (percent: number, message: string) => void
): Promise<PdfToImageResult> {
  onProgress?.(10, "Đang tải tài liệu PDF...");
  const pdfDoc = await loadPdfDocument(file);
  const totalPages = pdfDoc.numPages;

  const targetPages =
    options.pageIndices && options.pageIndices.length > 0
      ? options.pageIndices.filter((p) => p >= 0 && p < totalPages)
      : Array.from({ length: totalPages }, (_, i) => i);

  if (targetPages.length === 0) {
    throw new Error("Vui lòng chọn ít nhất 1 trang để xuất ảnh.");
  }

  // Base PDF point is 72 DPI
  const scale = options.dpi / 72;
  const mimeType = options.format === "png" ? "image/png" : "image/jpeg";
  const quality = options.format === "png" ? undefined : 0.92;
  const ext = options.format;

  // If single page -> direct single image
  if (targetPages.length === 1) {
    const pageNum = targetPages[0] + 1;
    onProgress?.(50, `Đang render trang ${pageNum}...`);

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Không thể khởi tạo Canvas 2D context.");

    // Fill white background for JPG
    if (options.format === "jpg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Lỗi tạo ảnh"))), mimeType, quality);
    });

    return {
      isZip: false,
      blob,
      filename: generateResultFileName(file.name, `trang-${pageNum}`, ext),
      totalImages: 1,
    };
  }

  // Multiple pages -> ZIP
  const zip = new JSZip();
  const total = targetPages.length;

  for (let i = 0; i < total; i++) {
    const pageIndex = targetPages[i];
    const pageNum = pageIndex + 1;

    onProgress?.(
      Math.round(15 + (i / total) * 75),
      `Đang render trang ${pageNum} (${i + 1}/${total})...`
    );

    const page = await pdfDoc.getPage(pageNum);
    let renderScale = scale;

    // Guard against iOS canvas memory limit
    const initialVp = page.getViewport({ scale: 1 });
    const maxPixelDimension = 4096;
    if (initialVp.width * renderScale > maxPixelDimension || initialVp.height * renderScale > maxPixelDimension) {
      renderScale = Math.min(maxPixelDimension / initialVp.width, maxPixelDimension / initialVp.height);
    }

    const viewport = page.getViewport({ scale: renderScale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Không thể tạo Canvas 2D context");

    if (options.format === "jpg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    await page.render({ canvasContext: ctx, viewport }).promise;

    const imgBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Lỗi tạo ảnh"))), mimeType, quality);
    });

    const paddedNum = String(pageNum).padStart(3, "0");
    zip.file(`trang-${paddedNum}.${ext}`, imgBlob);

    // Clean canvas memory
    canvas.width = 0;
    canvas.height = 0;
  }

  onProgress?.(95, "Đang đóng gói file ZIP...");
  const zipBlob = await zip.generateAsync({ type: "blob" });

  return {
    isZip: true,
    blob: zipBlob,
    filename: generateResultFileName(file.name, `anh-${options.dpi}dpi`, "zip"),
    totalImages: total,
  };
}
