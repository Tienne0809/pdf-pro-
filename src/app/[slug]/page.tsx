import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { toolsRegistry, getToolBySlug } from "@/lib/tools";
import { siteConfig } from "@/config/site";
import { ToolDispatcher } from "@/components/tools/ToolDispatcher";
import { PrivacyBadge } from "@/components/common/PrivacyBadge";
import { AdSlot } from "@/components/common/AdSlot";
import { AffiliateBox } from "@/components/common/AffiliateBox";
import { ToolCard } from "@/components/common/ToolCard";

export async function generateStaticParams() {
  return toolsRegistry.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return {
      title: "Công cụ không tìm thấy | " + siteConfig.name,
    };
  }

  return {
    title: `${tool.title} | ${siteConfig.name}`,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: `${siteConfig.url}/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.title} | ${siteConfig.name}`,
      description: tool.description,
      url: `${siteConfig.url}/${tool.slug}`,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
    },
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const relatedTools = toolsRegistry.filter((t) =>
    tool.relatedSlugs.includes(t.slug)
  );

  // JSON-LD Structured Data (SoftwareApplication + FAQPage)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.title,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web Browser",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "VND",
        },
        description: tool.description,
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/80 via-white to-slate-50/50 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <Link href="/tat-ca-cong-cu" className="hover:text-rose-600 transition-colors">
            Công cụ
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate">{tool.shortTitle}</span>
        </nav>

        {/* Hero Title & Privacy Promise */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <PrivacyBadge />

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {tool.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Working Area / Interactive Tool Component */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/40">
          <ToolDispatcher slug={tool.slug} />
        </div>

        {/* Ad Slot (Compliant banner below action) */}
        <AdSlot slotId={`tool-${tool.slug}-mid`} format="horizontal" />

        {/* Step by Step Guide & Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Steps */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <BookOpen className="h-5 w-5 text-rose-600" />
              <span>Cách sử dụng {tool.shortTitle}</span>
            </div>

            <div className="space-y-4">
              {tool.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-xs font-bold text-rose-600 border border-rose-100">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span>Tính năng nổi bật</span>
            </div>

            <ul className="space-y-3">
              {tool.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Affiliate Recommendations */}
        <AffiliateBox limit={2} />

        {/* FAQ Section */}
        {tool.faqs.length > 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <HelpCircle className="h-5 w-5 text-rose-600" />
              <span>Câu hỏi thường gặp (FAQ)</span>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              {tool.faqs.map((faq, idx) => (
                <div key={idx} className={`${idx > 0 ? "pt-4" : ""}`}>
                  <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Công cụ PDF liên quan</h3>
              <Link
                href="/tat-ca-cong-cu"
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                Xem tất cả &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedTools.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
