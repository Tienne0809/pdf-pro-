import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { toolsRegistry, toolCategories } from "@/lib/tools";
import { ToolCard } from "@/components/common/ToolCard";
import { PrivacyBadge } from "@/components/common/PrivacyBadge";

export const metadata: Metadata = {
  title: "Tất cả công cụ xử lý PDF miễn phí | " + siteConfig.name,
  description: "Khám phá danh mục đầy đủ các công cụ ghép, tách, nén, xoay, chuyển đổi ảnh, đánh số trang và đóng dấu PDF trực tuyến miễn phí.",
};

export default function AllToolsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <PrivacyBadge />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tất cả công cụ PDF Pro
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Tuyển tập đầy đủ các tiện ích xử lý tài liệu PDF hàng ngày. Miễn phí 100%, không cần đăng ký và hoạt động an toàn ngay trên trình duyệt của bạn.
          </p>
        </div>

        {/* Categories breakdown */}
        <div className="space-y-12">
          {toolCategories.map((cat) => {
            const tools = toolsRegistry.filter((t) => t.category === cat.id);
            if (tools.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-xl font-bold text-slate-900">{cat.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
