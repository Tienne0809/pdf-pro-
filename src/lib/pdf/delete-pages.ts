import { PDFDocument } from "pdf-lib";
import { fileToUint8Array } from "../utils";

export async function deletePdfPages(
  file: File,
  pagesToDelete: number[], // 0-indexed page numbers
  onProgress?: (percent: number, message: string) => void
): Promise<Blob> {
  onProgress?.(15, "Đang mở tài liệu PDF...");
  const fileBytes = await fileToUint8Array(file);
  const srcDoc = await PDFDocument.load(fileBytes);
  const totalPages = srcDoc.getPageCount();

  const toDeleteSet = new Set(pagesToDelete);
  const remainingIndices: number[] = [];

  for (let i = 0; i < totalPages; i++) {
    if (!toDeleteSet.has(i)) {
      remainingIndices.push(i);
    }
  }

  if (remainingIndices.length === 0) {
    throw new Error("Không thể xóa toàn bộ trang. Tài liệu PDF sau khi xóa phải còn lại ít nhất 1 trang.");
  }

  onProgress?.(50, `Đang giữ lại ${remainingIndices.length}/${totalPages} trang...`);
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, remainingIndices);

  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  onProgress?.(85, "Đang hoàn tất tài liệu mới...");
  const pdfBytes = await newDoc.save();
  onProgress?.(100, "Hoàn tất xóa trang PDF!");

  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
