"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Hỗ trợ & Đóng góp
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Liên hệ với đội ngũ PDF Pro
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Chúng tôi luôn lắng nghe ý kiến phản hồi và đề xuất tính năng mới từ cộng đồng người dùng Việt Nam.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Cảm ơn bạn đã gửi đóng góp!</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Chúng tôi đã ghi nhận phản hồi và sẽ liên hệ lại qua email trong thời gian sớm nhất nếu cần thêm thông tin.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", message: "" });
                }}
                className="mt-4 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
              >
                Gửi phản hồi khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Họ và tên của bạn:
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email liên hệ:
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@vidu.vn"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nội dung góp ý hoặc thông báo lỗi:
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Mô tả công cụ bạn muốn thêm, hoặc lỗi bạn gặp phải khi sử dụng..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-rose-600/20 hover:from-rose-500 hover:to-red-500 transition-all"
              >
                <Send className="h-4 w-4" />
                <span>Gửi góp ý ngay</span>
              </button>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Mail className="h-4 w-4 text-rose-500" />
                <span>Hoặc gửi trực tiếp về email: {siteConfig.contactEmail}</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
