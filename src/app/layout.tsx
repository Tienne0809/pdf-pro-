import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { siteConfig } from "@/config/site";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} - Bộ công cụ PDF Miễn Phí, Tiếng Việt & Bảo Mật 100%`,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: `${siteConfig.name} - Bộ công cụ PDF Miễn Phí & Bảo Mật`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "PDF Pro",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/favicon-512x512.png",
        width: 512,
        height: 512,
        alt: "PDF Pro Logo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "jzFsarhZkZnre08MjSB8-1kzLJd2quY6YyFrVZKnS6g",
  },
};

export const viewport: Viewport = {
  themeColor: "#E11D48",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Google WebSite Schema for Site Name & Logo in Google Search results
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PDF Pro",
    alternateName: ["PDFPro", "PDF Pro Việt Nam", "Bộ công cụ PDF Pro"],
    url: siteConfig.url,
  };

  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${beVietnamPro.className} flex min-h-screen flex-col bg-white text-slate-900 antialiased selection:bg-rose-500 selection:text-white`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
