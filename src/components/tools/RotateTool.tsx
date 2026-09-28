"use client";

import { useState, useEffect } from "react";
import { RotateCw, ArrowRight, FileText } from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultCard } from "@/components/common/ResultCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { PdfThumbnailGrid, ThumbnailItem } from "@/components/common/PdfThumbnailGrid";
import { rotatePdfPages, PageRotationMap } from "@/lib/pdf/rotate";
import { loadPdfDocument } from "@/lib/pdf/client";
import { formatBytes, generateResultFileName } from "@/lib/utils";

export function RotateTool({ initialFile }: { initialFile?: File | null }) {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [items, setItems] = useState<ThumbnailItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; fileName: string } | null>(null);

  useEffect(() => {
    if (file) {
      loadPdfDocument(file)
        .then((doc) => {
          const newItems: ThumbnailItem[] = [];
          for (let i = 0; i < doc.numPages; i++) {
            newItems.push({
              id: `page-${i}`,
              pageIndex: i,
              pageNumber: i + 1,
              rotation: 0,
              selected: false,
            });
          }
          setItems(newItems);
        })
        .catch((err) => {
          console.error("Lỗi nạp PDF:", err);
          setError("Không thể đọc tài liệu PDF. Vui lòng kiểm tra lại file.");
        });
    }
  }, [file]);

  const handleRotateAll = (deg: number) => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        rotation: (item.rotation + deg) % 360,
      }))
    );
  };

  const handleSave = async () => {
    if (!file) return;

    try {
      setProcessing(true);
      setError(null);
      setProgress(0);

      const rotationMap: PageRotationMap = {};
      items.forEach((item) => {
        if (item.rotation !== 0) {
          rotationMap[item.pageIndex] = item.rotation;
        }
      });

      const rotatedBlob = await rotatePdfPages(file, rotationMap, (percent, msg) => {
        setProgress(percent);
        setProgressMsg(msg);
      });

      setResult({
        blob: rotatedBlob,
        fileName: generateResultFileName(file.name, "da-xoay", "pdf"),
      });
    } catch (err: any) {
      console.error("Lỗi xoay PDF:", err);
      setError(err?.message || "Đã xảy ra lỗi khi xoay PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setItems([]);
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
        title="Chọn hoặc Kéo thả file PDF cần xoay"
        subtitle="Xoay từng trang hoặc toàn bộ tài liệu 90°, 180°, 270° vĩnh viễn"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* File summary & Global rotate actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-slate-900 truncate">{file.name}</div>
            <div className="text-xs text-slate-500">
              {formatBytes(file.size)} • {items.length} trang
            </div>
          </div>
        </div>

        {/* Bulk rotation controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleRotateAll(90)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Xoay phải 90° tất cả</span>
          </button>
          <button
            type="button"
            onClick={() => handleRotateAll(180)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Xoay 180°</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50"
          >
            Đổi file
          </button>
        </div>
      </div>

      {/* Interactive Thumbnail Grid */}
      <div className="space-y-2">
        <p className="text-xs text-slate-500">
          * Bạn cũng có thể bấm nút &quot;Xoay&quot; trên từng trang riêng biệt bên dưới:
        </p>
        <PdfThumbnailGrid
          file={file}
          items={items}
          onItemsChange={setItems}
          allowRotate={true}
        />
      </div>

      {/* Progress or Submit Button */}
      {processing ? (
        <ProgressBar progress={progress} message={progressMsg} />
      ) : (
        <div className="space-y-3">
          {error && <ErrorMessage message={error} onRetry={handleSave} />}
          <button
            type="button"
            onClick={handleSave}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-rose-600/25 hover:from-rose-500 hover:to-red-500 transition-all"
          >
            <span>Lưu file PDF đã xoay</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
