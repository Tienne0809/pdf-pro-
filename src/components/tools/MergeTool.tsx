"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultCard } from "@/components/common/ResultCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { mergePdfFiles, MergeInputFile } from "@/lib/pdf/merge";
import { formatBytes, generateResultFileName } from "@/lib/utils";

export function MergeTool({ initialFile }: { initialFile?: File | null }) {
  const [files, setFiles] = useState<File[]>(initialFile ? [initialFile] : []);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; fileName: string; originalSize: number } | null>(null);

  const handleAddFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setError(null);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveFile = (from: number, to: number) => {
    if (to < 0 || to >= files.length) return;
    const updated = [...files];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setFiles(updated);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Vui lòng chọn ít nhất 2 file để ghép.");
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      setProgress(0);

      const mergeInputs: MergeInputFile[] = files.map((f, idx) => ({
        id: `file-${idx}`,
        file: f,
      }));

      const totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);

      const mergedBlob = await mergePdfFiles(mergeInputs, (percent, msg) => {
        setProgress(percent);
        setProgressMsg(msg);
      });

      const outputName = generateResultFileName(files[0].name, "da-ghep", "pdf");

      setResult({
        blob: mergedBlob,
        fileName: outputName,
        originalSize: totalOriginalSize,
      });
    } catch (err: any) {
      console.error("Lỗi khi ghép PDF:", err);
      setError(err?.message || "Đã xảy ra lỗi trong quá trình ghép PDF. Vui lòng thử lại.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
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

  if (files.length === 0) {
    return (
      <FileDropzone
        onFilesSelected={handleAddFiles}
        multiple={true}
        accept=".pdf,image/*"
        title="Chọn hoặc Kéo thả nhiều file PDF vào đây"
        subtitle="Hỗ trợ ghép nhiều file PDF và ảnh JPG/PNG cùng lúc"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* File list header & Add more */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Danh sách file ({files.length} file)
          </h3>
          <p className="text-xs text-slate-500">
            Kéo thả hoặc dùng mũi tên để sắp xếp thứ tự xuất hiện khi ghép
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors">
            <Plus className="h-4 w-4 text-rose-600" />
            <span>Thêm file khác</span>
            <input
              type="file"
              multiple
              accept=".pdf,image/*"
              onChange={(e) => {
                if (e.target.files) handleAddFiles(Array.from(e.target.files));
                e.target.value = "";
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Files List */}
      <div className="space-y-2.5">
        {files.map((file, idx) => (
          <div
            key={`${file.name}-${idx}`}
            className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-sm transition-all"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-xs font-bold text-rose-600">
                {idx + 1}
              </span>
              <div className="truncate">
                <div className="text-sm font-semibold text-slate-900 truncate" title={file.name}>
                  {file.name}
                </div>
                <div className="text-xs text-slate-400">{formatBytes(file.size)}</div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleMoveFile(idx, idx - 1)}
                disabled={idx === 0}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 text-xs"
                title="Di chuyển lên trên"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => handleMoveFile(idx, idx + 1)}
                disabled={idx === files.length - 1}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100 text-xs"
                title="Di chuyển xuống dưới"
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => handleRemoveFile(idx)}
                className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 ml-1"
                title="Xóa file này"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Progress or Action Button */}
      {processing ? (
        <ProgressBar progress={progress} message={progressMsg} />
      ) : (
        <div className="pt-2">
          {error && <ErrorMessage message={error} onRetry={handleMerge} />}
          <button
            type="button"
            onClick={handleMerge}
            disabled={files.length < 2}
            className="w-full mt-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-rose-600/25 hover:from-rose-500 hover:to-red-500 hover:shadow-xl hover:shadow-rose-600/35 disabled:opacity-50 transition-all"
          >
            <span>Ghép {files.length} file PDF ngay</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
