"use client";

import { useState, useEffect } from "react";
import { ArrowRight, FileText, Check } from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultCard } from "@/components/common/ResultCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { splitPdf, SplitMode } from "@/lib/pdf/split";
import { loadPdfDocument } from "@/lib/pdf/client";
import { formatBytes } from "@/lib/utils";

export function SplitTool({ initialFile }: { initialFile?: File | null }) {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [mode, setMode] = useState<SplitMode>("ranges");
  const [ranges, setRanges] = useState<string>("1-2");
  const [everyN, setEveryN] = useState<number>(1);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; fileName: string; isZip: boolean } | null>(null);

  useEffect(() => {
    if (file) {
      loadPdfDocument(file)
        .then((doc) => {
          setTotalPages(doc.numPages);
          if (doc.numPages > 1) {
            setRanges(`1-${Math.min(2, doc.numPages)}`);
          } else {
            setRanges("1");
          }
        })
        .catch((err) => {
          console.error("Lỗi đọc PDF:", err);
          setError("Không thể đọc cấu trúc file PDF. Vui lòng kiểm tra lại file.");
        });
    }
  }, [file]);

  const handleSplit = async () => {
    if (!file) return;

    try {
      setProcessing(true);
      setError(null);
      setProgress(0);

      const splitRes = await splitPdf(
        file,
        {
          mode,
          ranges,
          everyN,
        },
        (percent, msg) => {
          setProgress(percent);
          setProgressMsg(msg);
        }
      );

      setResult({
        blob: splitRes.blob,
        fileName: splitRes.filename,
        isZip: splitRes.isZip,
      });
    } catch (err: any) {
      console.error("Lỗi khi tách PDF:", err);
      setError(err?.message || "Đã xảy ra lỗi khi tách PDF. Vui lòng kiểm tra lại khoảng trang.");
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
        title="Chọn hoặc Kéo thả file PDF cần tách"
        subtitle="Hỗ trợ tách theo khoảng trang, chia nhỏ file hoặc xuất từng trang"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* File summary */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 font-bold shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-slate-900 truncate">{file.name}</div>
            <div className="text-xs text-slate-500">
              {formatBytes(file.size)} • {totalPages > 0 ? `${totalPages} trang` : "Đang kiểm tra..."}
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

      {/* Mode Selection Tabs */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Chọn chế độ tách
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setMode("ranges")}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
              mode === "ranges"
                ? "border-rose-500 bg-rose-50/40 shadow-sm ring-2 ring-rose-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-sm font-bold text-slate-900">Theo khoảng trang</span>
              {mode === "ranges" && <Check className="h-4 w-4 text-rose-600" />}
            </div>
            <span className="text-xs text-slate-500">Ví dụ: 1-3, 5, 8-10</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("every_n")}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
              mode === "every_n"
                ? "border-rose-500 bg-rose-50/40 shadow-sm ring-2 ring-rose-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-sm font-bold text-slate-900">Mỗi N trang một file</span>
              {mode === "every_n" && <Check className="h-4 w-4 text-rose-600" />}
            </div>
            <span className="text-xs text-slate-500">Chia đều thành các tệp</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("single_pages")}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
              mode === "single_pages"
                ? "border-rose-500 bg-rose-50/40 shadow-sm ring-2 ring-rose-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-sm font-bold text-slate-900">Mỗi trang một file</span>
              {mode === "single_pages" && <Check className="h-4 w-4 text-rose-600" />}
            </div>
            <span className="text-xs text-slate-500">Xuất toàn bộ vào ZIP</span>
          </button>
        </div>
      </div>

      {/* Mode Specific Inputs */}
      {mode === "ranges" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
          <label className="text-sm font-semibold text-slate-800 block">
            Nhập các khoảng trang muốn trích xuất:
          </label>
          <input
            type="text"
            value={ranges}
            onChange={(e) => setRanges(e.target.value)}
            placeholder="Ví dụ: 1-3, 5, 8-10 hoặc 1-2; 3-5"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
          />
          <p className="text-xs text-slate-400">
            Dùng dấu phẩy <code>,</code> để chọn trang vào 1 file, hoặc dấu chấm phẩy <code>;</code> để xuất nhiều file riêng.
          </p>
        </div>
      )}

      {mode === "every_n" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
          <label className="text-sm font-semibold text-slate-800 block">
            Số trang trên mỗi file mới:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={totalPages || 100}
              value={everyN}
              onChange={(e) => setEveryN(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-24 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-center focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
            />
            <span className="text-sm text-slate-600">
              trang / 1 file (Dự kiến tạo thành {Math.ceil((totalPages || 1) / everyN)} file PDF)
            </span>
          </div>
        </div>
      )}

      {mode === "single_pages" && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
          Tất cả {totalPages} trang sẽ được tách thành {totalPages} file PDF riêng lẻ và đóng gói tự động trong file .ZIP.
        </div>
      )}

      {/* Processing or Action Button */}
      {processing ? (
        <ProgressBar progress={progress} message={progressMsg} />
      ) : (
        <div className="space-y-3">
          {error && <ErrorMessage message={error} onRetry={handleSplit} />}
          <button
            type="button"
            onClick={handleSplit}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-rose-600/25 hover:from-rose-500 hover:to-red-500 transition-all"
          >
            <span>Tách file PDF ngay</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
