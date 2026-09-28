"use client";

import { useEffect, useState } from "react";
import { getChainedFile } from "@/lib/storage";
import { MergeTool } from "./MergeTool";
import { SplitTool } from "./SplitTool";
import { RotateTool } from "./RotateTool";
import { DeletePagesTool } from "./DeletePagesTool";
import { OrganizeTool } from "./OrganizeTool";
import { ExtractTool } from "./ExtractTool";
import { ImageToPdfTool } from "./ImageToPdfTool";
import { PdfToImageTool } from "./PdfToImageTool";
import { CompressTool } from "./CompressTool";
import { NumberPagesTool } from "./NumberPagesTool";
import { WatermarkTool } from "./WatermarkTool";
import { PdfToTextTool } from "./PdfToTextTool";
import { Clock } from "lucide-react";

export function ToolDispatcher({ slug }: { slug: string }) {
  const [chainedFile, setChainedFile] = useState<File | null>(null);
  const [checkedChaining, setCheckedChaining] = useState(false);

  useEffect(() => {
    getChainedFile()
      .then((file) => {
        if (file) setChainedFile(file);
      })
      .finally(() => {
        setCheckedChaining(true);
      });
  }, [slug]);

  if (!checkedChaining) {
    return (
      <div className="py-16 text-center text-slate-400 text-sm animate-pulse">
        Đang chuẩn bị môi trường xử lý...
      </div>
    );
  }

  switch (slug) {
    case "ghep-file-pdf":
      return <MergeTool initialFile={chainedFile} />;
    case "tach-file-pdf":
      return <SplitTool initialFile={chainedFile} />;
    case "xoay-pdf":
      return <RotateTool initialFile={chainedFile} />;
    case "xoa-trang-pdf":
      return <DeletePagesTool initialFile={chainedFile} />;
    case "sap-xep-trang-pdf":
      return <OrganizeTool initialFile={chainedFile} />;
    case "trich-xuat-trang-pdf":
      return <ExtractTool initialFile={chainedFile} />;
    case "anh-sang-pdf":
      return <ImageToPdfTool />;
    case "pdf-sang-anh":
      return <PdfToImageTool initialFile={chainedFile} />;
    case "nen-file-pdf":
      return <CompressTool initialFile={chainedFile} />;
    case "chen-so-trang":
      return <NumberPagesTool initialFile={chainedFile} />;
    case "them-watermark":
      return <WatermarkTool initialFile={chainedFile} />;
    case "pdf-sang-van-ban":
      return <PdfToTextTool initialFile={chainedFile} />;
    default:
      return (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-sm">
          <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Công cụ đang trong giai đoạn hoàn thiện</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Chúng tôi đang tối ưu hóa thuật toán Client-Side cho tính năng này để đảm bảo trải nghiệm nhanh nhất và bảo mật 100%. Vui lòng quay lại sau!
          </p>
        </div>
      );
  }
}
