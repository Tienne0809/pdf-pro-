import { ShieldCheck, Lock, Cpu } from "lucide-react";

export function PrivacyBadge({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 px-4 py-2.5 text-xs text-emerald-900 shadow-sm backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>Bảo mật 100% Client-Side</span>
      </div>
      <span className="hidden sm:inline text-emerald-300">•</span>
      <div className="flex items-center gap-1 text-emerald-700">
        <Lock className="h-3.5 w-3.5 text-emerald-600" />
        <span>File không bao giờ rời khỏi thiết bị</span>
      </div>
      <span className="hidden md:inline text-emerald-300">•</span>
      <div className="hidden md:flex items-center gap-1 text-emerald-700">
        <Cpu className="h-3.5 w-3.5 text-emerald-600" />
        <span>Xử lý siêu tốc trên trình duyệt</span>
      </div>
    </div>
  );
}
