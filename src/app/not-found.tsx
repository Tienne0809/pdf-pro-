import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50/50 px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 shadow-lg shadow-rose-500/10">
          <FileQuestion className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            404 - Không tìm thấy trang
          </h1>
          <p className="text-sm text-slate-500">
            Trang hoặc công cụ bạn đang tìm kiếm không tồn tại hoặc đã được chuyển sang địa chỉ mới.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-bold text-white hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all"
          >
            <Home className="h-4 w-4" />
            <span>Về trang chủ</span>
          </Link>

          <Link
            href="/tat-ca-cong-cu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Xem tất cả công cụ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
