export interface AffiliateProduct {
  id: string;
  title: string;
  category: "van-phong" | "thiet-bi" | "khoa-hoc" | "sach";
  description: string;
  priceEstimate: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  url: string;
  iconName: "Printer" | "HardDrive" | "BookOpen" | "Laptop" | "FileText" | "ShieldCheck";
}

export const affiliateProducts: AffiliateProduct[] = [
  {
    id: "may-in-laser-brother",
    title: "Máy in Laser Đơn Năng Brother HL-L2321D",
    category: "thiet-bi",
    description: "In 2 mặt tự động siêu nhanh, tiết kiệm mực, cực kỳ bền bỉ cho văn phòng & sinh viên in tài liệu PDF.",
    priceEstimate: "2.890.000đ",
    rating: 4.9,
    reviewCount: 1420,
    badge: "Bán chạy nhất",
    url: "https://shopee.vn/search?keyword=brother+hl-l2321d",
    iconName: "Printer",
  },
  {
    id: "o-cung-ssd-di-dong",
    title: "Ổ cứng SSD Di Động Kingston XS1000 1TB",
    category: "thiet-bi",
    description: "Tốc độ đọc 1050MB/s nhỏ gọn như bao diêm, sao lưu và bảo mật hàng triệu tài liệu hồ sơ PDF quan trọng.",
    priceEstimate: "1.790.000đ",
    rating: 4.8,
    reviewCount: 890,
    badge: "Khuyên dùng",
    url: "https://shopee.vn/search?keyword=ssd+kingston+xs1000+1tb",
    iconName: "HardDrive",
  },
  {
    id: "khoa-hoc-tin-hoc-van-phong",
    title: "Khóa học Thành thạo Tin học Văn phòng Excel & Word",
    category: "khoa-hoc",
    description: "Nâng cao năng suất làm việc, tối ưu hóa xử lý bảng biểu biểu mẫu xuất PDF chuyên nghiệp.",
    priceEstimate: "399.000đ",
    rating: 4.9,
    reviewCount: 3200,
    badge: "Phổ biến",
    url: "https://unica.vn",
    iconName: "BookOpen",
  },
  {
    id: "but-ky-kim-loai-cao-cap",
    title: "Bút Ký Kim Loại Cao Cấp Khắc Tên Theo Yêu Cầu",
    category: "van-phong",
    description: "Phụ kiện ký kết hợp đồng, văn bản giấy tờ sang trọng, thích hợp làm quà tặng đồng nghiệp và đối tác.",
    priceEstimate: "189.000đ",
    rating: 4.7,
    reviewCount: 650,
    url: "https://shopee.vn/search?keyword=but+ky+khac+ten",
    iconName: "FileText",
  },
];
