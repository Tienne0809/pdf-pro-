import { PDFDocument } from "pdf-lib";

export type PaperSize = "a4" | "letter" | "fit";
export type PageOrientation = "auto" | "portrait" | "landscape";
export type PageMargin = "none" | "small" | "large";

export interface ImageToPdfOptions {
  pageSize: PaperSize;
  orientation: PageOrientation;
  margin: PageMargin;
}

const PAGE_DIMENSIONS = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612, height: 792 },
};

const MARGIN_SIZES = {
  none: 0,
  small: 20,
  large: 40,
};

/**
 * Convert any image (JPEG, PNG, WebP, GIF) to normalized JPEG/PNG Blob and handle EXIF & resize
 */
async function processImageFile(file: File): Promise<{ blob: Blob; width: number; height: number; isPng: boolean }> {
  let imgBitmap: ImageBitmap | null = null;

  try {
    // Try native createImageBitmap with EXIF orientation correction
    imgBitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
  } catch {
    // Fallback using HTMLImageElement
    imgBitmap = await new Promise<ImageBitmap>((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = async () => {
        URL.revokeObjectURL(url);
        const bmp = await createImageBitmap(img);
        resolve(bmp);
      };
      img.onerror = () => reject(new Error(`Không thể đọc ảnh: ${file.name}`));
      img.src = url;
    });
  }

  let { width, height } = imgBitmap;
  const maxDimension = 3000;

  // Scale down if image is too large to avoid browser memory crash
  if (width > maxDimension || height > maxDimension) {
    const ratio = Math.min(maxDimension / width, maxDimension / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Không thể tạo 2D canvas context.");
  }

  ctx.drawImage(imgBitmap, 0, 0, width, height);

  const isPng = file.type === "image/png";
  const mimeType = isPng ? "image/png" : "image/jpeg";
  const quality = isPng ? undefined : 0.92;

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Lỗi khi chuyển đổi ảnh sang blob"));
      },
      mimeType,
      quality
    );
  });

  return { blob, width, height, isPng };
}

export async function convertImagesToPdf(
  files: File[],
  options: ImageToPdfOptions,
  onProgress?: (percent: number, message: string) => void
): Promise<Blob> {
  if (files.length === 0) {
    throw new Error("Vui lòng chọn ít nhất một ảnh để chuyển sang PDF.");
  }

  onProgress?.(5, "Đang khởi tạo tài liệu PDF...");
  const pdfDoc = await PDFDocument.create();

  const total = files.length;
  const marginVal = MARGIN_SIZES[options.margin];

  for (let i = 0; i < total; i++) {
    const file = files[i];
    onProgress?.(
      Math.round(10 + (i / total) * 80),
      `Đang xử lý ảnh ${i + 1}/${total}: ${file.name}`
    );

    const { blob, width: imgW, height: imgH, isPng } = await processImageFile(file);
    const arrayBuffer = await blob.arrayBuffer();
    const image = isPng ? await pdfDoc.embedPng(arrayBuffer) : await pdfDoc.embedJpg(arrayBuffer);

    let pageWidth = imgW;
    let pageHeight = imgH;

    if (options.pageSize === "fit") {
      pageWidth = imgW + marginVal * 2;
      pageHeight = imgH + marginVal * 2;
    } else {
      const standardSize = PAGE_DIMENSIONS[options.pageSize];
      let isLandscape = false;

      if (options.orientation === "auto") {
        isLandscape = imgW > imgH;
      } else if (options.orientation === "landscape") {
        isLandscape = true;
      }

      pageWidth = isLandscape ? standardSize.height : standardSize.width;
      pageHeight = isLandscape ? standardSize.width : standardSize.height;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Available drawing area
    const availableW = pageWidth - marginVal * 2;
    const availableH = pageHeight - marginVal * 2;

    // Scale image to fit inside available area preserving aspect ratio
    const scaleFactor = Math.min(availableW / imgW, availableH / imgH);
    const drawW = imgW * scaleFactor;
    const drawH = imgH * scaleFactor;

    // Center image
    const posX = marginVal + (availableW - drawW) / 2;
    const posY = marginVal + (availableH - drawH) / 2;

    page.drawImage(image, {
      x: posX,
      y: posY,
      width: drawW,
      height: drawH,
    });
  }

  onProgress?.(95, "Đang hoàn tất xuất file PDF...");
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, "Hoàn tất chuyển ảnh sang PDF!");

  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
