"use client";

import type { PDFDocumentProxy } from "pdfjs-dist";

let pdfjsLib: typeof import("pdfjs-dist") | null = null;

export async function getPdfJs() {
  if (typeof window === "undefined") {
    throw new Error("PDF.js chỉ hoạt động trên trình duyệt (client-side).");
  }

  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist");
    // Use the self-hosted worker in /public to adhere to privacy rule #8
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
  }

  return pdfjsLib;
}

/**
 * Load a PDF document from File or ArrayBuffer or Uint8Array
 */
export async function loadPdfDocument(
  source: File | ArrayBuffer | Uint8Array,
  password?: string
): Promise<PDFDocumentProxy> {
  const pdfjs = await getPdfJs();
  let data: ArrayBuffer | Uint8Array;

  if (source instanceof File) {
    data = await source.arrayBuffer();
  } else {
    data = source;
  }

  const loadingTask = pdfjs.getDocument({
    data,
    password,
    cMapUrl: "/cmaps/",
    cMapPacked: true,
  });

  return await loadingTask.promise;
}

/**
 * Render a single page to a canvas / Data URL
 * @param doc Loaded PDFDocumentProxy
 * @param pageNumber 1-based page number
 * @param scale Quality scale (default 0.5 for thumbnails, 1.5+ for high res)
 * @param rotation Additional rotation in degrees (0, 90, 180, 270)
 */
export async function renderPageThumbnail(
  doc: PDFDocumentProxy,
  pageNumber: number,
  scale = 0.5,
  rotation = 0
): Promise<string> {
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({
    scale,
    rotation: (page.rotate + rotation) % 360,
  });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Không thể khởi tạo Canvas 2D context.");
  }

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  const dataUrl = canvas.toDataURL("image/webp", 0.8);
  // Cleanup canvas reference
  canvas.width = 0;
  canvas.height = 0;
  return dataUrl;
}

/**
 * Render a single page directly into an existing HTMLCanvasElement
 */
export async function renderPdfPageToCanvas(
  source: File | ArrayBuffer | Uint8Array,
  pageNumber: number,
  targetCanvas: HTMLCanvasElement,
  scale = 1.0
): Promise<PDFDocumentProxy> {
  const doc = await loadPdfDocument(source);
  const page = await doc.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const context = targetCanvas.getContext("2d");

  if (!context) {
    throw new Error("Không thể khởi tạo Canvas 2D context.");
  }

  targetCanvas.width = viewport.width;
  targetCanvas.height = viewport.height;

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;

  return doc;
}

