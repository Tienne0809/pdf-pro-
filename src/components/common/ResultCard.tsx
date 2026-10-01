"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Download,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  FileCheck,
  Minimize2,
  Stamp,
  ListOrdered,
  Split,
  FileImage,
  Share2,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { formatBytes, downloadBlob, isInAppBrowser } from "@/lib/utils";
import { saveFileForChaining } from "@/lib/storage";

export interface ResultCardProps {
  blob: Blob;
  fileName: string;
  originalSize?: number;
  onReset: () => void;
  isZip?: boolean;
}

const chainSuggestions = [
  { slug: "nen-file-pdf", label: "Nén file này", icon: Minimize2 },
  { slug: "chen-so-trang", label: "Đánh số trang", icon: ListOrdered },
  { slug: "them-watermark", label: "Đóng dấu bản quyền", icon: Stamp },
  { slug: "tach-file-pdf", label: "Tách trang PDF", icon: Split },
  { slug: "pdf-sang-anh", label: "Xuất thành ảnh", icon: FileImage },
];

export function ResultCard({
  blob,
  fileName,
  originalSize,
  onReset,
  isZip = false,
}: ResultCardProps) {
  const router = useRouter();
  const [downloaded, setDownloaded] = useState(false);
  const [chaining, setChaining] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [inAppBrowser, setInAppBrowser] = useState(false);

  useEffect(() => {
    setInAppBrowser(isInAppBrowser());
    if (typeof navigator !== "undefined" && navigator.canShare) {
      try {
        const testFile = new File([blob], fileName, { type: blob.type || "application/pdf" });
        if (navigator.canShare({ files: [testFile] })) {
          setCanShare(true);
        }
      } catch {
        setCanShare(false);
      }
    }
  }, [blob, fileName]);

  const resultSize = blob.size;
  const isCompressed = originalSize && originalSize > resultSize;
  const percentSaved = isCompressed
    ? Math.round(((originalSize - resultSize) / originalSize) * 100)
    : 0;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E11D48", "#10B981", "#3B82F6", "#F59E0B"],
      });
    } catch {
      // safe fallback
    }
  };

  const handleDownload = () => {
    downloadBlob(blob, fileName);
    setDownloaded(true);
    triggerConfetti();
  };

  const handleShareOrSaveNative = async () => {
    try {
      const file = new File([blob], fileName, { type: blob.type || "application/pdf" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: "Tài liệu PDF đã xử lý từ PDF Pro",
        });
        setDownloaded(true);
        triggerConfetti();
        return;
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        console.warn("Share API fallback to downloadBlob:", err);
        handleDownload();
      }
      return;
    }
    handleDownload();
  };

  const handleOpenInNewTab = () => {
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleChainToTool = async (slug: string) => {
    setChaining(true);
    await saveFileForChaining(blob, fileName);
    router.push(`/${slug}`);
  };

  return (
    <div className="rounded-3xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/40 via-white to-white p-6 sm:p-8 shadow-xl shadow-emerald-500/5 space-y-6 animate-in zoom-in-95 duration-200">
      {/* Top Success Badge */}
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Xử lý hoàn tất thành công!</h3>
        <p className="text-sm text-slate-500">
          File đã sẵn sàng để lưu vào máy hoặc chia sẻ
        </p>
      </div>

      {/* In-App Browser Warning Guide (Zalo / Facebook / TikTok) */}
      {inAppBrowser && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs text-amber-900 flex items-start gap-3 shadow-sm animate-in fade-in duration-200">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-950">
              Bạn đang mở trong ứng dụng (Zalo/Facebook/Messenger)
            </p>
            <p className="text-amber-800 leading-relaxed">
              Trình duyệt trong app này có thể chặn lưu file trực tiếp. Hãy bấm nút{" "}
              <strong>&ldquo;Lưu / Chia sẻ vào Tệp&rdquo;</strong> bên dưới, hoặc bấm vào dấu ba chấm{" "}
              <strong>(⋮ hoặc ⋯)</strong> ở góc trên chọn <strong>&ldquo;Mở bằng trình duyệt (Chrome/Safari)&rdquo;</strong> để tải file mượt nhất.
            </p>
          </div>
        </div>
      )}

      {/* File Info Box */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <FileCheck className="h-6 w-6" />
          </div>
          <div className="truncate">
            <div className="text-sm font-bold text-slate-900 truncate" title={fileName}>
              {fileName}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>Dung lượng: {formatBytes(resultSize)}</span>
              {originalSize && (
                <>
                  <span>•</span>
                  <span>Gốc: {formatBytes(originalSize)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {isCompressed && percentSaved > 0 && (
          <div className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            Tiết kiệm {percentSaved}% dung lượng
          </div>
        )}
      </div>

      {/* Primary Actions (Mobile & Desktop Friendly) */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {/* Main Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-rose-600/25 hover:from-rose-500 hover:to-red-500 hover:shadow-xl hover:shadow-rose-600/35 transition-all transform active:scale-98"
        >
          <Download className="h-5 w-5" />
          <span>{downloaded ? "Tải lại file" : "Tải xuống file ngay"}</span>
        </button>

        {/* Native Mobile Share / Save to Files Button */}
        {canShare && (
          <button
            type="button"
            onClick={handleShareOrSaveNative}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all"
            title="Lưu vào Tệp iPhone / Google Drive / Zalo"
          >
            <Share2 className="h-4 w-4 text-amber-400" />
            <span>Lưu / Chia sẻ file</span>
          </button>
        )}

        {/* Fallback: Open in new tab (Works 100% on all devices) */}
        {!isZip && (
          <button
            type="button"
            onClick={handleOpenInNewTab}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            title="Mở tài liệu trực tiếp trong tab mới"
          >
            <ExternalLink className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">Mở xem trước</span>
          </button>
        )}

        {/* Reset / Process Another File */}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Xử lý file khác</span>
          <span className="sm:hidden">File khác</span>
        </button>
      </div>

      {/* Next Step / Tool Chaining */}
      {!isZip && (
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Làm tiếp với công cụ khác (Chuyển tiếp tức thì trong bộ nhớ)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {chainSuggestions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.slug}
                  type="button"
                  disabled={chaining}
                  onClick={() => handleChainToTool(item.slug)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-rose-300 hover:bg-rose-50/60 text-xs font-medium text-slate-700 hover:text-rose-700 transition-all text-left group"
                >
                  <Icon className="h-4 w-4 text-slate-400 group-hover:text-rose-600 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
