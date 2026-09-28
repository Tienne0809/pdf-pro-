import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format byte size into Vietnamese human-readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Check if a file has PDF signature (%PDF)
 */
export async function isPdfFile(file: File): Promise<boolean> {
  try {
    const slice = file.slice(0, 5);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    // %PDF- magic bytes: 0x25, 0x50, 0x44, 0x46
    return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  } catch {
    return false;
  }
}

/**
 * Parse page ranges string like "1-3, 5, 8-10" into 0-based page index array
 * @param input Page range expression string
 * @param totalPages Total number of pages in the PDF
 * @returns Array of unique 0-based page indices
 */
export function parsePageRange(input: string, totalPages: number): number[] {
  const cleanInput = input.trim();
  if (!cleanInput) {
    throw new Error("Vui lòng nhập khoảng trang cần xử lý (ví dụ: 1-3, 5, 8-10)");
  }

  const parts = cleanInput.split(",").map((p) => p.trim()).filter(Boolean);
  const pageIndices = new Set<number>();

  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (isNaN(start) || isNaN(end)) {
        throw new Error(`Khoảng trang "${part}" không hợp lệ. Vui lòng kiểm tra lại.`);
      }

      if (start < 1 || end < 1) {
        throw new Error(`Số trang phải lớn hơn hoặc bằng 1.`);
      }

      if (start > end) {
        throw new Error(`Khoảng trang "${part}" có trang bắt đầu (${start}) lớn hơn trang kết thúc (${end}).`);
      }

      if (end > totalPages) {
        throw new Error(`Trang ${end} vượt quá tổng số trang của tài liệu (${totalPages} trang).`);
      }

      for (let i = start; i <= end; i++) {
        pageIndices.add(i - 1);
      }
    } else {
      const page = parseInt(part, 10);
      if (isNaN(page)) {
        throw new Error(`Số trang "${part}" không hợp lệ.`);
      }

      if (page < 1) {
        throw new Error(`Số trang phải bắt đầu từ 1.`);
      }

      if (page > totalPages) {
        throw new Error(`Trang ${page} vượt quá tổng số trang (${totalPages} trang).`);
      }

      pageIndices.add(page - 1);
    }
  }

  if (pageIndices.size === 0) {
    throw new Error("Chưa có trang nào được chọn hợp lệ.");
  }

  return Array.from(pageIndices).sort((a, b) => a - b);
}

/**
 * Generate output file name according to specification: <ten-goc>-<hau-to>.<ext>
 */
export function generateResultFileName(
  originalFileName: string,
  suffix: string,
  extension: "pdf" | "zip" | "jpg" | "png" | "txt" | "pptx" = "pdf"
): string {
  const lastDot = originalFileName.lastIndexOf(".");
  const baseName = lastDot > 0 ? originalFileName.substring(0, lastDot) : originalFileName;
  return `${baseName}-${suffix}.${extension}`;
}

/**
 * Trigger download of a Blob in the browser
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

/**
 * Read File or Blob as Uint8Array
 */
export async function fileToUint8Array(file: File | Blob): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}
