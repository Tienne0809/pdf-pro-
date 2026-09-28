"use client";

import { useState, useEffect } from "react";
import { Trash2, FileText } from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultCard } from "@/components/common/ResultCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { PdfThumbnailGrid, ThumbnailItem } from "@/components/common/PdfThumbnailGrid";
import { deletePdfPages } from "@/lib/pdf/delete-pages";
import { loadPdfDocument } from "@/lib/pdf/client";
import { formatBytes, generateResultFileName } from "@/lib/utils";

export function DeletePagesTool({ initialFile }: { initialFile?: File | null }) {
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
              selected: false, // selected means "mark for deletion"
            });
          }
          setItems(newItems);
        })
        .catch((err) => {
          console.error("Lỗi đọc PDF:", err);
          setError("Không thể đọc tài liệu PDF. Vui lòng kiểm tra lại file.");
        });
    }
  }, [file]);

  const markedCount = items.filter((i) => i.selected).length;
  const remainingCount = items.length - markedCount;

  const handleDelete = async () => {
    if (!file) return;

    if (markedCount === 0) {
      setError("Vui lòng tick chọn ít nhất một trang bạn muốn xóa.");
      return;
    }

    if (remainingCount === 0) {
      setError("Không thể xóa toàn bộ trang. Tài liệu PDF phải còn lại ít nhất 1 trang.");
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      setProgress(0);

      const pagesToDelete = items
        .filter((i) => i.selected)
        .map((i) => i.pageIndex);

      const cleanedBlob = await deletePdfPages(file, pagesToDelete, (percent, msg) => {
        setProgress(percent);
        setProgressMsg(msg);
      });

      setResult({
        blob: cleanedBlob,
        fileName: generateResultFileName(file.name, "da-xoa-trang", "pdf"),
      });
    } catch (err: any) {
      console.error("Lỗi xóa trang PDF:", err);
      setError(err?.message || "Đã xảy ra lỗi khi xóa trang PDF.");
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
        title="Chọn hoặc Kéo thả file PDF cần xóa bớt trang"
        subtitle="Chọn các trang thừa, trang trắng để xóa bỏ nhanh chóng"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700 font-bold shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-slate-900 truncate">{file.name}</div>
            <div className="text-xs text-slate-500">
              {formatBytes(file.size)} • Tổng {items.length} trang
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200">
            Đã chọn xóa: {markedCount} trang (Còn lại: {remainingCount} trang)
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50"
          >
            Đổi file
          </button>
        </div>
      </div>

      {/* Grid instructions */}
      <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-600">
        👉 <strong>Hướng dẫn:</strong> Bấm vào ô tích ở góc phải mỗi trang để đánh dấu trang muốn xóa. Trang được chọn sẽ có viền đỏ.
      </div>

      {/* Thumbnail Grid */}
      <PdfThumbnailGrid
        file={file}
        items={items}
        onItemsChange={setItems}
        allowSelect={true}
      />

      {/* Processing or Action */}
      {processing ? (
        <ProgressBar progress={progress} message={progressMsg} />
      ) : (
        <div className="space-y-3">
          {error && <ErrorMessage message={error} onRetry={handleDelete} />}
          <button
            type="button"
            onClick={handleDelete}
            disabled={markedCount === 0 || remainingCount === 0}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-red-600/25 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 transition-all"
          >
            <Trash2 className="h-5 w-5" />
            <span>Xóa {markedCount} trang đã chọn</span>
          </button>
        </div>
      )}
    </div>
  );
}
