"use client";

import { useState, useEffect } from "react";
import { ListOrdered, FileText, Settings2 } from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultCard } from "@/components/common/ResultCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import {
  addPageNumbersToPdf,
  PageNumberPosition,
  PageNumberFormat,
} from "@/lib/pdf/number-pages";
import { loadPdfDocument } from "@/lib/pdf/client";
import { formatBytes, generateResultFileName } from "@/lib/utils";

export function NumberPagesTool({ initialFile }: { initialFile?: File | null }) {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [position, setPosition] = useState<PageNumberPosition>("bottom-center");
  const [format, setFormat] = useState<PageNumberFormat>("page_n_total");
  const [startNumber, setStartNumber] = useState<number>(1);
  const [skipFirstPage, setSkipFirstPage] = useState<boolean>(false);
  const fontSize = 11;
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
          setError("Không thể đọc cấu trúc file PDF.");
        });
    }
  }, [file]);

  const handleAddNumbers = async () => {
    if (!file) return;

    try {
      setProcessing(true);
      setError(null);
      setProgress(0);

      const numberedBlob = await addPageNumbersToPdf(
        file,
        {
          position,
          format,
          startNumber,
          skipFirstPage,
          fontSize,
          margin: 30,
        },
        (percent, msg) => {
          setProgress(percent);
          setProgressMsg(msg);
        }
      );

      setResult({
        blob: numberedBlob,
        fileName: generateResultFileName(file.name, "da-danh-so", "pdf"),
      });
    } catch (err: any) {
      console.error("Lỗi đánh số trang:", err);
      setError(err?.message || "Đã xảy ra lỗi khi đánh số trang PDF.");
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
        title="Chọn hoặc Kéo thả file PDF cần đánh số trang"
        subtitle="Tùy chọn 6 vị trí hiển thị, định dạng trang và bỏ qua trang bìa"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* File summary */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold shrink-0">
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

      {/* Configuration Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Settings2 className="h-4 w-4 text-indigo-600" />
          <span>Tùy chỉnh vị trí & Kiểu số trang</span>
        </div>

        {/* 6-Position Grid Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Vị trí hiển thị trên trang:
          </label>
          <div className="grid grid-cols-3 gap-2 max-w-md">
            {[
              { id: "top-left", label: "Góc trên Trái" },
              { id: "top-center", label: "Đỉnh Giữa" },
              { id: "top-right", label: "Góc trên Phải" },
              { id: "bottom-left", label: "Góc dưới Trái" },
              { id: "bottom-center", label: "Đáy Giữa (Chuẩn)" },
              { id: "bottom-right", label: "Góc dưới Phải" },
            ].map((pos) => (
              <button
                key={pos.id}
                type="button"
                onClick={() => setPosition(pos.id as PageNumberPosition)}
                className={`p-2.5 rounded-xl border text-xs font-medium text-center transition-all ${
                  position === pos.id
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-bold ring-2 ring-indigo-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>

        {/* Format & Starting number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Định dạng hiển thị:
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as PageNumberFormat)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:bg-white outline-none"
            >
              <option value="page_n_total">Trang 1 / {totalPages || 10}</option>
              <option value="page_n">Trang 1</option>
              <option value="n_total">1 / {totalPages || 10}</option>
              <option value="n">1 (Chỉ hiện số)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Số bắt đầu:
            </label>
            <input
              type="number"
              min={1}
              value={startNumber}
              onChange={(e) => setStartNumber(parseInt(e.target.value, 10) || 1)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium focus:border-indigo-500 focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* Checkbox skip first page */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <input
            type="checkbox"
            id="skip-first"
            checked={skipFirstPage}
            onChange={(e) => setSkipFirstPage(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="skip-first" className="text-xs font-medium text-slate-700 cursor-pointer">
            Bỏ qua trang bìa đầu tiên (Không đánh số trang bìa báo cáo, luận văn)
          </label>
        </div>
      </div>

      {/* Action */}
      {processing ? (
        <ProgressBar progress={progress} message={progressMsg} />
      ) : (
        <div className="space-y-3">
          {error && <ErrorMessage message={error} onRetry={handleAddNumbers} />}
          <button
            type="button"
            onClick={handleAddNumbers}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-blue-500 transition-all"
          >
            <ListOrdered className="h-5 w-5" />
            <span>Đánh số {totalPages} trang PDF</span>
          </button>
        </div>
      )}
    </div>
  );
}
