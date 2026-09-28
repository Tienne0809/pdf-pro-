"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Zap,
  Lock,
  Smartphone,
} from "lucide-react";
import { toolsRegistry, toolCategories, ToolCategory } from "@/lib/tools";
import { ToolCard } from "@/components/common/ToolCard";
import { PrivacyBadge } from "@/components/common/PrivacyBadge";
import { AdSlot } from "@/components/common/AdSlot";
import { AffiliateBox } from "@/components/common/AffiliateBox";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">("all");

  const filteredTools = toolsRegistry.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === "all" || tool.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-white to-slate-50/50 pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/70">
        {/* Subtle decorative background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-rose-500/10 via-amber-500/5 to-transparent blur-3xl -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <PrivacyBadge />

          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Bộ công cụ PDF{" "}
              <span className="bg-gradient-to-r from-rose-600 to-red-500 bg-clip-text text-transparent">
                Miễn phí & Bảo mật 100%
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Mọi tài liệu PDF được xử lý trực tiếp trên trình duyệt của bạn.{" "}
              <strong className="text-slate-900 font-semibold">
                Không upload file lên máy chủ, không cần đăng ký tài khoản.
              </strong>
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm công cụ: Ghép PDF, Tách PDF, Nén, Chuyển ảnh..."
                className="w-full rounded-2xl border border-slate-300 bg-white py-4 pl-12 pr-4 text-sm font-medium shadow-lg shadow-slate-200/50 placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Gợi ý nhanh:</span>
            {[
              { label: "Ghép PDF", slug: "ghep-file-pdf" },
              { label: "Tách PDF", slug: "tach-file-pdf" },
              { label: "Nén PDF", slug: "nen-file-pdf" },
              { label: "Ảnh sang PDF", slug: "anh-sang-pdf" },
              { label: "PDF sang Ảnh", slug: "pdf-sang-anh" },
              { label: "Đánh số trang", slug: "chen-so-trang" },
            ].map((tag) => (
              <Link
                key={tag.slug}
                href={`/${tag.slug}`}
                className="rounded-xl bg-white/80 border border-slate-200 px-3 py-1 text-slate-700 hover:border-rose-300 hover:text-rose-600 hover:bg-white shadow-sm transition-all"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Tools Grid Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        {/* Category Filters */}
        <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeCategory === "all"
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            Tất cả công cụ ({toolsRegistry.length})
          </button>
          {toolCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeCategory === cat.id
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Tools Cards */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3">
            <p className="text-slate-500 text-sm">
              Không tìm thấy công cụ nào phù hợp với từ khóa &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Xem tất cả công cụ
            </button>
          </div>
        )}

        {/* Ad Slot */}
        <AdSlot slotId="home-feed-banner" format="horizontal" />

        {/* Value Proposition Highlights */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Tại sao hàng triệu người tin dùng PDF Pro?
            </h2>
            <p className="text-sm text-slate-500">
              Giải pháp xử lý tài liệu thế hệ mới đặt sự riêng tư và bảo mật dữ liệu của bạn lên hàng đầu
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 space-y-3 border border-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Lock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Bảo mật tuyệt đối</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tài liệu không tải lên server. Mọi xử lý thực hiện bằng WebAssembly & Canvas nội bộ máy tính.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 space-y-3 border border-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Tốc độ tức thì</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Không mất thời gian upload/download chờ server. Xử lý hàng trăm trang trong vài giây.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 space-y-3 border border-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Smartphone className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Dùng mượt trên mobile</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tối ưu hoàn hảo cho iPhone Safari và Android Chrome. Thao tác chạm vuốt dễ dàng.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 space-y-3 border border-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Không quảng cáo lừa đảo</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nói không với popup ép click, chuyển hướng ẩn. Minh bạch, uy tín và miễn phí trọn đời.
              </p>
            </div>
          </div>
        </div>

        {/* Affiliate Product Recommendations */}
        <AffiliateBox limit={4} />
      </section>
    </div>
  );
}
