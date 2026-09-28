import { AlertCircle, RefreshCw, XCircle } from "lucide-react";

export function ErrorMessage({
  message,
  onRetry,
  onReset,
}: {
  message: string;
  onRetry?: () => void;
  onReset?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/80 p-5 text-red-900 shadow-sm animate-in fade-in duration-200">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-red-800">Đã xảy ra sự cố</h4>
          <p className="text-sm text-red-700 mt-1 leading-relaxed">{message}</p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Thử lại
              </button>
            )}
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-red-200 px-3.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
              >
                <XCircle className="h-3.5 w-3.5" />
                Chọn file khác
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
