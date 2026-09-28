import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { fileToUint8Array, parsePageRange, generateResultFileName } from "../utils";

export type SplitMode = "ranges" | "every_n" | "single_pages";

export interface SplitOptions {
  mode: SplitMode;
  ranges?: string; // e.g., "1-3, 5, 8-10"
  everyN?: number; // e.g., 2
}

export interface SplitResult {
  isZip: boolean;
  blob: Blob;
  filename: string;
  filesCount: number;
}

export async function splitPdf(
  file: File,
  options: SplitOptions,
  onProgress?: (percent: number, message: string) => void
): Promise<SplitResult> {
  onProgress?.(10, "Đang đọc nội dung file PDF...");
  const fileBytes = await fileToUint8Array(file);
  const srcDoc = await PDFDocument.load(fileBytes);
  const totalPages = srcDoc.getPageCount();

  if (totalPages === 0) {
    throw new Error("Tài liệu PDF không có trang nào.");
  }

  // Case 1: Custom ranges
  if (options.mode === "ranges") {
    if (!options.ranges) {
      throw new Error("Vui lòng nhập khoảng trang cần tách (ví dụ: 1-3, 5, 8-10).");
    }

    const rangeGroups = options.ranges.split(";").map((g) => g.trim()).filter(Boolean);
    const groupsToProcess = rangeGroups.length > 0 ? rangeGroups : [options.ranges];

    if (groupsToProcess.length === 1 && !options.ranges.includes(";")) {
      // Single output PDF from specified ranges
      onProgress?.(40, "Đang trích xuất các trang đã chọn...");
      const pageIndices = parsePageRange(options.ranges, totalPages);

      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      for (const page of copiedPages) {
        newDoc.addPage(page);
      }

      onProgress?.(90, "Đang đóng gói file...");
      const pdfBytes = await newDoc.save();
      const filename = generateResultFileName(file.name, "da-tach", "pdf");

      return {
        isZip: false,
        blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        filename,
        filesCount: 1,
      };
    }

    // Multiple range groups -> ZIP
    const zip = new JSZip();
    for (let i = 0; i < groupsToProcess.length; i++) {
      const rangeStr = groupsToProcess[i];
      const pageIndices = parsePageRange(rangeStr, totalPages);
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      for (const p of copiedPages) {
        newDoc.addPage(p);
      }
      const pdfBytes = await newDoc.save();
      zip.file(`tap-${i + 1}-trang-${rangeStr.replace(/[^0-9-]/g, "_")}.pdf`, pdfBytes);
      onProgress?.(
        Math.round(20 + (i / groupsToProcess.length) * 70),
        `Đang tạo file phần ${i + 1}/${groupsToProcess.length}...`
      );
    }

    onProgress?.(95, "Đang tạo file nén ZIP...");
    const zipBlob = await zip.generateAsync({ type: "blob" });
    return {
      isZip: true,
      blob: zipBlob,
      filename: generateResultFileName(file.name, "cac-phan-da-tach", "zip"),
      filesCount: groupsToProcess.length,
    };
  }

  // Case 2: Every N pages
  if (options.mode === "every_n") {
    const n = Math.max(1, options.everyN || 1);
    const totalFiles = Math.ceil(totalPages / n);

    if (totalFiles === 1) {
      // It's the same file
      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, srcDoc.getPageIndices());
      for (const p of copiedPages) newDoc.addPage(p);
      const pdfBytes = await newDoc.save();
      return {
        isZip: false,
        blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }),
        filename: generateResultFileName(file.name, "tach", "pdf"),
        filesCount: 1,
      };
    }

    const zip = new JSZip();
    for (let f = 0; f < totalFiles; f++) {
      const start = f * n;
      const end = Math.min(start + n, totalPages);
      const indices: number[] = [];
      for (let p = start; p < end; p++) indices.push(p);

      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, indices);
      for (const p of copiedPages) newDoc.addPage(p);

      const pdfBytes = await newDoc.save();
      zip.file(`phan-${f + 1}-trang-${start + 1}-${end}.pdf`, pdfBytes);
      onProgress?.(
        Math.round(20 + (f / totalFiles) * 70),
        `Đang tạo phần ${f + 1}/${totalFiles}...`
      );
    }

    onProgress?.(95, "Đang nén các file vào ZIP...");
    const zipBlob = await zip.generateAsync({ type: "blob" });
    return {
      isZip: true,
      blob: zipBlob,
      filename: generateResultFileName(file.name, "moi-" + n + "-trang", "zip"),
      filesCount: totalFiles,
    };
  }

  // Case 3: Single pages (every page is an individual PDF)
  const zip = new JSZip();
  for (let p = 0; p < totalPages; p++) {
    const newDoc = await PDFDocument.create();
    const [copied] = await newDoc.copyPages(srcDoc, [p]);
    newDoc.addPage(copied);
    const pdfBytes = await newDoc.save();
    zip.file(`trang-${p + 1}.pdf`, pdfBytes);
    onProgress?.(
      Math.round(20 + (p / totalPages) * 70),
      `Đang tách trang ${p + 1}/${totalPages}...`
    );
  }

  onProgress?.(95, "Đang nén các trang vào file ZIP...");
  const zipBlob = await zip.generateAsync({ type: "blob" });
  return {
    isZip: true,
    blob: zipBlob,
    filename: generateResultFileName(file.name, "tung-trang", "zip"),
    filesCount: totalPages,
  };
}
