import { affiliateProducts } from "@/config/affiliate";
import { Printer, HardDrive, BookOpen, FileText, ExternalLink, Star } from "lucide-react";

const iconMap = {
  Printer: Printer,
  HardDrive: HardDrive,
  BookOpen: BookOpen,
  FileText: FileText,
  Laptop: Printer,
  ShieldCheck: HardDrive,
};

export function AffiliateBox({ limit = 2, className = "" }: { limit?: number; className?: string }) {
  const items = affiliateProducts.slice(0, limit);

  return (
    <div className={`my-8 rounded-2xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-white p-5 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>Gợi ý thiết bị & Công cụ văn phòng hữu ích</span>
          </h4>
          <p className="text-xs text-slate-500">
            Sản phẩm tuyển chọn giúp nâng cao hiệu suất xử lý hồ sơ & tài liệu PDF
          </p>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
          Liên kết tài trợ
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((prod) => {
          const Icon = iconMap[prod.iconName] || FileText;
          return (
            <a
              key={prod.id}
              href={prod.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 transition-all duration-200 hover:border-rose-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  {prod.badge && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      {prod.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {prod.title}
                  </h5>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-rose-600">{prod.priceEstimate}</span>
                  <div className="flex items-center gap-0.5 text-xs text-amber-500">
                    <Star className="h-3 w-3 fill-amber-400" />
                    <span className="text-[11px] font-medium text-slate-600">{prod.rating}</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-rose-600">
                  Xem chi tiết <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
