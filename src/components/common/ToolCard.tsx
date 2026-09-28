import Link from "next/link";
import {
  Combine,
  Split,
  RotateCw,
  Trash2,
  ArrowUpDown,
  FileCheck,
  Image as ImageIcon,
  FileImage,
  Minimize2,
  ListOrdered,
  Stamp,
  FileText,
  LucideIcon,
  ArrowRight,
} from "lucide-react";
import { ToolRegistryItem } from "@/lib/tools";

const iconMap: Record<string, LucideIcon> = {
  Combine,
  Split,
  RotateCw,
  Trash2,
  ArrowUpDown,
  FileCheck,
  Image: ImageIcon,
  FileImage,
  Minimize2,
  ListOrdered,
  Stamp,
  FileText,
};

export function ToolCard({ tool }: { tool: ToolRegistryItem }) {
  const Icon = iconMap[tool.iconName] || FileText;

  return (
    <Link
      href={`/${tool.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-500/5"
    >
      <div>
        {/* Top bar with Icon & Badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${tool.color} text-white shadow-md shadow-rose-500/20 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="h-6 w-6" />
          </div>
          {tool.badge && (
            <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600 border border-rose-100">
              {tool.badge}
            </span>
          )}
        </div>

        {/* Title and description */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
          {tool.shortTitle}
        </h3>
        <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Action link */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-rose-600">
        <span>Sử dụng ngay</span>
        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
