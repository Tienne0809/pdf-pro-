"use client";

import { useState, useEffect } from "react";
import { Stamp, FileText, Settings2, Image as ImageIcon, Type } from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultCard } from "@/components/common/ResultCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import {
  addWatermarkToPdf,
  WatermarkType,
  WatermarkPosition,
} from "@/lib/pdf/watermark";
import { loadPdfDocument } from "@/lib/pdf/client";
import { formatBytes, generateResultFileName } from "@/lib/utils";

export function WatermarkTool({ initialFile }: { initialFile?: File | null }) {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [type, setType] = useState<WatermarkType>("text");
  const [text, setText] = useState<string>("BẢN QUYỀN PDF PRO");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [opacity, setOpacity] = useState<number>(0.3);
  const [rotation, setRotation] = useState<number>(45);
  const [position, setPosition] = useState<WatermarkPosition>("center");
  const color = "#EF4444";
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; fileName: string } | null>(null);

  useEffect(() => {
    if (file) {
      loadPdfDocument(file)
        .then((doc) => setTotalPages(doc.numPages))
        .catch((err) => {
          console.error("Lỗi đọc PDF:", err);
          setError("Không thể đọc tài liệu PDF.");
        });
    }
  }, [file]);

  const handleApply = async () => {
    if (!file) return;

    if (type === "text" && !text.trim()) {
      setError("Vui lòng nhập nội dung chữ đóng dấu watermark.");
      return;
    }

    if (type === "image" && !imageFile) {
      setError("Vui lòng tải lên file ảnh/logo để đóng dấu.");
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      setProgress(0);

      const watermarkedBlob = await addWatermarkToPdf(
        file,
        {
          type,
          text,
          imageFile: imageFile || undefined,
          opacity,
          rotation,
          position,
          color,
          fontSize: 40,
        },
        (percent, msg) => {
          setProgress(percent);
          setProgressMsg(msg);
        }
      );

      setResult({
        blob: watermarkedBlob,
        fileName: generateResultFileName(file.name, "da-dong-dau", "pdf"),
      });
    } catch (err: any) {
      console.error("Lỗi đóng dấu watermark:", err);
      setError(err?.message || "Đã xảy ra lỗi khi đóng dấu watermark.");
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
      />
    );
  }

  if (!file) {
    return (
      <FileDropzone
        onFilesSelected={(files) => setFile(files[0])}
        multiple={false}
        title="Chọn hoặc Kéo thả file PDF cần đóng dấu bản quyền"
        subtitle="Chèn chữ hoặc logo hình ảnh mờ chống sao chép tài liệu"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* File summary */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-700 font-bold shrink-0">
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

      {/* Settings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Settings2 className="h-4 w-4 text-fuchsia-600" />
          <span>Tùy chỉnh dấu Watermark</span>
        </div>

        {/* Watermark Type */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType("text")}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
              type === "text"
                ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700 ring-2 ring-fuchsia-500/20"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <Type className="h-4 w-4" />
            <span>Dạng chữ (Text)</span>
          </button>
          <button
            type="button"
            onClick={() => setType("image")}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
              type === "image"
                ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-700 ring-2 ring-fuchsia-500/20"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Dạng ảnh logo (PNG/JPG)</span>
          </button>
        </div>

        {type === "text" ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nội dung chữ đóng dấu:
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Nhập tên, số điện thoại hoặc 'BẢN QUYỀN'"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-fuchsia-500 outline-none"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Chọn file ảnh logo (khuyên dùng PNG trong suốt):
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
            />
          </div>
        )}

        {/* Position, Opacity & Rotation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vị trí:
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as WatermarkPosition)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-fuchsia-500 outline-none"
            >
              <option value="center">Chính giữa trang</option>
              <option value="tile">Lát gạch toàn trang (Chống chụp màn hình)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Độ mờ: {Math.round(opacity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full accent-fuchsia-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Góc xoay: {rotation}°
            </label>
            <select
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value, 10))}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-fuchsia-500 outline-none"
            >
              <option value={45}>Nghiêng 45° (Chuẩn)</option>
              <option value={0}>Nằm ngang 0°</option>
              <option value={90}>Thẳng đứng 90°</option>
              <option value={-45}>Nghiêng ngược -45°</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action */}
      {processing ? (
        <ProgressBar progress={progress} message={progressMsg} />
      ) : (
        <div className="space-y-3">
          {error && <ErrorMessage message={error} onRetry={handleApply} />}
          <button
            type="button"
            onClick={handleApply}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-rose-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-fuchsia-600/25 hover:from-fuchsia-500 hover:to-rose-500 transition-all"
          >
            <Stamp className="h-5 w-5" />
            <span>Chèn Watermark lên {totalPages} trang</span>
          </button>
        </div>
      )}
    </div>
  );
}
