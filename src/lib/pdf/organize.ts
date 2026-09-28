import { PDFDocument } from "pdf-lib";
import { fileToUint8Array } from "../utils";

export async function organizePdfPages(
  file: File,
  orderedPageIndices: number[], // 0-indexed new order of pages
  onProgress?: (percent: number, message: string) => void
): Promise<Blob> {
  if (orderedPageIndices.length === 0) {
    throw new Error("Thứ tự trang không hợp lệ hoặc rỗng.");
  }

  onProgress?.(15, "Đang nạp file PDF...");
  const fileBytes = await fileToUint8Array(file);
  const srcDoc = await PDFDocument.load(fileBytes);

  onProgress?.(50, "Đang sắp xếp lại trang theo thứ tự mới...");
  const newDoc = await PDFDocument.create();
  const copiedPages = await newDoc.copyPages(srcDoc, orderedPageIndices);

  for (const page of copiedPages) {
    newDoc.addPage(page);
  }

  onProgress?.(85, "Đang đóng gói file PDF...");
  const pdfBytes = await newDoc.save();
  onProgress?.(100, "Hoàn tất sắp xếp trang PDF!");

  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
