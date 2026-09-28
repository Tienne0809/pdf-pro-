"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, FileText, AlertTriangle, Image as ImageIcon, Plus } from "lucide-react";
import { isPdfFile } from "@/lib/utils";

export interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
  compact?: boolean;
}

export function FileDropzone({
  onFilesSelected,
  accept = ".pdf",
  multiple = false,
  title,
  subtitle,
  className = "",
  compact = false,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isImageTarget = accept.includes("image");

  const processFiles = async (fileList: FileList | File[]) => {
    setErrorMsg(null);
    setWarningMsg(null);

    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    const validFiles: File[] = [];

    for (const file of filesArray) {
      // Soft limit warning (>100MB)
      if (file.size > 100 * 1024 * 1024) {
        setWarningMsg(`File "${file.name}" có dung lượng lớn (>100MB), quá trình xử lý trên trình duyệt có thể mất thêm vài giây.`);
      }

      if (isImageTarget) {
        if (file.type.startsWith("image/") || /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
          validFiles.push(file);
        } else {
          setErrorMsg(`File "${file.name}" không phải là định dạng hình ảnh hợp lệ (JPG, PNG, WebP).`);
        }
      } else {
        // PDF verification
        if (file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
          const isValidPdfHeader = await isPdfFile(file);
          if (isValidPdfHeader || file.size < 1024) {
            validFiles.push(file);
          } else {
            setErrorMsg(`File "${file.name}" không phải là tài liệu PDF hợp lệ hoặc file đã bị hỏng.`);
          }
        } else if (multiple && accept.includes("image") && file.type.startsWith("image/")) {
          // Allow image when multi-merge supports images
          validFiles.push(file);
        } else {
          setErrorMsg(`Vui lòng chỉ chọn file định dạng PDF (.pdf).`);
        }
      }
    }

    if (validFiles.length > 0) {
      if (!multiple && validFiles.length > 1) {
        onFilesSelected([validFiles[0]]);
      } else {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
      // Reset input value so re-uploading the same file works
      e.target.value = "";
    }
  };

  return (
    <div className={`w-full space-y-3 ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all duration-300 ${
          isDragOver
            ? "border-rose-500 bg-rose-50/70 scale-[1.01] shadow-xl shadow-rose-500/10"
            : "border-slate-300 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 hover:border-rose-400 hover:bg-rose-50/30 hover:shadow-lg hover:shadow-rose-500/5"
        } ${compact ? "p-6" : "p-8 sm:p-14"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        {/* Icon & Glow */}
        <div className="relative mb-4">
          <div className="absolute -inset-2 rounded-full bg-rose-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <div
            className={`relative flex items-center justify-center rounded-2xl ${
              compact ? "h-12 w-12" : "h-20 w-20"
            } bg-gradient-to-tr from-rose-600 via-rose-500 to-red-500 text-white shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform duration-300`}
          >
            {isImageTarget ? (
              <ImageIcon className={compact ? "h-6 w-6" : "h-10 w-10"} />
            ) : multiple ? (
              <UploadCloud className={compact ? "h-6 w-6" : "h-10 w-10"} />
            ) : (
              <FileText className={compact ? "h-6 w-6" : "h-10 w-10"} />
            )}
          </div>
        </div>

        {/* Titles */}
        <div className="text-center space-y-1.5 max-w-md">
          <h3 className={`font-bold text-slate-900 group-hover:text-rose-600 transition-colors ${compact ? "text-base" : "text-lg sm:text-xl"}`}>
            {title || (isImageTarget ? "Chọn hoặc Kéo thả ảnh vào đây" : "Chọn file PDF từ thiết bị")}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {subtitle || (multiple ? "Kéo thả một hoặc nhiều file cùng lúc để xử lý" : "Nhấp vào đây để duyệt file từ máy tính hoặc điện thoại")}
          </p>
        </div>

        {/* Big CTA Button visual */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-rose-600/20 group-hover:bg-rose-500 group-hover:shadow-lg transition-all">
          <Plus className="h-4 w-4" />
          <span>{isImageTarget ? "Chọn hình ảnh" : "Chọn tài liệu PDF"}</span>
        </div>

        {/* Formats hint */}
        <div className="mt-4 text-[11px] text-slate-400 font-medium">
          {isImageTarget ? "Hỗ trợ định dạng: JPG, PNG, WebP" : "Hỗ trợ định dạng tài liệu: .PDF"}
        </div>
      </div>

      {/* Warning */}
      {warningMsg && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 animate-in fade-in">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{warningMsg}</span>
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 animate-in fade-in">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
