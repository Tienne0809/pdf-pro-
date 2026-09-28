import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ShieldCheck, EyeOff, ServerOff, DatabaseZap } from "lucide-react";

export const metadata: Metadata = {
  title: "Chính sách bảo mật | " + siteConfig.name,
  description: "Cam kết bảo mật 100% Client-Side của PDF Pro: File của bạn không bao giờ rời khỏi thiết bị, không lưu trữ trên máy chủ.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Bảo mật & Riêng tư
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Chính sách bảo mật dữ liệu
          </h1>
          <p className="text-sm text-slate-500">
            Cập nhật lần cuối: Tháng 09/2026 • Cam kết bảo vệ quyền riêng tư tuyệt đối
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          {/* Main Guarantee Box */}
          <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3 text-emerald-950">
            <h2 className="text-base font-bold flex items-center gap-2 text-emerald-900">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Cam kết cốt lõi: 100% Xử lý trong trình duyệt</span>
            </h2>
            <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
              Website <strong>PDF Pro ({siteConfig.url})</strong> không có hệ thống máy chủ nhận và lưu trữ file. Khi bạn thực hiện bất kỳ thao tác nào (Ghép, Tách, Nén, Xoay, Đánh số trang...), mọi phép tính đều diễn ra trực tiếp trong RAM và bộ xử lý của trình duyệt trên thiết bị bạn đang dùng.
            </p>
          </div>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ServerOff className="h-4 w-4 text-rose-600" />
              <span>1. Thu thập dữ liệu tài liệu</span>
            </h3>
            <p>
              Chúng tôi <strong>KHÔNG</strong> thu thập, <strong>KHÔNG</strong> tải lên, <strong>KHÔNG</strong> sao lưu và <strong>KHÔNG</strong> chia sẻ bất kỳ nội dung tài liệu, hình ảnh, văn bản hay tên file nào của bạn. Ngay cả khi bạn ngắt kết nối Internet sau khi trang đã tải xong, các công cụ vẫn hoạt động bình thường.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DatabaseZap className="h-4 w-4 text-blue-600" />
              <span>2. Bộ nhớ tạm thời trên trình duyệt (IndexedDB / LocalStorage)</span>
            </h3>
            <p>
              Để hỗ trợ tính năng tiện lợi &ldquo;Làm tiếp với công cụ khác&rdquo;, file sau khi xử lý có thể được lưu tạm trong bộ nhớ cục bộ <code>IndexedDB</code> của riêng trình duyệt máy bạn. Dữ liệu này chỉ tồn tại trên thiết bị của bạn và sẽ tự động xóa sau 15 phút hoặc khi bạn đóng tab.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <EyeOff className="h-4 w-4 text-amber-600" />
              <span>3. Quảng cáo của bên thứ ba (Google AdSense)</span>
            </h3>
            <p>
              Để duy trì dịch vụ miễn phí 0đ cho người dùng, website có tích hợp mạng lưới quảng cáo tiêu chuẩn từ Google AdSense. Google có thể sử dụng cookie (như cookie DART) để hiển thị quảng cáo phù hợp dựa trên lịch sử duyệt web thông thường của bạn. Không có bất kỳ dữ liệu tài liệu nào được cung cấp cho mạng quảng cáo.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">4. Liên hệ giải đáp</h3>
            <p>
              Nếu bạn có bất kỳ thắc mắc hay kiểm toán kỹ thuật nào về cách hoạt động an toàn của PDF Pro, xin vui lòng gửi email về:{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className="text-rose-600 font-semibold underline">
                {siteConfig.contactEmail}
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
