"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowRight, Settings2 } from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultCard } from "@/components/common/ResultCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import {
  convertImagesToPdf,
  PaperSize,
  PageOrientation,
  PageMargin,
} from "@/lib/pdf/image-to-pdf";
import { formatBytes, generateResultFileName } from "@/lib/utils";

export function ImageToPdfTool() {
  const [images, setImages] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PaperSize>("a4");
  const [orientation, setOrientation] = useState<PageOrientation>("auto");
  const [margin, setMargin] = useState<PageMargin>("small");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; fileName: string; originalSize: number } | null>(null);

  const handleAddImages = (newFiles: File[]) => {
    setImages((prev) => [...prev, ...newFiles]);
    setError(null);
  };

  const handleRemove = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMove = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setImages(updated);
  };

  const handleConvert = async () => {
    if (images.length === 0) {
      setError("Vui lòng chọn ít nhất một bức ảnh để chuyển đổi.");
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      setProgress(0);

      const totalSize = images.reduce((acc, img) => acc + img.size, 0);

      const pdfBlob = await convertImagesToPdf(
        images,
        {
          pageSize,
          orientation,
          margin,
        },
        (percent, msg) => {
          setProgress(percent);
          setProgressMsg(msg);
        }
      );

      const outputName = generateResultFileName(images[0].name, "chuyen-anh", "pdf");

      setResult({
        blob: pdfBlob,
        fileName: outputName,
        originalSize: totalSize,
      });
    } catch (err: any) {
      console.error("Lỗi chuyển ảnh sang PDF:", err);
      setError(err?.message || "Đã xảy ra lỗi khi chuyển đổi ảnh.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setImages([]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  if (result) {
    return (
      <ResultCard
        blob={result.blob}
        fileName={result.fileName}
        originalSize={result.originalSize}
        onReset={handleReset}
      />
    );
  }

  if (images.length === 0) {
    return (
      <FileDropzone
        onFilesSelected={handleAddImages}
        accept="image/*,.jpg,.jpeg,.png,.webp"
        multiple={true}
        title="Chọn hoặc Kéo thả ảnh vào đây"
        subtitle="Hỗ trợ chọn nhiều ảnh JPG, PNG, WebP cùng lúc để ghép thành tài liệu PDF"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Danh sách ảnh ({images.length} ảnh)
          </h3>
          <p className="text-xs text-slate-500">
            Kéo thả hoặc dùng nút mũi tên để đổi thứ tự trang trong file PDF
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors">
          <Plus className="h-4 w-4 text-rose-600" />
          <span>Thêm ảnh khác</span>
          <input
            type="file"
            multiple
            accept="image/*,.jpg,.jpeg,.png,.webp"
            onChange={(e) => {
              if (e.target.files) handleAddImages(Array.from(e.target.files));
              e.target.value = "";
            }}
            className="hidden"
          />
        </label>
      </div>

      {/* Settings Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Settings2 className="h-4 w-4 text-rose-600" />
          <span>Tùy chỉnh định dạng trang PDF</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Paper Size */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Khổ giấy:
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PaperSize)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-rose-500 focus:bg-white outline-none"
            >
              <option value="a4">Khổ A4 chuẩn (Khuyên dùng)</option>
              <option value="letter">Khổ US Letter</option>
              <option value="fit">Vừa khít kích thước ảnh gốc</option>
            </select>
          </div>

          {/* Orientation */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Hướng trang:
            </label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as PageOrientation)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-rose-500 focus:bg-white outline-none"
            >
              <option value="auto">Tự động nhận diện theo ảnh</option>
              <option value="portrait">Trang dọc (Portrait)</option>
              <option value="landscape">Trang ngang (Landscape)</option>
            </select>
          </div>

          {/* Margin */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Khoảng lề trang:
            </label>
            <select
              value={margin}
              onChange={(e) => setMargin(e.target.value as PageMargin)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-rose-500 focus:bg-white outline-none"
            >
              <option value="none">Tràn viền (Không lề)</option>
              <option value="small">Lề nhỏ (Tiết kiệm)</option>
              <option value="large">Lề lớn (Thoáng mắt)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Image list preview */}
      <div className="space-y-2">
        {images.map((img, idx) => (
          <div
            key={`${img.name}-${idx}`}
            className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-sm"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-700">
                {idx + 1}
              </span>
              <div className="truncate">
                <div className="text-sm font-semibold text-slate-900 truncate" title={img.name}>
                  {img.name}
                </div>
                <div className="text-xs text-slate-400">{formatBytes(img.size)}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleMove(idx, idx - 1)}
                disabled={idx === 0}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg text-xs"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, idx + 1)}
                disabled={idx === images.length - 1}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg text-xs"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 ml-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Convert action */}
      {processing ? (
        <ProgressBar progress={progress} message={progressMsg} />
      ) : (
        <div className="space-y-3">
          {error && <ErrorMessage message={error} onRetry={handleConvert} />}
          <button
            type="button"
            onClick={handleConvert}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            <span>Tạo file PDF từ {images.length} ảnh ngay</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
