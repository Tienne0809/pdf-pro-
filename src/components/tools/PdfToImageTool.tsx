"use client";

import { useState, useEffect } from "react";
import { FileText, Settings2, Image as ImageIcon } from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultCard } from "@/components/common/ResultCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import {
  convertPdfToImages,
  ImageFormat,
  ImageDpi,
} from "@/lib/pdf/pdf-to-image";
import { loadPdfDocument } from "@/lib/pdf/client";
import { formatBytes } from "@/lib/utils";

export function PdfToImageTool({ initialFile }: { initialFile?: File | null }) {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [format, setFormat] = useState<ImageFormat>("jpg");
  const [dpi, setDpi] = useState<ImageDpi>(150);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; fileName: string; isZip: boolean } | null>(null);

  useEffect(() => {
    if (file) {
      loadPdfDocument(file)
        .then((doc) => setTotalPages(doc.numPages))
        .catch((err) => {
          console.error("Lỗi nạp PDF:", err);
          setError("Không thể đọc tài liệu PDF.");
        });
    }
  }, [file]);

  const handleConvert = async () => {
    if (!file) return;

    try {
      setProcessing(true);
      setError(null);
      setProgress(0);

      const res = await convertPdfToImages(
        file,
        {
          format,
          dpi,
        },
        (percent, msg) => {
          setProgress(percent);
          setProgressMsg(msg);
        }
      );

      setResult({
        blob: res.blob,
        fileName: res.filename,
        isZip: res.isZip,
      });
    } catch (err: any) {
      console.error("Lỗi xuất ảnh từ PDF:", err);
      setError(err?.message || "Đã xảy ra lỗi khi xuất ảnh từ PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  if (result) {
    return (
      <ResultCard
        blob={result.blob}
        fileName={result.fileName}
        onReset={handleReset}
        isZip={result.isZip}
      />
    );
  }

  if (!file) {
    return (
      <FileDropzone
        onFilesSelected={(files) => setFile(files[0])}
        multiple={false}
        title="Chọn hoặc Kéo thả file PDF cần xuất thành ảnh"
        subtitle="Chuyển đổi từng trang PDF sang ảnh JPG hoặc PNG sắc nét"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* File summary */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 font-bold shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-slate-900 truncate">{file.name}</div>
            <div className="text-xs text-slate-500">
              {formatBytes(file.size)} • {totalPages} trang
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50"
        >
          Đổi file
        </button>
      </div>

      {/* Options */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Settings2 className="h-4 w-4 text-violet-600" />
          <span>Tùy chỉnh định dạng ảnh & Độ phân giải</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Format selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Định dạng ảnh:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat("jpg")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                  format === "jpg"
                    ? "border-violet-600 bg-violet-50 text-violet-700 ring-2 ring-violet-500/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                JPG (Nhẹ, phổ biến)
              </button>
              <button
                type="button"
                onClick={() => setFormat("png")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                  format === "png"
                    ? "border-violet-600 bg-violet-50 text-violet-700 ring-2 ring-violet-500/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                PNG (Nét, trong suốt)
              </button>
            </div>
          </div>

          {/* DPI Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Độ phân giải (DPI):
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDpi(72)}
                className={`py-2.5 px-2 rounded-xl border text-xs font-bold text-center transition-all ${
                  dpi === 72
                    ? "border-violet-600 bg-violet-50 text-violet-700 ring-2 ring-violet-500/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                72 DPI (Web)
              </button>
              <button
                type="button"
                onClick={() => setDpi(150)}
                className={`py-2.5 px-2 rounded-xl border text-xs font-bold text-center transition-all ${
                  dpi === 150
                    ? "border-violet-600 bg-violet-50 text-violet-700 ring-2 ring-violet-500/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                150 DPI (Chuẩn)
              </button>
              <button
                type="button"
                onClick={() => setDpi(300)}
                className={`py-2.5 px-2 rounded-xl border text-xs font-bold text-center transition-all ${
                  dpi === 300
                    ? "border-violet-600 bg-violet-50 text-violet-700 ring-2 ring-violet-500/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                300 DPI (In ấn)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action */}
      {processing ? (
        <ProgressBar progress={progress} message={progressMsg} />
      ) : (
        <div className="space-y-3">
          {error && <ErrorMessage message={error} onRetry={handleConvert} />}
          <button
            type="button"
            onClick={handleConvert}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-violet-600/25 hover:from-violet-500 hover:to-purple-500 transition-all"
          >
            <ImageIcon className="h-5 w-5" />
            <span>Xuất {totalPages} trang sang ảnh {format.toUpperCase()}</span>
          </button>
        </div>
      )}
    </div>
  );
}
