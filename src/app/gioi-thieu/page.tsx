import { Metadata } from "next";
import { ShieldCheck, Lock, Zap, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Giới thiệu về PDF Pro | Bộ công cụ PDF bảo mật hàng đầu",
  description: "Tìm hiểu về sứ mệnh, công nghệ và cam kết bảo vệ dữ liệu người dùng 100% Client-Side của dự án PDF Pro.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Về chúng tôi
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sứ mệnh vì một giải pháp PDF An Toàn & Miễn Phí
          </h1>
          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            PDF Pro được tạo ra nhằm xóa bỏ rủi ro rò rỉ dữ liệu khi xử lý hồ sơ tài liệu trực tuyến tại Việt Nam.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm space-y-8 text-slate-700 leading-relaxed">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <span>Tại sao PDF Pro ra đời?</span>
            </h2>
            <p className="text-sm">
              Hàng ngày, hàng triệu sinh viên, giáo viên, nhân viên văn phòng và kế toán tại Việt Nam cần ghép, tách, nén hoặc xoay file PDF (hợp đồng, bảng lương, chứng minh nhân dân, báo cáo tài chính). Hầu hết các website PDF hiện nay đều yêu cầu người dùng **upload file lên máy chủ** của họ để xử lý. Điều này tiềm ẩn nguy cơ bảo mật rất lớn.
            </p>
            <p className="text-sm">
              <strong>PDF Pro thay đổi hoàn toàn điều đó:</strong> Bằng cách ứng dụng các công nghệ web tiên tiến như WebAssembly, Web Workers và JavaScript Canvas thế hệ mới, chúng tôi chuyển toàn bộ việc xử lý trực tiếp về máy tính hoặc điện thoại của bạn.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">3 Nguyên tắc cốt lõi của PDF Pro</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Lock className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">1. Không máy chủ</h4>
                <p className="text-xs text-slate-500">
                  Website là dạng Static Export thuần túy, không có backend lưu trữ, không thể lưu lại tài liệu của bạn.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                  <Zap className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">2. Miễn phí & Tiện lợi</h4>
                <p className="text-xs text-slate-500">
                  Không ép buộc đăng ký, không giới hạn số trang, không thu bất kỳ khoản phí nào từ người dùng.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Heart className="h-4 w-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">3. Minh bạch & Tôn trọng</h4>
                <p className="text-xs text-slate-500">
                  Không dùng các thủ thuật chuyển hướng lừa đảo hay popup ép click.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h3 className="text-lg font-bold text-slate-900">Mã nguồn mở & Giấy phép thư viện</h3>
            <p className="text-xs text-slate-500">
              PDF Pro tự hào sử dụng các thư viện mã nguồn mở có giấy phép tự do (MIT, Apache 2.0, OFL) bao gồm: <code>pdf-lib</code>, <code>pdfjs-dist</code>, <code>@dnd-kit</code>, <code>jszip</code>. Chúng tôi cam kết tuân thủ đầy đủ bản quyền và quy định của cộng đồng mã nguồn mở quốc tế.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
