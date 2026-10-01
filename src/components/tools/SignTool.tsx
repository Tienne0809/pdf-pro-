"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  PenTool,
  Type,
  Upload,
  Eraser,
  Check,
  ChevronLeft,
  ChevronRight,
  Move,
  RotateCcw,
  Sparkles,
  Download,
  Plus,
  Trash2,
} from "lucide-react";
import { FileDropzone } from "@/components/common/FileDropzone";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ResultCard } from "@/components/common/ResultCard";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { signPdf, SignaturePlacement } from "@/lib/pdf/sign";
import { renderPdfPageToCanvas } from "@/lib/pdf/client";

interface SignToolProps {
  initialFile?: File | null;
}

type SignatureMode = "draw" | "type" | "upload";

interface PlacedSig {
  id: string;
  pageIndex: number;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  widthPercent: number; // 0 to 100
  heightPercent: number; // 0 to 100
  dataUrl: string;
}

export function SignTool({ initialFile }: SignToolProps) {
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(0); // 0-indexed

  // Signature creation mode
  const [sigMode, setSigMode] = useState<SignatureMode>("draw");
  const [penColor, setPenColor] = useState<string>("#1e3a8a"); // Blue ink default
  const [penSize, setPenSize] = useState<number>(3);
  const [typedName, setTypedName] = useState<string>("Nguyễn Văn A");
  const [typedFont, setTypedFont] = useState<string>("font-dancing");

  // Created signatures list
  const [activeSigDataUrl, setActiveSigDataUrl] = useState<string | null>(null);

  // Placed signatures on pages
  const [placedSigs, setPlacedSigs] = useState<PlacedSig[]>([]);
  const [selectedPlacedSigId, setSelectedPlacedSigId] = useState<string | null>(null);

  // Canvas drawing ref
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // PDF Page preview canvas
  const pagePreviewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pageContainerRef = useRef<HTMLDivElement | null>(null);
  const [isRenderingPage, setIsRenderingPage] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle Initial File
  useEffect(() => {
    if (initialFile) {
      setFile(initialFile);
    }
  }, [initialFile]);

  // Load PDF & Render Page Preview
  const renderCurrentPage = useCallback(async () => {
    if (!file || !pagePreviewCanvasRef.current) return;
    try {
      setIsRenderingPage(true);
      const canvas = pagePreviewCanvasRef.current;
      const pdf = await renderPdfPageToCanvas(file, currentPage + 1, canvas, 1.2);
      setTotalPages(pdf.numPages);
    } catch (err: any) {
      console.error("Error rendering PDF page preview:", err);
    } finally {
      setIsRenderingPage(false);
    }
  }, [file, currentPage]);

  useEffect(() => {
    if (file) {
      renderCurrentPage();
    }
  }, [file, currentPage, renderCurrentPage]);

  // Draw Canvas setup & mouse/touch events
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penSize * 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if ("touches" in e) {
      e.preventDefault(); // Prevent scrolling on touch devices while drawing
    }

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = drawCanvasRef.current;
    if (canvas) {
      setActiveSigDataUrl(canvas.toDataURL("image/png"));
    }
  };

  const clearDrawing = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setActiveSigDataUrl(null);
  };

  // Generate typed signature to data URL
  const generateTypedSignature = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = penColor;

    let fontStyle = "italic 48px 'Brush Script MT', cursive, sans-serif";
    if (typedFont === "font-caveat") {
      fontStyle = "italic bold 44px 'Segoe Script', 'Comic Sans MS', cursive";
    } else if (typedFont === "font-greatvibes") {
      fontStyle = "italic 52px 'Lucida Handwriting', 'Apple Chancery', cursive";
    }

    ctx.font = fontStyle;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(typedName || "Chữ ký mẫu", canvas.width / 2, canvas.height / 2);

    setActiveSigDataUrl(canvas.toDataURL("image/png"));
  }, [typedName, typedFont, penColor]);

  useEffect(() => {
    if (sigMode === "type") {
      generateTypedSignature();
    }
  }, [sigMode, typedName, typedFont, penColor, generateTypedSignature]);

  // Handle Image Upload Signature
  const handleSignatureImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setActiveSigDataUrl(dataUrl);
      }
    };
    reader.readAsDataURL(uploadedFile);
  };

  // Add signature to current page
  const handleAddSignatureToPage = () => {
    if (!activeSigDataUrl) return;

    const newSig: PlacedSig = {
      id: "sig_" + Date.now(),
      pageIndex: currentPage,
      xPercent: 35, // default center-ish
      yPercent: 70, // default lower third
      widthPercent: 28,
      heightPercent: 12,
      dataUrl: activeSigDataUrl,
    };

    setPlacedSigs((prev) => [...prev, newSig]);
    setSelectedPlacedSigId(newSig.id);
  };

  // Remove a placed signature
  const handleRemovePlacedSig = (id: string) => {
    setPlacedSigs((prev) => prev.filter((s) => s.id !== id));
    if (selectedPlacedSigId === id) {
      setSelectedPlacedSigId(null);
    }
  };

  // Dragging placed signature
  const [dragState, setDragState] = useState<{
    sigId: string;
    startX: number;
    startY: number;
    origXPercent: number;
    origYPercent: number;
  } | null>(null);

  const handlePointerDownSig = (e: React.PointerEvent, sig: PlacedSig) => {
    e.stopPropagation();
    setSelectedPlacedSigId(sig.id);
    setDragState({
      sigId: sig.id,
      startX: e.clientX,
      startY: e.clientY,
      origXPercent: sig.xPercent,
      origYPercent: sig.yPercent,
    });
  };

  const handlePointerMoveContainer = (e: React.PointerEvent) => {
    if (!dragState || !pageContainerRef.current) return;
    const rect = pageContainerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragState.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragState.startY) / rect.height) * 100;

    setPlacedSigs((prev) =>
      prev.map((s) => {
        if (s.id !== dragState.sigId) return s;
        const newX = Math.max(0, Math.min(100 - s.widthPercent, dragState.origXPercent + deltaX));
        const newY = Math.max(0, Math.min(100 - s.heightPercent, dragState.origYPercent + deltaY));
        return { ...s, xPercent: newX, yPercent: newY };
      })
    );
  };

  const handlePointerUpContainer = () => {
    setDragState(null);
  };

  // Process signing PDF
  const handleSignPdf = async () => {
    if (!file) return;
    if (placedSigs.length === 0) {
      setErrorMessage("Vui lòng chèn ít nhất một chữ ký lên trang tài liệu trước khi xuất file!");
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const placements: SignaturePlacement[] = placedSigs.map((s) => ({
        pageIndex: s.pageIndex,
        xPercent: s.xPercent / 100,
        yPercent: s.yPercent / 100,
        widthPercent: s.widthPercent / 100,
        heightPercent: s.heightPercent / 100,
        signatureDataUrl: s.dataUrl,
      }));

      const blob = await signPdf(file, placements, (percent, msg) => {
        setProgress(percent);
        setProgressMessage(msg);
      });

      setResultBlob(blob);
    } catch (err: any) {
      console.error("Signing error:", err);
      setErrorMessage(err?.message || "Đã xảy ra lỗi khi gắn chữ ký vào PDF. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPlacedSigs([]);
    setSelectedPlacedSigId(null);
    setActiveSigDataUrl(null);
    setResultBlob(null);
    setErrorMessage(null);
  };

  if (resultBlob && file) {
    return (
      <ResultCard
        blob={resultBlob}
        fileName={file.name.replace(/\.pdf$/i, "") + "_signed.pdf"}
        originalSize={file.size}
        onReset={resetAll}
      />
    );
  }

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          accept=".pdf"
          multiple={false}
          onFilesSelected={(files) => {
            if (files[0]) {
              setFile(files[0]);
              setCurrentPage(0);
              setPlacedSigs([]);
            }
          }}
          title="Tải file PDF cần ký tên"
          subtitle="Hỗ trợ file hợp đồng, đơn từ, hồ sơ PDF. Xử lý 100% nội bộ trên trình duyệt của bạn."
        />
      ) : (
        <div className="space-y-6">
          {/* Top Bar info */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm font-bold text-xs">
                PDF
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h4>
                <p className="text-xs text-slate-500">
                  Tổng số: {totalPages} trang &bull; Đã chèn {placedSigs.length} chữ ký
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetAll}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Chọn file khác
            </button>
          </div>

          {/* Main 2-Column Work Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Create Signature (4 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <PenTool className="h-4 w-4 text-rose-600" />
                  1. Tạo chữ ký của bạn
                </h3>

                {/* Mode Tabs */}
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setSigMode("draw")}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                      sigMode === "draw" ? "bg-white text-rose-600 shadow-sm font-bold" : "hover:text-slate-900"
                    }`}
                  >
                    <PenTool className="h-3.5 w-3.5" />
                    Vẽ tay
                  </button>
                  <button
                    type="button"
                    onClick={() => setSigMode("type")}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                      sigMode === "type" ? "bg-white text-rose-600 shadow-sm font-bold" : "hover:text-slate-900"
                    }`}
                  >
                    <Type className="h-3.5 w-3.5" />
                    Gõ tên
                  </button>
                  <button
                    type="button"
                    onClick={() => setSigMode("upload")}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                      sigMode === "upload" ? "bg-white text-rose-600 shadow-sm font-bold" : "hover:text-slate-900"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Tải ảnh
                  </button>
                </div>

                {/* Color Selector */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-slate-500">Màu mực chữ ký:</span>
                  <div className="flex items-center gap-2">
                    {[
                      { label: "Mực xanh", color: "#1e3a8a" },
                      { label: "Mực đen", color: "#0f172a" },
                      { label: "Mực đỏ", color: "#dc2626" },
                    ].map((c) => (
                      <button
                        key={c.color}
                        type="button"
                        onClick={() => setPenColor(c.color)}
                        className={`h-7 w-7 rounded-full border-2 transition-transform ${
                          penColor === c.color ? "scale-110 border-slate-900 shadow-sm" : "border-white hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.color }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                {/* DRAW MODE */}
                {sigMode === "draw" && (
                  <div className="space-y-3">
                    <div className="relative rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden cursor-crosshair">
                      <canvas
                        ref={drawCanvasRef}
                        width={400}
                        height={180}
                        className="w-full h-44 touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                      {!hasDrawn && (
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs gap-1">
                          <PenTool className="h-5 w-5 opacity-40" />
                          <span>Dùng chuột hoặc ngón tay để vẽ chữ ký vào đây</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <span>Nét bút:</span>
                        {[2, 3, 5].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setPenSize(size)}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              penSize === size ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {size === 2 ? "Mảnh" : size === 3 ? "Vừa" : "Đậm"}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={clearDrawing}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Eraser className="h-3.5 w-3.5" />
                        Xóa vẽ lại
                      </button>
                    </div>
                  </div>
                )}

                {/* TYPE MODE */}
                {sigMode === "type" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nhập họ tên đầy đủ:
                      </label>
                      <input
                        type="text"
                        value={typedName}
                        onChange={(e) => setTypedName(e.target.value)}
                        placeholder="Ví dụ: Nguyễn Văn An"
                        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Chọn kiểu chữ ký nghệ thuật:
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: "font-dancing", label: "Kiểu Cursive Thư Pháp" },
                          { id: "font-caveat", label: "Kiểu Viết Tay Tự Nhiên" },
                          { id: "font-greatvibes", label: "Kiểu Ký Doanh Nhân" },
                        ].map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setTypedFont(f.id)}
                            className={`p-2 rounded-xl border text-left text-xs transition-all ${
                              typedFont === f.id
                                ? "border-rose-500 bg-rose-50/50 font-bold text-rose-900 ring-1 ring-rose-500"
                                : "border-slate-200 hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* UPLOAD MODE */}
                {sigMode === "upload" && (
                  <div className="space-y-3">
                    <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-slate-300 hover:border-rose-400 bg-slate-50/60 hover:bg-rose-50/30 cursor-pointer transition-colors text-center">
                      <Upload className="h-6 w-6 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-700">
                        Bấm để tải ảnh chữ ký hoặc con dấu PNG
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Khuyên dùng ảnh nền trong suốt (Transparent PNG)
                      </span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={handleSignatureImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Add to Page Button */}
                <button
                  type="button"
                  onClick={handleAddSignatureToPage}
                  disabled={!activeSigDataUrl}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Chèn chữ ký này vào Trang {currentPage + 1}
                </button>
              </div>

              {/* Placed signatures list & sizes */}
              {placedSigs.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span>Chữ ký đã chèn ({placedSigs.length})</span>
                    <span className="text-[10px] text-slate-400 font-normal">Kéo thả trên trang để căn chỉnh</span>
                  </h4>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {placedSigs.map((s, idx) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setSelectedPlacedSigId(s.id);
                          if (s.pageIndex !== currentPage) {
                            setCurrentPage(s.pageIndex);
                          }
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                          selectedPlacedSigId === s.id
                            ? "border-rose-500 bg-rose-50/60 ring-1 ring-rose-500 font-semibold"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-700">
                            {idx + 1}
                          </span>
                          <span>Trang {s.pageIndex + 1}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePlacedSig(s.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Xóa chữ ký này"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Size slider for selected sig */}
                  {selectedPlacedSigId && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>Kích thước chữ ký:</span>
                        <span className="font-bold">
                          {placedSigs.find((s) => s.id === selectedPlacedSigId)?.widthPercent.toFixed(0)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="60"
                        value={placedSigs.find((s) => s.id === selectedPlacedSigId)?.widthPercent || 28}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPlacedSigs((prev) =>
                            prev.map((s) => {
                              if (s.id !== selectedPlacedSigId) return s;
                              return {
                                ...s,
                                widthPercent: val,
                                heightPercent: Math.round(val * 0.45),
                              };
                            })
                          );
                        }}
                        className="w-full accent-rose-600"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: PDF Visual Viewer with Draggable Signature (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                {/* Page Navigation header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>2. Vị trí chữ ký trên trang</span>
                    <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                      Trang {currentPage + 1} / {totalPages}
                    </span>
                  </h3>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={currentPage === totalPages - 1}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* PDF Page Container with Overlaid Signature */}
                <div
                  ref={pageContainerRef}
                  onPointerMove={handlePointerMoveContainer}
                  onPointerUp={handlePointerUpContainer}
                  className="relative mx-auto rounded-xl border border-slate-300 shadow-md bg-white overflow-hidden select-none"
                  style={{ maxWidth: "520px" }}
                >
                  <canvas ref={pagePreviewCanvasRef} className="w-full h-auto block" />

                  {isRenderingPage && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center text-xs font-semibold text-slate-600">
                      Đang tải trang PDF...
                    </div>
                  )}

                  {/* Render signatures belonging to this page */}
                  {placedSigs
                    .filter((s) => s.pageIndex === currentPage)
                    .map((s) => (
                      <div
                        key={s.id}
                        onPointerDown={(e) => handlePointerDownSig(e, s)}
                        style={{
                          left: `${s.xPercent}%`,
                          top: `${s.yPercent}%`,
                          width: `${s.widthPercent}%`,
                          height: `${s.heightPercent}%`,
                        }}
                        className={`absolute cursor-grab active:cursor-grabbing border-2 rounded-lg transition-all p-1 flex items-center justify-center group ${
                          selectedPlacedSigId === s.id
                            ? "border-rose-600 bg-rose-500/10 ring-2 ring-rose-500/30"
                            : "border-blue-500/80 bg-blue-500/10 hover:border-rose-500"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.dataUrl}
                          alt="Signature"
                          className="max-w-full max-h-full object-contain pointer-events-none"
                        />

                        {/* Move handle */}
                        <div className="absolute -top-3 -right-3 hidden group-hover:flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-white shadow-md">
                          <Move className="h-3 w-3" />
                        </div>
                      </div>
                    ))}
                </div>

                <p className="text-center text-xs text-slate-400">
                  💡 Bạn có thể dùng chuột/tay kéo trực tiếp khung chữ ký đến vị trí cần đóng dấu.
                </p>

                {/* Error Banner */}
                {errorMessage && (
                  <ErrorMessage
                    message={errorMessage}
                    onRetry={() => setErrorMessage(null)}
                    onReset={resetAll}
                  />
                )}

                {/* Sign & Export Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSignPdf}
                    disabled={isProcessing || placedSigs.length === 0}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-base shadow-lg shadow-rose-600/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Ký tên & Xuất file PDF hoàn tất
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <ProgressBar
              progress={progress}
              message={progressMessage || "Đang chèn chữ ký vào file PDF..."}
            />
          )}
        </div>
      )}
    </div>
  );
}
