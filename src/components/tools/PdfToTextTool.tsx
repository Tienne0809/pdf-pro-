"use client";

import { useState } from "react";
import { FileText, Copy, Check, Download, AlertCircle, RefreshCw } from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { extractTextFromPdf } from "@/lib/pdf/pdf-to-text";
import { downloadBlob, generateResultFileName, formatBytes } from "@/lib/utils";

export function PdfToTextTool({ initialFile }: { initialFile?: File | null }) {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    text: string;
    blob: Blob;
    totalPages: number;
    hasText: boolean;
  } | null>(null);

  const handleExtract = async () => {
    if (!file) return;

    try {
      setProcessing(true);
      setError(null);
      setProgress(0);

      const res = await extractTextFromPdf(file, (percent, msg) => {
        setProgress(percent);
        setProgressMsg(msg);
      });

      setResult(res);
    } catch (err: any) {
      console.error("Lỗi trích xuất chữ:", err);
      setError(err?.message || "Đã xảy ra lỗi khi trích xuất chữ từ PDF.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!file || !result) return;
    downloadBlob(result.blob, generateResultFileName(file.name, "van-ban", "txt"));
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  if (result) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl space-y-5 animate-in fade-in">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Nội dung văn bản đã trích xuất</h3>
            <p className="text-xs text-slate-500">
              Tổng số {result.totalPages} trang • File nguồn: {file?.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Đã sao chép!" : "Sao chép"}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-sm transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Tải file .TXT</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              title="Xử lý file khác"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!result.hasText && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <strong className="block font-bold">Lưu ý: Không tìm thấy lớp văn bản số trong file này.</strong>
              Tài liệu của bạn có thể là bản scan dạng hình ảnh hoặc chụp ảnh từ điện thoại.
            </div>
          </div>
        )}

        <textarea
          readOnly
          value={result.text}
          rows={14}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 font-mono text-xs sm:text-sm text-slate-800 leading-relaxed outline-none focus:ring-2 focus:ring-rose-500/20 resize-y"
        />
      </div>
    );
  }

  if (!file) {
    return (
      <FileDropzone
        onFilesSelected={(files) => setFile(files[0])}
        multiple={false}
        title="Chọn hoặc Kéo thả file PDF cần lấy văn bản"
        subtitle="Trích xuất toàn bộ chữ tiếng Việt có dấu sang file .TXT nhanh chóng"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* File summary */}
      <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-slate-900 truncate">{file.name}</div>
            <div className="text-xs text-slate-500">{formatBytes(file.size)}</div>
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

      {/* Action */}
      {processing ? (
        <ProgressBar progress={progress} message={progressMsg} />
      ) : (
        <div className="space-y-3">
          {error && <ErrorMessage message={error} onRetry={handleExtract} />}
          <button
            type="button"
            onClick={handleExtract}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 text-base font-bold text-white shadow-lg hover:from-slate-700 hover:to-slate-800 transition-all"
          >
            <FileText className="h-5 w-5" />
            <span>Trích xuất toàn bộ văn bản</span>
          </button>
        </div>
      )}
    </div>
  );
}
