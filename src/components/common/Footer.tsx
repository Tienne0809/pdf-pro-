import Link from "next/link";
import { FileText, ShieldCheck, Heart, Zap, Lock, Cpu } from "lucide-react";
import { toolsRegistry } from "@/lib/tools";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Privacy Promise Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">100% Bảo mật trên thiết bị</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  File tài liệu của bạn không bao giờ được gửi lên bất kỳ máy chủ nào. Mọi phép xử lý diễn ra trực tiếp trong trình duyệt.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Xử lý siêu tốc, không cần mạng</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Tận dụng sức mạnh CPU & WebAssembly của máy tính/điện thoại, thao tác tức thì không phụ thuộc vào tốc độ mạng.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Miễn phí trọn đời, không đăng ký</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Không yêu cầu tạo tài khoản, không giới hạn số lần thực hiện, không chèn watermark quảng cáo vào file của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                PDF <span className="text-rose-500">Pro</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Bộ công cụ PDF trực tuyến miễn phí hàng đầu dành cho sinh viên, nhân viên văn phòng và người làm hồ sơ tại Việt Nam.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Tiêu chuẩn bảo mật dữ liệu cá nhân cao nhất</span>
            </div>
          </div>

          {/* Tools Col 1 */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Công cụ phổ biến
            </h3>
            <ul className="space-y-2.5 text-sm">
              {toolsRegistry.slice(0, 6).map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {tool.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Col 2 */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Chuyển đổi & Chỉnh sửa
            </h3>
            <ul className="space-y-2.5 text-sm">
              {toolsRegistry.slice(6).map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/${tool.slug}`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {tool.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Thông tin & Pháp lý
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/gioi-thieu" className="text-slate-400 hover:text-white transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-mat" className="text-slate-400 hover:text-white transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/dieu-khoan-su-dung" className="text-slate-400 hover:text-white transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-slate-400 hover:text-white transition-colors">
                  Liên hệ & Đóng góp ý kiến
                </Link>
              </li>
              <li>
                <Link href="/tat-ca-cong-cu" className="text-slate-400 hover:text-white transition-colors">
                  Tất cả công cụ PDF
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar & Open Source disclaimer */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PDF Pro (pdfpro.vn). Phát triển vì cộng đồng người dùng Việt Nam.</p>
          <p className="flex items-center gap-1">
            Xây dựng với <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> và các thư viện mã nguồn mở MIT/Apache (pdf-lib, pdfjs-dist, dnd-kit, jszip).
          </p>
        </div>
      </div>
    </footer>
  );
}
