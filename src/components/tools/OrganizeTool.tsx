"use client";

import { useState, useEffect } from "react";
import { ArrowRight, FileText, RotateCcw } from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultCard } from "@/components/common/ResultCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { PdfThumbnailGrid, ThumbnailItem } from "@/components/common/PdfThumbnailGrid";
import { organizePdfPages } from "@/lib/pdf/organize";
import { loadPdfDocument } from "@/lib/pdf/client";
import { formatBytes, generateResultFileName } from "@/lib/utils";

export function OrganizeTool({ initialFile }: { initialFile?: File | null }) {
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
          console.error("Lỗi đọc PDF:", err);
          setError("Không thể đọc tài liệu PDF. Vui lòng kiểm tra lại file.");
        });
    }
  }, [file]);

  const handleReverseOrder = () => {
    setItems((prev) => [...prev].reverse());
  };

  const handleSave = async () => {
    if (!file) return;

    try {
      setProcessing(true);
      setError(null);
      setProgress(0);

      const orderedIndices = items.map((i) => i.pageIndex);

      const reorderedBlob = await organizePdfPages(file, orderedIndices, (percent, msg) => {
        setProgress(percent);
        setProgressMsg(msg);
      });

      setResult({
        blob: reorderedBlob,
        fileName: generateResultFileName(file.name, "da-sap-xep", "pdf"),
      });
    } catch (err: any) {
      console.error("Lỗi sắp xếp trang PDF:", err);
      setError(err?.message || "Đã xảy ra lỗi khi sắp xếp trang PDF.");
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
        title="Chọn hoặc Kéo thả file PDF cần đổi thứ tự trang"
        subtitle="Kéo thả các trang đến vị trí mới hoặc đảo ngược thứ tự toàn bộ"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary and quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 font-bold shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-slate-900 truncate">{file.name}</div>
            <div className="text-xs text-slate-500">
              {formatBytes(file.size)} • {items.length} trang
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReverseOrder}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-cyan-600" />
            <span>Đảo ngược thứ tự (Trang cuối lên đầu)</span>
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

      <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-600">
        👆 <strong>Kéo thả</strong> biểu tượng tay nắm trên mỗi thẻ trang để di chuyển đến vị trí mong muốn.
      </div>

      {/* Sortable Grid */}
      <PdfThumbnailGrid
        file={file}
        items={items}
        onItemsChange={setItems}
        allowReorder={true}
      />

      {/* Action button */}
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
            <span>Lưu file theo thứ tự mới</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
