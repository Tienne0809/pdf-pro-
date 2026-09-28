import { PDFDocument, degrees } from "pdf-lib";
import { fileToUint8Array } from "../utils";

export interface PageRotationMap {
  [pageIndex: number]: number; // pageIndex (0-based) -> angle to add (e.g. 90, 180, 270)
}

export async function rotatePdfPages(
  file: File,
  rotations: PageRotationMap | number, // if number, applied to all pages
  onProgress?: (percent: number, message: string) => void
): Promise<Blob> {
  onProgress?.(15, "Đang nạp file PDF...");
  const fileBytes = await fileToUint8Array(file);
  const pdfDoc = await PDFDocument.load(fileBytes);
  const pages = pdfDoc.getPages();

  onProgress?.(45, "Đang áp dụng góc xoay trang...");
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    let angleToAdd = 0;
    if (typeof rotations === "number") {
      angleToAdd = rotations;
    } else if (rotations[i] !== undefined) {
      angleToAdd = rotations[i];
    }

    if (angleToAdd !== 0) {
      const currentAngle = page.getRotation().angle;
      const newAngle = (currentAngle + angleToAdd) % 360;
      page.setRotation(degrees(newAngle));
    }
  }

  onProgress?.(85, "Đang lưu tài liệu PDF...");
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, "Hoàn tất xoay PDF!");

  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
