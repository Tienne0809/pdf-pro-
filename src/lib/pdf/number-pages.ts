import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { fileToUint8Array } from "../utils";

export type PageNumberPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type PageNumberFormat = "n" | "n_total" | "page_n" | "page_n_total";

export interface NumberPagesOptions {
  position: PageNumberPosition;
  format: PageNumberFormat;
  startNumber: number; // e.g. 1
  skipFirstPage: boolean;
  fontSize: number; // e.g. 11
  margin: number; // e.g. 30
}

export async function addPageNumbersToPdf(
  file: File,
  options: NumberPagesOptions,
  onProgress?: (percent: number, message: string) => void
): Promise<Blob> {
  onProgress?.(15, "Đang nạp file PDF...");
  const fileBytes = await fileToUint8Array(file);
  const pdfDoc = await PDFDocument.load(fileBytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  onProgress?.(45, "Đang chèn số trang...");

  const startIndex = options.skipFirstPage ? 1 : 0;

  for (let i = startIndex; i < totalPages; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const currentNum = options.startNumber + (i - startIndex);

    let text = "";
    switch (options.format) {
      case "n":
        text = `${currentNum}`;
        break;
      case "n_total":
        text = `${currentNum} / ${totalPages}`;
        break;
      case "page_n":
        text = `Trang ${currentNum}`;
        break;
      case "page_n_total":
        text = `Trang ${currentNum} / ${totalPages}`;
        break;
    }

    const textWidth = font.widthOfTextAtSize(text, options.fontSize);
    const textHeight = font.heightAtSize(options.fontSize);

    let x = 0;
    let y = 0;

    // Horizontal position
    if (options.position.includes("left")) {
      x = options.margin;
    } else if (options.position.includes("center")) {
      x = (width - textWidth) / 2;
    } else if (options.position.includes("right")) {
      x = width - options.margin - textWidth;
    }

    // Vertical position
    if (options.position.startsWith("top")) {
      y = height - options.margin - textHeight;
    } else {
      y = options.margin;
    }

    page.drawText(text, {
      x,
      y,
      size: options.fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
  }

  onProgress?.(85, "Đang xuất file hoàn tất...");
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, "Hoàn tất đánh số trang!");

  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
