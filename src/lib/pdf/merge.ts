import { PDFDocument } from "pdf-lib";
import { fileToUint8Array } from "../utils";

export interface MergeInputFile {
  id: string;
  file: File;
  selectedPages?: number[]; // 0-indexed, undefined means all pages
}

export async function mergePdfFiles(
  files: MergeInputFile[],
  onProgress?: (percent: number, message: string) => void
): Promise<Blob> {
  if (files.length === 0) {
    throw new Error("Vui lòng chọn ít nhất một file PDF để ghép.");
  }

  onProgress?.(5, "Đang khởi tạo tài liệu PDF mới...");
  const mergedPdf = await PDFDocument.create();

  const totalFiles = files.length;

  for (let i = 0; i < totalFiles; i++) {
    const item = files[i];
    const percent = Math.round(10 + (i / totalFiles) * 80);
    onProgress?.(percent, `Đang xử lý file ${i + 1}/${totalFiles}: ${item.file.name}`);

    const fileBytes = await fileToUint8Array(item.file);

    // If it is an image, embed it as a full page
    if (item.file.type.startsWith("image/")) {
      let image;
      if (item.file.type.includes("png")) {
        image = await mergedPdf.embedPng(fileBytes);
      } else {
        image = await mergedPdf.embedJpg(fileBytes);
      }
      const page = mergedPdf.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      });
      continue;
    }

    // Load PDF
    const srcDoc = await PDFDocument.load(fileBytes, {
      ignoreEncryption: true,
    });

    const pageCount = srcDoc.getPageCount();
    let pagesToCopy: number[] = [];

    if (item.selectedPages && item.selectedPages.length > 0) {
      pagesToCopy = item.selectedPages.filter((p) => p >= 0 && p < pageCount);
    } else {
      pagesToCopy = srcDoc.getPageIndices();
    }

    if (pagesToCopy.length > 0) {
      const copiedPages = await mergedPdf.copyPages(srcDoc, pagesToCopy);
      for (const page of copiedPages) {
        mergedPdf.addPage(page);
      }
    }
  }

  onProgress?.(95, "Đang xuất file PDF hoàn tất...");
  const mergedBytes = await mergedPdf.save();
  onProgress?.(100, "Hoàn tất ghép PDF!");

  return new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
