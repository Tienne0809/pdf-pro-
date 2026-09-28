export function AdSlot({
  slotId = "default-banner",
  className = "",
  format = "horizontal",
}: {
  slotId?: string;
  className?: string;
  format?: "horizontal" | "rectangle" | "auto";
}) {
  return (
    <div
      className={`relative my-6 w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-center ${className}`}
      id={`ad-slot-${slotId}`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
        QUẢNG CÁO TÀI TRỢ
      </div>

      {/* Ad content placeholder ready for Google AdSense <ins> tag */}
      <div
        className={`mx-auto flex items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm text-xs text-slate-400 font-medium ${
          format === "horizontal"
            ? "min-h-[90px] max-w-[728px]"
            : "min-h-[250px] max-w-[300px]"
        }`}
      >
        <div className="flex flex-col items-center gap-1.5 p-4">
          <span className="text-slate-500 font-semibold">Google AdSense Responsive Slot</span>
          <span className="text-[11px] text-slate-400">
            (Khu vực hiển thị quảng cáo tự động khi tích hợp mã nhà xuất bản)
          </span>
        </div>
      </div>
    </div>
  );
}
