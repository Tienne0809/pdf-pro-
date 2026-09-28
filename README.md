# 📄 PDF Pro - Bộ Công Cụ PDF Miễn Phí & Bảo Mật 100% Client-Side

> Website công cụ PDF trực tuyến **miễn phí, tiếng Việt có dấu, không cần đăng ký**, hoạt động **100% trên trình duyệt** (Client-Side) nhắm đến người dùng Việt Nam (sinh viên, nhân viên văn phòng, kế toán, người làm hồ sơ).

---

## 🌟 Điểm nổi bật & Cam kết bảo mật

1. **File không bao giờ rời khỏi thiết bị người dùng**: Mọi tác vụ xử lý PDF, hình ảnh, văn bản diễn ra hoàn toàn trong RAM và CPU của trình duyệt. Không có backend, không upload file lên bất kỳ máy chủ nào.
2. **Chi phí vận hành = 0 đồng**: Kiến trúc **Next.js Static Export** (`output: 'export'`), triển khai miễn phí trọn đời trên Cloudflare Pages hoặc Vercel.
3. **Tốc độ siêu tốc**: Không tốn thời gian upload/download file lên mạng.
4. **Mobile-First**: Tương thích mượt mà trên iPhone (Safari) và Android (Chrome).
5. **Chuyển tiếp file liên hoàn (Tool Chaining)**: Sau khi ghép file, người dùng có thể bấm "Nén file này" hoặc "Đánh số trang" để chuyển trực tiếp dữ liệu sang công cụ khác qua `IndexedDB` nội bộ mà không cần tải lên/tải xuống nhiều lần.
6. **Kiếm tiền bền vững & đạo đức**: Sẵn sàng tích hợp Google AdSense và hiển thị khối liên kết Affiliate sản phẩm văn phòng phẩm, thiết bị lưu trữ một cách minh bạch, tuyệt đối không có popup lừa đảo hay chuyển hướng ẩn.

---

## 🛠️ Danh sách công cụ đã hoàn thiện

| Slug | Tên công cụ | Tính năng chính |
|---|---|---|
| `/ghep-file-pdf` | **Ghép file PDF** | Ghép nhiều file PDF & ảnh, sắp xếp thứ tự trực quan |
| `/tach-file-pdf` | **Tách file PDF** | Tách theo khoảng trang `1-3, 5, 8-10`, mỗi N trang, hoặc xuất ZIP từng trang |
| `/xoay-pdf` | **Xoay file PDF** | Xoay 90°, 180°, 270° từng trang hoặc toàn bộ file vĩnh viễn |
| `/xoa-trang-pdf` | **Xóa trang PDF** | Chọn trang thừa để xóa, có cơ chế an toàn chống xóa hết file |
| `/sap-xep-trang-pdf` | **Sắp xếp trang PDF** | Kéo thả đổi vị trí các trang, nút đảo ngược thứ tự 1 click |
| `/trich-xuat-trang-pdf`| **Trích xuất trang** | Chọn các trang quan trọng để lưu thành PDF mới |
| `/anh-sang-pdf` | **Ảnh sang PDF** | Chuyển JPG/PNG/WebP sang PDF, chỉnh khổ A4/Letter, lề, xoay EXIF |
| `/pdf-sang-anh` | **PDF sang ảnh** | Xuất JPG/PNG độ phân giải 72/150/300 DPI, tải ZIP hoặc từng ảnh |
| `/nen-file-pdf` | **Nén file PDF** | 3 mức nén (Nhẹ, Vừa, Mạnh), tự động hoàn trả file gốc nếu file đã tối ưu |
| `/chen-so-trang` | **Đánh số trang PDF** | 6 vị trí hiển thị, 4 định dạng số, tùy chọn bỏ qua trang bìa |
| `/them-watermark` | **Thêm Watermark** | Đóng dấu chữ hoặc logo hình ảnh, chỉnh độ mờ, góc xoay, lát gạch |
| `/pdf-sang-van-ban` | **PDF sang Text** | Trích xuất toàn bộ văn bản tiếng Việt Unicode sang file `.txt` |
| `/tat-ca-cong-cu` | **Tất cả công cụ** | Trang danh mục đầy đủ kèm bộ lọc tìm kiếm tức thì |

---

## 🏗️ Cấu trúc thư mục

