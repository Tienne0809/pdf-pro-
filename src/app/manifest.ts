import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PDF Pro - Bộ công cụ PDF Miễn Phí & Bảo Mật 100%",
    short_name: "PDF Pro",
    description: "Xử lý PDF 100% trên trình duyệt. Không tải file lên máy chủ.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#E11D48",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
