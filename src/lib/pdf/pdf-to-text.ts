import { loadPdfDocument } from "./client";

export interface PdfTextResult {
  text: string;
  blob: Blob;
  totalPages: number;
  hasText: boolean;
}

export async function extractTextFromPdf(
  file: File,
  onProgress?: (percent: number, message: string) => void
): Promise<PdfTextResult> {
  onProgress?.(10, "Đang nạp file PDF...");
  const pdfDoc = await loadPdfDocument(file);
  const totalPages = pdfDoc.numPages;

  const textLines: string[] = [];

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.(
      Math.round(15 + (i / totalPages) * 75),
      `Đang đọc văn bản trang ${i}/${totalPages}...`
    );

    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();

    const pageStrings = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .filter(Boolean);

    textLines.push(`--- TRANG ${i} ---`);
    if (pageStrings.length > 0) {
      textLines.push(pageStrings.join(" "));
    } else {
      textLines.push("(Trang không chứa văn bản hoặc là file ảnh scan)");
    }
    textLines.push("\n");
  }

  const fullText = textLines.join("\n");
  const hasText = fullText.replace(/--- TRANG \d+ ---|\(Trang không chứa văn bản hoặc là file ảnh scan\)|\s/g, "").length > 0;

  onProgress?.(100, "Hoàn tất trích xuất văn bản!");

  const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });

  return {
    text: fullText,
    blob,
    totalPages,
    hasText,
  };
}
