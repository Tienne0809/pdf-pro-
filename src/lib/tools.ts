export type ToolCategory = "co-ban" | "chuyen-doi" | "chinh-sua" | "bao-mat";

export interface ToolRegistryItem {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: ToolCategory;
  iconName: string;
  badge?: string;
  color: string;
  accept: string;
  multiple: boolean;
  steps: { title: string; desc: string }[];
  features: string[];
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
  keywords: string[];
}

export const toolCategories: { id: ToolCategory; name: string; desc: string }[] = [
  { id: "co-ban", name: "Công cụ cơ bản", desc: "Ghép, tách, xoay, sắp xếp và xóa trang PDF nhanh chóng" },
  { id: "chuyen-doi", name: "Chuyển đổi PDF", desc: "Chuyển đổi qua lại giữa PDF và ảnh, văn bản" },
  { id: "chinh-sua", name: "Chỉnh sửa & Đóng dấu", desc: "Đánh số trang, chèn watermark bảo vệ bản quyền tài liệu" },
  { id: "bao-mat", name: "Tối ưu & Bảo mật", desc: "Nén dung lượng PDF và bảo vệ quyền riêng tư" },
];

export const toolsRegistry: ToolRegistryItem[] = [
  {
    slug: "ghep-file-pdf",
    title: "Ghép file PDF - Nối nhiều file PDF thành một miễn phí",
    shortTitle: "Ghép PDF",
    description: "Ghép nhiều file PDF hoặc ảnh thành một tài liệu duy nhất trong vài giây. Kéo thả sắp xếp thứ tự dễ dàng, bảo mật 100% không tải lên máy chủ.",
    category: "co-ban",
    iconName: "Combine",
    badge: "Phổ biến nhất",
    color: "from-rose-500 to-red-600",
    accept: ".pdf,image/*",
    multiple: true,
    steps: [
      { title: "Bước 1: Chọn hoặc kéo thả các file PDF", desc: "Bấm nút chọn file hoặc kéo nhiều tài liệu PDF từ máy tính/điện thoại vào khung làm việc." },
      { title: "Bước 2: Sắp xếp thứ tự file", desc: "Kéo thả các thẻ tài liệu để điều chỉnh thứ tự xuất hiện mong muốn trong file PDF ghép." },
      { title: "Bước 3: Ghép và Tải về", desc: "Bấm 'Ghép PDF ngay', trình duyệt sẽ kết hợp các trang trong tích tắc để bạn tải về máy." },
    ],
    features: [
      "Hỗ trợ ghép không giới hạn số lượng file PDF cùng lúc",
      "Giữ nguyên độ phân giải, định dạng và chất lượng trang gốc",
      "Hỗ trợ kéo thả đổi thứ tự các file trực quan",
      "Xử lý trực tiếp trên trình duyệt, cam kết file không tải lên server",
    ],
    faqs: [
      {
        q: "Ghép file PDF trên PDF Pro có bị giới hạn dung lượng không?",
        a: "PDF Pro chạy hoàn toàn trên trình duyệt của bạn nên không giới hạn dung lượng cứng. Bạn có thể ghép các file lớn tùy thuộc vào bộ nhớ RAM của thiết bị.",
      },
      {
        q: "Dữ liệu và file của tôi có bị lộ trên mạng không?",
        a: "Tuyệt đối không! Khác với các website khác tải file lên máy chủ, PDF Pro chạy mã nguồn nội bộ trên máy bạn. File không bao giờ rời khỏi thiết bị.",
      },
      {
        q: "Tôi có thể ghép ảnh JPG hoặc PNG chung vào file PDF không?",
        a: "Có! Bạn hoàn toàn có thể chọn cả file ảnh và PDF để kết hợp thành một file duy nhất.",
      },
    ],
    relatedSlugs: ["tach-file-pdf", "sap-xep-trang-pdf", "nen-file-pdf", "chen-so-trang"],
    keywords: ["ghép pdf", "ghep file pdf", "nối pdf", "merge pdf", "kết hợp file pdf", "ghép pdf không giới hạn"],
  },
  {
    slug: "tach-file-pdf",
    title: "Tách file PDF - Cắt và chia nhỏ trang PDF trực tuyến",
    shortTitle: "Tách PDF",
    description: "Tách một file PDF lớn thành các file nhỏ theo khoảng trang tùy chỉnh, chia theo số lượng trang hoặc xuất từng trang riêng biệt.",
    category: "co-ban",
    iconName: "Split",
    badge: "Tiện ích",
    color: "from-amber-500 to-orange-600",
    accept: ".pdf",
    multiple: false,
    steps: [
      { title: "Bước 1: Chọn file PDF cần tách", desc: "Tải file PDF từ thiết bị lên khung làm việc." },
      { title: "Bước 2: Chọn chế độ tách trang", desc: "Nhập khoảng trang (ví dụ 1-3, 5, 8-10), tách mỗi N trang một file, hoặc tách từng trang riêng." },
      { title: "Bước 3: Tải về kết quả", desc: "Bấm 'Tách PDF' để nhận file PDF mới hoặc gói nén ZIP chứa toàn bộ các trang đã tách." },
    ],
    features: [
      "Hỗ trợ 3 chế độ tách linh hoạt: theo khoảng trang, theo cụm N trang, hoặc mỗi trang một file",
      "Tự động nén thành file ZIP gọn gàng khi xuất nhiều tài liệu",
      "Kiểm tra và cảnh báo lỗi số trang nhập sai tự động",
      "Tốc độ tách siêu tốc không cần chờ đợi mạng",
    ],
    faqs: [
      {
        q: "Làm thế nào để nhập khoảng trang cần tách?",
        a: "Bạn có thể nhập các trang cách nhau bằng dấu phẩy và dấu gạch ngang, ví dụ: '1-5, 8, 11-15'. Hệ thống sẽ tự động lọc đúng các trang bạn cần.",
      },
      {
        q: "Khi tách thành nhiều file, tôi có phải tải từng file một không?",
        a: "Không! PDF Pro tự động đóng gói tất cả các file đã tách thành một file .ZIP duy nhất để bạn tải về chỉ với 1 cú click chuột.",
      },
    ],
    relatedSlugs: ["ghep-file-pdf", "xoa-trang-pdf", "trich-xuat-trang-pdf", "sap-xep-trang-pdf"],
    keywords: ["tách pdf", "tach file pdf", "chia nhỏ file pdf", "split pdf", "cắt file pdf"],
  },
  {
    slug: "xoay-pdf",
    title: "Xoay file PDF - Xoay trang PDF 90, 180, 270 độ vĩnh viễn",
    shortTitle: "Xoay PDF",
    description: "Xoay chiều các trang PDF bị ngược hoặc nằm ngang chuẩn 90°, 180° hoặc 270°. Xem trước trực quan và lưu lại góc xoay vĩnh viễn.",
    category: "co-ban",
    iconName: "RotateCw",
    badge: "Nhanh gọn",
    color: "from-blue-500 to-indigo-600",
    accept: ".pdf",
    multiple: false,
    steps: [
      { title: "Bước 1: Chọn tài liệu PDF", desc: "Kéo thả file PDF cần xoay chiều vào trình duyệt." },
      { title: "Bước 2: Chọn góc xoay", desc: "Xoay từng trang cụ thể bằng nút xoay trên thumbnail hoặc xoay toàn bộ tài liệu cùng lúc." },
      { title: "Bước 3: Lưu và Tải về", desc: "Bấm 'Lưu file đã xoay' để tải tài liệu PDF với chiều đọc chính xác." },
    ],
    features: [
      "Xoay từng trang riêng biệt hoặc xoay tất cả các trang cùng lúc",
      "Xem trước thumbnail trực quan tức thì",
      "Góc xoay được lưu cố định vào file PDF gốc",
      "Hoàn toàn miễn phí, không chèn watermark quảng cáo vào file",
    ],
    faqs: [
      {
        q: "Góc xoay có được lưu vĩnh viễn khi mở trên điện thoại hay in ấn không?",
        a: "Có! Thuật toán cập nhật trực tiếp metadata góc quay chuẩn của PDF, hiển thị đúng trên mọi phần mềm đọc PDF và máy in.",
      },
    ],
    relatedSlugs: ["sap-xep-trang-pdf", "xoa-trang-pdf", "ghep-file-pdf"],
    keywords: ["xoay pdf", "xoay trang pdf", "rotate pdf", "chỉnh hướng pdf", "xoay pdf 90 do"],
  },
  {
    slug: "xoa-trang-pdf",
    title: "Xóa trang PDF - Bỏ các trang thừa trong tài liệu PDF",
    shortTitle: "Xóa trang PDF",
    description: "Xóa bỏ các trang trắng, trang thừa hoặc nội dung không cần thiết trong file PDF. Thao tác chọn trang trực quan trên lưới thumbnail.",
    category: "co-ban",
    iconName: "Trash2",
    badge: "Tiện dụng",
    color: "from-red-500 to-pink-600",
    accept: ".pdf",
    multiple: false,
    steps: [
      { title: "Bước 1: Tải lên file PDF", desc: "Kéo thả tài liệu PDF cần lược bỏ trang vào khung." },
      { title: "Bước 2: Chọn các trang muốn xóa", desc: "Click vào biểu tượng thùng rác trên từng trang thumbnail hoặc chọn nhiều trang cùng lúc." },
      { title: "Bước 3: Xuất file PDF sạch", desc: "Bấm 'Xóa trang đã chọn' để tạo file PDF mới chỉ chứa các trang bạn muốn giữ lại." },
    ],
    features: [
      "Xem trước toàn bộ các trang với hình thu nhỏ sắc nét",
      "Khóa an toàn: Ngăn chặn thao tác vô tình xóa hết toàn bộ trang",
      "Thao tác 1 chạm tiện lợi trên cả điện thoại và máy tính",
    ],
    faqs: [
      {
        q: "Tôi có thể khôi phục lại trang vừa xóa trước khi tải về không?",
        a: "Có! Bạn chỉ cần click lại vào trang đó để bỏ chọn xóa bất cứ lúc nào trước khi bấm Xuất file.",
      },
    ],
    relatedSlugs: ["sap-xep-trang-pdf", "tach-file-pdf", "trich-xuat-trang-pdf"],
    keywords: ["xóa trang pdf", "xoa trang pdf", "delete pdf pages", "bỏ trang thừa pdf", "lọc trang pdf"],
  },
  {
    slug: "sap-xep-trang-pdf",
    title: "Sắp xếp trang PDF - Đổi thứ tự trang PDF kéo thả trực quan",
    shortTitle: "Sắp xếp trang",
    description: "Kéo thả để sắp xếp lại vị trí các trang trong tài liệu PDF theo đúng trình tự mong muốn. Có nút đảo ngược thứ tự toàn bộ trang chỉ với 1 click.",
    category: "co-ban",
    iconName: "ArrowUpDown",
    badge: "Trực quan",
    color: "from-cyan-500 to-blue-600",
    accept: ".pdf",
    multiple: false,
    steps: [
      { title: "Bước 1: Nạp tài liệu PDF", desc: "Chọn file PDF từ máy tính hoặc điện thoại của bạn." },
      { title: "Bước 2: Kéo thả các trang", desc: "Dùng chuột hoặc ngón tay chạm giữ để di chuyển các trang đến vị trí mới, hoặc bấm 'Đảo ngược thứ tự'." },
      { title: "Bước 3: Tải file đã xếp", desc: "Bấm 'Lưu thứ tự mới' để tải về tài liệu đã được sắp xếp hoàn chỉnh." },
    ],
    features: [
      "Giao diện kéo thả mượt mà với dnd-kit chuẩn quốc tế",
      "Nút bấm đảo ngược thứ tự trang từ cuối lên đầu siêu nhanh",
      "Hiển thị số thứ tự cũ và mới rõ ràng",
    ],
    faqs: [
      {
        q: "Tính năng đảo ngược thứ tự trang dùng khi nào?",
        a: "Rất hữu ích khi bạn quét tài liệu 2 mặt hoặc máy scan nạp giấy ngược từ trang cuối lên trang đầu.",
      },
    ],
    relatedSlugs: ["xoay-pdf", "xoa-trang-pdf", "ghep-file-pdf"],
    keywords: ["sắp xếp trang pdf", "đổi thứ tự trang pdf", "reorder pdf pages", "đảo ngược trang pdf"],
  },
  {
    slug: "trich-xuat-trang-pdf",
    title: "Trích xuất trang PDF - Chọn và lưu các trang cần thiết",
    shortTitle: "Trích xuất trang",
    description: "Chọn một hoặc nhiều trang quan trọng trong file PDF lớn để tạo thành một tài liệu PDF mới gọn nhẹ chỉ chứa những trang bạn cần.",
    category: "co-ban",
    iconName: "FileCheck",
    badge: "Chính xác",
    color: "from-emerald-500 to-teal-600",
    accept: ".pdf",
    multiple: false,
    steps: [
      { title: "Bước 1: Chọn file PDF", desc: "Tải tài liệu PDF của bạn vào công cụ." },
      { title: "Bước 2: Chọn các trang cần trích", desc: "Click chọn các trang bạn muốn giữ lại trong tài liệu mới." },
      { title: "Bước 3: Tải file PDF trích xuất", desc: "Bấm 'Trích xuất' để tải về ngay file PDF đã lọc." },
    ],
    features: [
      "Chọn trang tự do bằng cách click vào thumbnail",
      "Giữ nguyên 100% chất lượng văn bản và hình ảnh gốc",
      "Xem trước chi tiết từng trang",
    ],
    faqs: [
      {
        q: "Trích xuất trang khác gì với Tách PDF?",
        a: "Trích xuất giúp bạn chọn tự do những trang bất kỳ thành 1 file mới duy nhất, trong khi Tách PDF thường chia toàn bộ file thành nhiều phần.",
      },
    ],
    relatedSlugs: ["tach-file-pdf", "xoa-trang-pdf", "ghep-file-pdf"],
    keywords: ["trích xuất trang pdf", "trich xuat pdf", "extract pdf pages", "lấy trang pdf"],
  },
  {
    slug: "anh-sang-pdf",
    title: "Chuyển ảnh sang PDF - Đổi JPG, PNG, WebP sang PDF trực tuyến",
    shortTitle: "Ảnh sang PDF",
    description: "Chuyển đổi hình ảnh JPG, PNG, WebP thành tài liệu PDF chất lượng cao. Tùy chỉnh khổ giấy A4/Letter, hướng giấy và lề trang linh hoạt.",
    category: "chuyen-doi",
    iconName: "Image",
    badge: "Rất phổ biến",
    color: "from-purple-500 to-pink-600",
    accept: "image/*",
    multiple: true,
    steps: [
      { title: "Bước 1: Chọn các bức ảnh", desc: "Chọn hoặc kéo thả một hoặc nhiều ảnh (JPG, PNG, WebP) vào khung làm việc." },
      { title: "Bước 2: Tùy chỉnh trang", desc: "Chọn khổ giấy (A4, Letter, Khớp với ảnh), hướng giấy và độ rộng lề trang." },
      { title: "Bước 3: Chuyển đổi và Tải PDF", desc: "Bấm 'Tạo file PDF' để tải về tài liệu chứa toàn bộ ảnh của bạn." },
    ],
    features: [
      "Hỗ trợ định dạng JPG, PNG, WebP",
      "Tự động xử lý đúng chiều xoay ảnh EXIF từ điện thoại",
      "Tùy chọn khổ giấy A4, Letter hoặc vừa khít theo kích thước ảnh gốc",
      "Tự động tối ưu dung lượng ảnh chống tràn bộ nhớ máy",
    ],
    faqs: [
      {
        q: "Ảnh chụp từ iPhone dọc có bị xoay ngang khi sang PDF không?",
        a: "Không! PDF Pro tự động đọc thẻ EXIF của ảnh để căn đúng chiều thẳng đứng như khi bạn chụp trên điện thoại.",
      },
    ],
    relatedSlugs: ["pdf-sang-anh", "ghep-file-pdf", "nen-file-pdf"],
    keywords: ["chuyển ảnh sang pdf", "jpg sang pdf", "png sang pdf", "image to pdf", "đổi ảnh thành pdf"],
  },
  {
    slug: "pdf-sang-anh",
    title: "Chuyển PDF sang ảnh - Xuất file PDF thành JPG, PNG độ nét cao",
    shortTitle: "PDF sang ảnh",
    description: "Chuyển đổi từng trang PDF thành hình ảnh JPG hoặc PNG sắc nét với độ phân giải 72, 150 hoặc 300 DPI. Tải ảnh riêng lẻ hoặc toàn bộ qua file ZIP.",
    category: "chuyen-doi",
    iconName: "FileImage",
    badge: "Sắc nét",
    color: "from-violet-500 to-purple-600",
    accept: ".pdf",
    multiple: false,
    steps: [
      { title: "Bước 1: Chọn file PDF", desc: "Kéo thả tài liệu PDF bạn cần xuất ảnh vào công cụ." },
      { title: "Bước 2: Chọn định dạng và độ nét", desc: "Chọn xuất ảnh JPG hay PNG, chọn độ phân giải chuẩn 72 DPI, 150 DPI hoặc siêu nét 300 DPI." },
      { title: "Bước 3: Tải về ảnh", desc: "Bấm 'Xuất ảnh' để tải về ảnh đơn lẻ hoặc file nén ZIP chứa tất cả các trang." },
    ],
    features: [
      "Hỗ trợ xuất định dạng JPG (nhẹ) và PNG (trong suốt, sắc nét)",
      "3 mức độ phân giải: 72 DPI (Web), 150 DPI (Đọc văn bản), 300 DPI (In ấn)",
      "Bảo vệ tràn RAM canvas trên các thiết bị iOS và Android",
      "Tải về nhanh chóng trọn bộ qua file ZIP",
    ],
    faqs: [
      {
        q: "Nên chọn định dạng JPG hay PNG?",
        a: "Nếu bạn muốn file ảnh nhẹ để gửi qua Zalo/Email, hãy chọn JPG. Nếu bạn cần giữ nét chữ và đồ họa nguyên bản, hãy chọn PNG.",
      },
    ],
    relatedSlugs: ["anh-sang-pdf", "pdf-sang-van-ban", "trich-xuat-trang-pdf"],
    keywords: ["pdf sang ảnh", "chuyển pdf sang jpg", "pdf sang png", "pdf to image", "xuất ảnh từ pdf"],
  },
  {
    slug: "nen-file-pdf",
    title: "Nén PDF - Giảm dung lượng file PDF trực tuyến miễn phí",
    shortTitle: "Nén PDF",
    description: "Giảm dung lượng file PDF siêu nhanh để gửi email, nộp hồ sơ mà vẫn giữ chất lượng dễ đọc. An toàn tuyệt đối không tải file lên server.",
    category: "bao-mat",
    iconName: "Minimize2",
    badge: "Cần thiết",
    color: "from-emerald-500 to-green-600",
    accept: ".pdf",
    multiple: false,
    steps: [
      { title: "Bước 1: Chọn file PDF cần nén", desc: "Kéo thả tài liệu PDF có dung lượng lớn vào khung." },
      { title: "Bước 2: Chọn mức độ nén", desc: "Chọn mức Nén Nhẹ (ưu tiên nét), Nén Vừa (khuyên dùng) hoặc Nén Mạnh (dung lượng siêu nhỏ)." },
      { title: "Bước 3: Tải file đã nén", desc: "Xem tỉ lệ dung lượng đã giảm và bấm 'Tải xuống' file PDF tối ưu." },
    ],
    features: [
      "3 chế độ nén thông minh: Nhẹ, Vừa, Mạnh",
      "So sánh kích thước file trước và sau khi nén trực quan",
      "Tự động giữ nguyên file gốc nếu file đã quá tối ưu",
      "Xử lý trực tiếp trên máy tính giúp nén bảo mật tuyệt đối",
    ],
    faqs: [
      {
        q: "Nén file PDF trên trình duyệt có làm hỏng văn bản không?",
        a: "Không! Thuật toán tái tạo thông minh giúp nội dung văn bản và hình ảnh vẫn hiển thị rõ ràng, dễ đọc trên mọi thiết bị.",
      },
    ],
    relatedSlugs: ["ghep-file-pdf", "tach-file-pdf", "pdf-sang-anh"],
    keywords: ["nén pdf", "giảm dung lượng pdf", "compress pdf", "thu nhỏ file pdf", "nén pdf gửi mail"],
  },
  {
    slug: "chen-so-trang",
    title: "Đánh số trang PDF - Chèn số thứ tự trang PDF theo ý muốn",
    shortTitle: "Chèn số trang",
    description: "Thêm số trang vào tài liệu PDF dễ dàng. Tùy chọn 6 vị trí hiển thị, định dạng trang (1, Trang 1, 1/10), font chữ và bỏ qua trang bìa đầu tiên.",
    category: "chinh-sua",
    iconName: "ListOrdered",
    badge: "Hồ sơ & Luận văn",
    color: "from-indigo-500 to-blue-600",
    accept: ".pdf",
    multiple: false,
    steps: [
      { title: "Bước 1: Chọn tài liệu PDF", desc: "Tải file PDF cần đánh số trang lên công cụ." },
      { title: "Bước 2: Tùy chỉnh vị trí & định dạng", desc: "Chọn vị trí (trên/dưới × trái/giữa/phải), kiểu số (1, Trang 1, 1/N) và chọn bỏ qua trang bìa nếu cần." },
      { title: "Bước 3: Xuất và Tải file", desc: "Bấm 'Đánh số trang' để tải về tài liệu đã được đánh số chuyên nghiệp." },
    ],
    features: [
      "6 vị trí linh hoạt ở đầu trang hoặc chân trang",
      "4 kiểu định dạng hiển thị số trang phổ biến",
      "Tùy chọn bỏ qua trang bìa đầu tiên cho bài báo cáo, khóa luận",
      "Tùy chỉnh số bắt đầu và kích thước chữ",
    ],
    faqs: [
      {
        q: "Tôi có thể bỏ qua trang bìa đầu tiên khi đánh số không?",
        a: "Hoàn toàn được! Bạn chỉ cần tích chọn ô 'Bỏ qua trang bìa', hệ thống sẽ bắt đầu đánh số từ trang thứ 2 trở đi.",
      },
    ],
    relatedSlugs: ["them-watermark", "ghep-file-pdf", "xoay-pdf"],
    keywords: ["đánh số trang pdf", "chèn số trang pdf", "page number pdf", "thêm số thứ tự pdf"],
  },
  {
    slug: "them-watermark",
    title: "Thêm Watermark PDF - Đóng dấu bản quyền tài liệu PDF",
    shortTitle: "Thêm Watermark",
    description: "Chèn dấu bản quyền dạng văn bản hoặc logo hình ảnh mờ lên tài liệu PDF để chống sao chép và khẳng định quyền tác giả.",
    category: "chinh-sua",
    iconName: "Stamp",
    badge: "Bản quyền",
    color: "from-fuchsia-500 to-rose-600",
    accept: ".pdf",
    multiple: false,
    steps: [
      { title: "Bước 1: Nạp file PDF", desc: "Tải file tài liệu PDF cần đóng dấu bản quyền." },
      { title: "Bước 2: Thiết lập dấu bản quyền", desc: "Nhập nội dung chữ hoặc tải logo ảnh, chỉnh độ mờ (opacity), góc nghiêng và chế độ đóng dấu giữa/lát gạch." },
      { title: "Bước 3: Tải file đã đóng dấu", desc: "Bấm 'Chèn Watermark' để lưu tài liệu có dấu bảo hộ." },
    ],
    features: [
      "Hỗ trợ cả đóng dấu văn bản (Text) và đóng dấu ảnh logo (PNG/JPG)",
      "Tùy chỉnh độ trong suốt, màu sắc, cỡ chữ và góc xoay nghiêng",
      "Chế độ đóng dấu ở chính giữa hoặc lát gạch toàn bộ trang",
      "Không làm thay đổi cấu trúc chữ gốc của tài liệu",
    ],
    faqs: [
      {
        q: "Người khác có thể xóa watermark này được không?",
        a: "Watermark được vẽ trực tiếp vào lớp đồ họa PDF, giúp bảo vệ tài liệu an toàn khi chia sẻ trên mạng.",
      },
    ],
    relatedSlugs: ["chen-so-trang", "nen-file-pdf", "ghep-file-pdf"],
    keywords: ["watermark pdf", "đóng dấu pdf", "chèn logo vào pdf", "bảo vệ bản quyền pdf"],
  },
  {
    slug: "pdf-sang-van-ban",
    title: "Chuyển PDF sang Text - Trích xuất văn bản từ PDF trực tuyến",
    shortTitle: "PDF sang Text",
    description: "Đọc và trích xuất toàn bộ văn bản từ file PDF sang định dạng .TXT thuần túy. Hỗ trợ tiếng Việt có dấu chuẩn Unicode 100%.",
    category: "chuyen-doi",
    iconName: "FileText",
    badge: "Unicode",
    color: "from-slate-600 to-gray-700",
    accept: ".pdf",
    multiple: false,
    steps: [
      { title: "Bước 1: Chọn file PDF", desc: "Tải tài liệu PDF chứa văn bản vào công cụ." },
      { title: "Bước 2: Đọc và trích xuất", desc: "Trình duyệt tự động quét các lớp văn bản của từng trang." },
      { title: "Bước 3: Sao chép hoặc Tải file .txt", desc: "Xem trước nội dung văn bản trên màn hình, sao chép hoặc tải file .txt về máy." },
    ],
    features: [
      "Trích xuất nhanh toàn bộ nội dung chữ tiếng Việt có dấu",
      "Giữ nguyên phân đoạn từng trang rõ ràng",
      "Cảnh báo thông minh nếu file là bản scan hình ảnh không có text layer",
    ],
    faqs: [
      {
        q: "Tại sao một số file PDF không trích xuất được chữ?",
        a: "Nếu file PDF của bạn được tạo từ máy ảnh chụp hoặc scan dạng ảnh, file sẽ không có lớp văn bản số. Bạn có thể sử dụng công cụ OCR để nhận diện chữ.",
      },
    ],
    relatedSlugs: ["pdf-sang-anh", "trich-xuat-trang-pdf"],
    keywords: ["pdf sang text", "chuyển pdf sang txt", "trích xuất chữ pdf", "copy chữ từ pdf"],
  },
];

export function getToolBySlug(slug: string): ToolRegistryItem | undefined {
  return toolsRegistry.find((t) => t.slug === slug);
}
