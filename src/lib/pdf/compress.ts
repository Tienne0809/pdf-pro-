import { PDFDocument } from "pdf-lib";
import { loadPdfDocument } from "./client";

export type CompressionLevel = "light" | "medium" | "strong";

export interface CompressResult {
  blob: Blob;
  originalSize: number;
  newSize: number;
  savedPercentage: number;
  isFallbackOriginal: boolean;
}

const COMPRESSION_PROFILES = {
  light: { dpi: 150, quality: 0.8 },
  medium: { dpi: 110, quality: 0.6 },
  strong: { dpi: 72, quality: 0.4 },
};

export async function compressPdf(
  file: File,
  level: CompressionLevel,
  onProgress?: (percent: number, message: string) => void
): Promise<CompressResult> {
  const originalSize = file.size;
  onProgress?.(10, "Đang nạp file PDF...");

  const pdfDoc = await loadPdfDocument(file);
  const totalPages = pdfDoc.numPages;

  const profile = COMPRESSION_PROFILES[level];
  const scale = profile.dpi / 72;

  const newPdfDoc = await PDFDocument.create();

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    onProgress?.(
      Math.round(15 + (pageNum / totalPages) * 70),
      `Đang tối ưu & nén trang ${pageNum}/${totalPages}...`
    );

    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Không thể khởi tạo Canvas 2D context");

    // White background for crisp rendering
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    const imgBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Lỗi nén ảnh"))),
        "image/jpeg",
        profile.quality
      );
    });

    const imgBytes = await imgBlob.arrayBuffer();
    const embeddedImg = await newPdfDoc.embedJpg(imgBytes);

    // Keep original PDF dimensions in points
    const origVp = page.getViewport({ scale: 1 });
    const newPage = newPdfDoc.addPage([origVp.width, origVp.height]);

    newPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: origVp.width,
      height: origVp.height,
    });

    canvas.width = 0;
    canvas.height = 0;
  }

  onProgress?.(90, "Đang kiểm tra dung lượng kết quả...");
  const compressedBytes = await newPdfDoc.save();
  const newSize = compressedBytes.byteLength;

  // Requirement: If compressed is larger than original, return original file with note
  if (newSize >= originalSize) {
    onProgress?.(100, "File gốc đã ở trạng thái tối ưu nhất.");
    const fileArrBuf = await file.arrayBuffer();
    return {
      blob: new Blob([fileArrBuf], { type: "application/pdf" }),
      originalSize,
      newSize: originalSize,
      savedPercentage: 0,
      isFallbackOriginal: true,
    };
  }

  const savedPercentage = Math.round(((originalSize - newSize) / originalSize) * 100);
  onProgress?.(100, `Nén thành công! Giảm ${savedPercentage}% dung lượng.`);

  return {
    blob: new Blob([compressedBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
    originalSize,
    newSize,
    savedPercentage,
    isFallbackOriginal: false,
  };
}
