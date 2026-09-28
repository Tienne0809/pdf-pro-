import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { fileToUint8Array } from "../utils";

export type WatermarkType = "text" | "image";
export type WatermarkPosition = "center" | "tile";

export interface WatermarkOptions {
  type: WatermarkType;
  text?: string;
  imageFile?: File;
  opacity: number; // 0.1 to 1.0
  rotation: number; // e.g. 45 degrees
  fontSize?: number; // e.g. 48
  color?: string; // hex color e.g. "#94A3B8"
  position: WatermarkPosition;
}

function hexToRgb(hex: string) {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  return rgb(r || 0.5, g || 0.5, b || 0.5);
}

export async function addWatermarkToPdf(
  file: File,
  options: WatermarkOptions,
  onProgress?: (percent: number, message: string) => void
): Promise<Blob> {
  onProgress?.(15, "Đang nạp file PDF gốc...");
  const fileBytes = await fileToUint8Array(file);
  const pdfDoc = await PDFDocument.load(fileBytes);
  const pages = pdfDoc.getPages();

  let embeddedImage = null;
  if (options.type === "image" && options.imageFile) {
    const imgBytes = await fileToUint8Array(options.imageFile);
    if (options.imageFile.type.includes("png")) {
      embeddedImage = await pdfDoc.embedPng(imgBytes);
    } else {
      embeddedImage = await pdfDoc.embedJpg(imgBytes);
    }
  }

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontColor = hexToRgb(options.color || "#888888");
  const fontSize = options.fontSize || 42;
  const watermarkText = options.text || "BẢN QUYỀN PDF PRO";

  onProgress?.(45, "Đang chèn watermark lên các trang...");

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();

    if (options.type === "text") {
      const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      if (options.position === "center") {
        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: (height - textHeight) / 2,
          size: fontSize,
          font,
          color: fontColor,
          opacity: options.opacity,
          rotate: degrees(options.rotation),
        });
      } else {
        // Tile mode across 3x3 grid
        const stepX = width / 2;
        const stepY = height / 3;
        for (let x = stepX / 4; x < width; x += stepX) {
          for (let y = stepY / 4; y < height; y += stepY) {
            page.drawText(watermarkText, {
              x,
              y,
              size: fontSize * 0.7,
              font,
              color: fontColor,
              opacity: options.opacity,
              rotate: degrees(options.rotation),
            });
          }
        }
      }
    } else if (embeddedImage) {
      const imgScale = Math.min((width * 0.4) / embeddedImage.width, (height * 0.4) / embeddedImage.height);
      const imgW = embeddedImage.width * imgScale;
      const imgH = embeddedImage.height * imgScale;

      if (options.position === "center") {
        page.drawImage(embeddedImage, {
          x: (width - imgW) / 2,
          y: (height - imgH) / 2,
          width: imgW,
          height: imgH,
          opacity: options.opacity,
          rotate: degrees(options.rotation),
        });
      } else {
        const stepX = width / 2;
        const stepY = height / 3;
        for (let x = 50; x < width; x += stepX) {
          for (let y = 50; y < height; y += stepY) {
            page.drawImage(embeddedImage, {
              x,
              y,
              width: imgW * 0.6,
              height: imgH * 0.6,
              opacity: options.opacity,
              rotate: degrees(options.rotation),
            });
          }
        }
      }
    }
  }

  onProgress?.(85, "Đang đóng gói file PDF...");
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, "Hoàn tất thêm Watermark!");

  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
