import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng | " + siteConfig.name,
  description: "Điều khoản và quy định sử dụng dịch vụ công cụ PDF Pro trực tuyến.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Quy định
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Điều khoản sử dụng
          </h1>
          <p className="text-sm text-slate-500">
            Cập nhật lần cuối: Tháng 09/2026
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">1. Chấp thuận điều khoản</h3>
            <p>
              Bằng việc truy cập và sử dụng dịch vụ tại website PDF Pro, bạn đồng ý tuân thủ toàn bộ các điều khoản và điều kiện quy định dưới đây. Nếu không đồng ý với bất kỳ điều khoản nào, vui lòng ngưng sử dụng trang web.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">2. Quyền sở hữu nội dung</h3>
            <p>
              Bạn giữ toàn bộ quyền tác giả và quyền sở hữu đối với các tài liệu mà bạn đưa vào xử lý trên trang web. PDF Pro không có bất kỳ quyền sở hữu hay quyền truy cập nào vào file của bạn.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">3. Mục đích sử dụng hợp pháp</h3>
            <p>
              Bạn cam kết không sử dụng công cụ để chỉnh sửa, làm sai lệch hoặc giả mạo các văn bản trái quy định của pháp luật Việt Nam.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">4. Giới hạn trách nhiệm</h3>
            <p>
              Dịch vụ được cung cấp theo nguyên tắc &ldquo;nguyên trạng&rdquo; (as-is). Mặc dù chúng tôi luôn nỗ lực tối ưu hóa thuật toán để đảm bảo độ chính xác cao nhất, chúng tôi không chịu trách nhiệm đối với các mất mát dữ liệu do sự cố phần cứng hoặc lỗi hệ thống từ phía thiết bị của bạn.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
