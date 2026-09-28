import { Loader2, X } from "lucide-react";

export function ProgressBar({
  progress,
  message,
  onCancel,
}: {
  progress: number;
  message?: string;
  onCancel?: () => void;
}) {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50 space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Loader2 className="h-5 w-5 animate-spin text-rose-600" />
          <span className="text-sm font-semibold text-slate-800">
            {message || "Đang xử lý tài liệu..."}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-rose-600">{clampedProgress}%</span>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Hủy thao tác"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress track */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      <p className="text-xs text-slate-400 text-center">
        Tài liệu được xử lý trực tiếp trên trình duyệt của bạn với tốc độ cao nhất
      </p>
    </div>
  );
}
