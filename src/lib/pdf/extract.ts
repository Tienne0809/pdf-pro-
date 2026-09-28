import { PDFDocument } from "pdf-lib";
import { fileToUint8Array } from "../utils";

export async function extractPdfPages(
  file: File,
  pagesToExtract: number[], // 0-indexed
  onProgress?: (percent: number, message: string) => void
): Promise<Blob> {
  if (pagesToExtract.length === 0) {
    throw new Error("Vui lòng chọn ít nhất một trang để trích xuất.");
  }

  onProgress?.(15, "Đang nạp file PDF gốc...");
  const fileBytes = await fileToUint8Array(file);
  const srcDoc = await PDFDocument.load(fileBytes);

  onProgress?.(50, `Đang trích xuất ${pagesToExtract.length} trang...`);
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, pagesToExtract);

  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  onProgress?.(85, "Đang hoàn tất tài liệu mới...");
  const pdfBytes = await newDoc.save();
  onProgress?.(100, "Hoàn tất trích xuất trang PDF!");

  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
