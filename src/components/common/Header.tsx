"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, Menu, X, FileText, Sparkles, ChevronDown } from "lucide-react";
import { toolCategories, toolsRegistry } from "@/lib/tools";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-red-500 text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              PDF <span className="text-rose-600">Pro</span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                Miễn phí
              </span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:inline-block">
              100% Xử lý trên trình duyệt
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <div
            className="relative"
            onMouseEnter={() => setToolsDropdownOpen(true)}
            onMouseLeave={() => setToolsDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
            >
              Công cụ PDF
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${toolsDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Mega Dropdown Menu */}
            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 w-[640px] -ml-20 mt-1 rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150 grid grid-cols-2 gap-4">
                {toolCategories.map((cat) => (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2.5">
                      {cat.name}
                    </div>
                    <div className="space-y-0.5">
                      {toolsRegistry
                        .filter((t) => t.category === cat.id)
                        .slice(0, 4)
                        .map((tool) => (
                          <Link
                            key={tool.slug}
                            href={`/${tool.slug}`}
                            className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm text-slate-700 hover:bg-rose-50 hover:text-rose-700 transition-colors group"
                            onClick={() => setToolsDropdownOpen(false)}
                          >
                            <span className="font-medium">{tool.shortTitle}</span>
                            {tool.badge && (
                              <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                                {tool.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                    </div>
                  </div>
                ))}
                <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between px-2">
                  <span className="text-xs text-slate-500">Tất cả 12+ công cụ miễn phí</span>
                  <Link
                    href="/tat-ca-cong-cu"
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    onClick={() => setToolsDropdownOpen(false)}
                  >
                    Xem tất cả công cụ &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/ghep-file-pdf"
            className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Ghép PDF
          </Link>
          <Link
            href="/tach-file-pdf"
            className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Tách PDF
          </Link>
          <Link
            href="/nen-file-pdf"
            className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Nén PDF
          </Link>
          <Link
            href="/anh-sang-pdf"
            className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Ảnh sang PDF
          </Link>
        </nav>

        {/* Privacy & CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Riêng tư: File ở lại máy bạn</span>
          </div>

          <Link
            href="/tat-ca-cong-cu"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all hover:shadow-md"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            Khám phá công cụ
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>File xử lý 100% trong điện thoại/máy tính của bạn.</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              href="/ghep-file-pdf"
              className="p-3 text-sm font-medium text-slate-800 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ghép PDF
            </Link>
            <Link
              href="/tach-file-pdf"
              className="p-3 text-sm font-medium text-slate-800 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tách PDF
            </Link>
            <Link
              href="/nen-file-pdf"
              className="p-3 text-sm font-medium text-slate-800 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nén PDF
            </Link>
            <Link
              href="/anh-sang-pdf"
              className="p-3 text-sm font-medium text-slate-800 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ảnh sang PDF
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1">
            <Link
              href="/tat-ca-cong-cu"
              className="px-3 py-2 text-sm font-semibold text-rose-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Xem tất cả công cụ &rarr;
            </Link>
            <Link
              href="/gioi-thieu"
              className="px-3 py-2 text-sm text-slate-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Giới thiệu về PDF Pro
            </Link>
            <Link
              href="/chinh-sach-bao-mat"
              className="px-3 py-2 text-sm text-slate-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