```
src/
  app/
    [slug]/page.tsx             # Trang công cụ động (Static Site Generation với JSON-LD Schema)
    page.tsx                    # Trang chủ hiện đại, tìm kiếm nhanh
    tat-ca-cong-cu/page.tsx     # Danh bạ tất cả công cụ
    gioi-thieu/page.tsx         # Giới thiệu sứ mệnh & triết lý bảo mật
    chinh-sach-bao-mat/page.tsx # Cam kết không lưu dữ liệu 100% Client-Side
    dieu-khoan-su-dung/page.tsx # Điều khoản sử dụng
    lien-he/page.tsx            # Form liên hệ & góp ý
    sitemap.ts, robots.ts       # Tối ưu hóa SEO Google tự động
    not-found.tsx               # Trang 404 thân thiện
  components/
    common/                     # Header, Footer, FileDropzone, PdfThumbnailGrid,
                                # ProgressBar, ResultCard, PrivacyBadge, AdSlot, AffiliateBox, ToolCard
    tools/                      # Từng component giao diện & logic của 12+ công cụ
  lib/
    tools.ts                    # REGISTRY tập trung: SEO, slug, icon, FAQ, hướng dẫn từng bước
    storage.ts                  # Quản lý bộ nhớ IndexedDB cho Tool Chaining nội bộ
    utils.ts                    # Format dung lượng, phân tích khoảng trang, đặt tên file
    pdf/                        # Hàm xử lý PDF thuần túy (merge, split, rotate, compress, ...)
  config/
    site.ts                     # Tên thương hiệu, domain, email liên hệ
    affiliate.ts                # Danh sách gợi ý sản phẩm tài trợ đạo đức
public/
  pdf.worker.min.js             # Tự đóng gói PDF.js worker nội bộ (không dùng CDN ngoài)
```

---

## 🚀 Hướng dẫn cài đặt & Chạy trên máy cá nhân

### 1. Cài đặt thư viện:
```bash
npm install
```

### 2. Chạy môi trường phát triển (Dev Server):
```bash
npm run dev
```
Truy cập: `http://localhost:3000`

### 3. Xuất bản tĩnh (Static Export để deploy lên Vercel / Cloudflare Pages / GitHub Pages):
```bash
npm run build
```
Toàn bộ mã nguồn HTML/CSS/JS tĩnh hoàn chỉnh sẽ được tạo ra tại thư mục `/out`.

---

## 📜 Danh sách thư viện & Giấy phép mã nguồn mở (Licenses)

Tuân thủ nghiêm ngặt theo **Quy định ràng buộc số 6**: Dự án chỉ sử dụng các thư viện mã nguồn mở có giấy phép tương thích thương mại tự do (MIT, Apache-2.0, BSD, OFL), hoàn toàn không chứa thư viện AGPL/GPL.

| Tên thư viện | Phiên bản | Giấy phép | Mục đích sử dụng |
|---|---|---|---|
| `next` | 14.x | **MIT** | Framework React Static Export & App Router |
| `react` & `react-dom` | 18.x | **MIT** | Thư viện UI cốt lõi |
| `pdf-lib` | 1.17.x | **MIT** | Đọc, tạo, ghép, xoay, trích xuất và biến đổi file PDF |
| `@pdf-lib/fontkit` | 1.1.x | **Apache-2.0** | Hỗ trợ nhúng font chữ tiếng Việt vào PDF |
| `pdfjs-dist` | 3.11.x | **Apache-2.0** | Render trang PDF thành Canvas và đọc lớp văn bản |
| `@dnd-kit/core` & `@dnd-kit/sortable` | 6.x / 8.x | **MIT** | Kéo thả sắp xếp thứ tự trang & file PDF |
| `jszip` | 3.10.x | **MIT / GPL-3.0 dual** | Đóng gói nhiều file kết quả thành file nén .ZIP |
| `lucide-react` | 0.4x | **ISC** | Bộ icon giao diện hiện đại |
| `canvas-confetti` | 1.9.x | **ISC** | Hiệu ứng chúc mừng khi tải file thành công |
| `idb-keyval` | 6.2.x | **Apache-2.0** | Quản lý bộ nhớ IndexedDB cho tính năng chuyển tiếp file |
| `tailwindcss` | 3.4.x | **MIT** | Thiết kế giao diện theo Utility-First |
| `clsx` & `tailwind-merge` | 2.x | **MIT** | Quản lý class style linh hoạt |
| **Be Vietnam Pro** (Font) | Google Fonts | **OFL (Open Font License)** | Font chữ tiếng Việt chuẩn đẹp, dễ đọc |

---

*Phát triển bởi đội ngũ PDF Pro - Vì một môi trường làm việc số an toàn và bảo mật cho người Việt.*
