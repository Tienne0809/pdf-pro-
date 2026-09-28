"use client";

import { useState, useEffect } from "react";
import { Minimize2, FileText, Check, AlertCircle } from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultCard } from "@/components/common/ResultCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { compressPdf, CompressionLevel } from "@/lib/pdf/compress";
import { loadPdfDocument } from "@/lib/pdf/client";
import { formatBytes, generateResultFileName } from "@/lib/utils";

export function CompressTool({ initialFile }: { initialFile?: File | null }) {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    blob: Blob;
    fileName: string;
    originalSize: number;
    isFallback: boolean;
  } | null>(null);

  useEffect(() => {
    if (file) {
      loadPdfDocument(file)
        .then((doc) => setTotalPages(doc.numPages))
        .catch((err) => {
          console.error("Lỗi nạp PDF:", err);
          setError("Không thể đọc cấu trúc file PDF.");
        });
    }
  }, [file]);

  const handleCompress = async () => {
    if (!file) return;

    try {
      setProcessing(true);
      setError(null);
      setProgress(0);

      const res = await compressPdf(file, level, (percent, msg) => {
        setProgress(percent);
        setProgressMsg(msg);
      });

      setResult({
        blob: res.blob,
        fileName: generateResultFileName(file.name, "da-nen", "pdf"),
        originalSize: res.originalSize,
        isFallback: res.isFallbackOriginal,
      });
    } catch (err: any) {
      console.error("Lỗi nén PDF:", err);
      setError(err?.message || "Đã xảy ra lỗi khi nén PDF.");
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
      <div className="space-y-4">
        {result.isFallback && (
          <div className="flex items-center gap-2 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              File gốc của bạn đã ở mức dung lượng tối ưu nhất, hệ thống đã giữ nguyên file gốc để đảm bảo chất lượng hình ảnh sắc nét nhất.
            </span>
          </div>
        )}
        <ResultCard
          blob={result.blob}
          fileName={result.fileName}
          originalSize={result.originalSize}
          onReset={handleReset}
        />
      </div>
    );
  }

  if (!file) {
    return (
      <FileDropzone
        onFilesSelected={(files) => setFile(files[0])}
        multiple={false}
        title="Chọn hoặc Kéo thả file PDF cần nén giảm dung lượng"
        subtitle="Giảm dung lượng file siêu nhanh để gửi email, đính kèm hồ sơ trực tuyến"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* File summary */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-slate-900 truncate">{file.name}</div>
            <div className="text-xs text-slate-500">
              Dung lượng gốc: <strong className="text-slate-800">{formatBytes(file.size)}</strong> • {totalPages} trang
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

      {/* Compression Level Selector */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Chọn mức độ nén
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Light */}
          <button
            type="button"
            onClick={() => setLevel("light")}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
              level === "light"
                ? "border-emerald-600 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-sm font-bold text-slate-900">Nén Nhẹ</span>
              {level === "light" && <Check className="h-4 w-4 text-emerald-600" />}
            </div>
            <span className="text-xs text-slate-500">Chất lượng cao nhất, giảm ~30%</span>
          </button>

          {/* Medium */}
          <button
            type="button"
            onClick={() => setLevel("medium")}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
              level === "medium"
                ? "border-emerald-600 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-sm font-bold text-slate-900">Nén Vừa</span>
              {level === "medium" && <Check className="h-4 w-4 text-emerald-600" />}
            </div>
            <span className="text-xs text-slate-500">Cân bằng tốt nhất (Khuyên dùng), giảm ~60%</span>
          </button>

          {/* Strong */}
          <button
            type="button"
            onClick={() => setLevel("strong")}
            className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all ${
              level === "strong"
                ? "border-emerald-600 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-sm font-bold text-slate-900">Nén Mạnh</span>
              {level === "strong" && <Check className="h-4 w-4 text-emerald-600" />}
            </div>
            <span className="text-xs text-slate-500">Dung lượng nhỏ nhất, giảm ~80%</span>
          </button>
        </div>
      </div>

      {/* Action */}
      {processing ? (
        <ProgressBar progress={progress} message={progressMsg} />
      ) : (
        <div className="space-y-3">
          {error && <ErrorMessage message={error} onRetry={handleCompress} />}
          <button
            type="button"
            onClick={handleCompress}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-green-500 transition-all"
          >
            <Minimize2 className="h-5 w-5" />
            <span>Nén file PDF ngay</span>
          </button>
        </div>
      )}
    </div>
  );
}
