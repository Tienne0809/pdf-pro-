"use client";

import { useState, useEffect } from "react";
import { FileCheck, FileText } from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultCard } from "@/components/common/ResultCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { PdfThumbnailGrid, ThumbnailItem } from "@/components/common/PdfThumbnailGrid";
import { extractPdfPages } from "@/lib/pdf/extract";
import { loadPdfDocument } from "@/lib/pdf/client";
import { formatBytes, generateResultFileName } from "@/lib/utils";

export function ExtractTool({ initialFile }: { initialFile?: File | null }) {
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
              selected: i === 0, // select 1st page by default
            });
          }
          setItems(newItems);
        })
        .catch((err) => {
          console.error("Lỗi đọc PDF:", err);
          setError("Không thể đọc tài liệu PDF.");
        });
    }
  }, [file]);

  const selectedCount = items.filter((i) => i.selected).length;

  const handleExtract = async () => {
    if (!file) return;

    if (selectedCount === 0) {
      setError("Vui lòng chọn ít nhất một trang để trích xuất.");
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      setProgress(0);

      const pagesToExtract = items
        .filter((i) => i.selected)
        .map((i) => i.pageIndex);

      const extractedBlob = await extractPdfPages(file, pagesToExtract, (percent, msg) => {
        setProgress(percent);
        setProgressMsg(msg);
      });

      setResult({
        blob: extractedBlob,
        fileName: generateResultFileName(file.name, "trich-xuat", "pdf"),
      });
    } catch (err: any) {
      console.error("Lỗi trích xuất PDF:", err);
      setError(err?.message || "Đã xảy ra lỗi khi trích xuất trang PDF.");
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
        title="Chọn hoặc Kéo thả file PDF cần trích xuất trang"
        subtitle="Chọn các trang quan trọng để lưu thành một tài liệu PDF mới"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-slate-900 truncate">{file.name}</div>
            <div className="text-xs text-slate-500">
              {formatBytes(file.size)} • {items.length} trang
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            Đã chọn trích xuất: {selectedCount}/{items.length} trang
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

      <div className="p-3.5 rounded-xl bg-slate-50 text-xs text-slate-600">
        👉 <strong>Chọn trang:</strong> Tick chọn các trang bạn muốn xuất ra file PDF mới.
      </div>

      {/* Grid */}
      <PdfThumbnailGrid
        file={file}
        items={items}
        onItemsChange={setItems}
        allowSelect={true}
      />

      {/* Submit Button */}
      {processing ? (
        <ProgressBar progress={progress} message={progressMsg} />
      ) : (
        <div className="space-y-3">
          {error && <ErrorMessage message={error} onRetry={handleExtract} />}
          <button
            type="button"
            onClick={handleExtract}
            disabled={selectedCount === 0}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 transition-all"
          >
            <FileCheck className="h-5 w-5" />
            <span>Trích xuất {selectedCount} trang thành PDF mới</span>
          </button>
        </div>
      )}
    </div>
  );
}
