"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  RotateCw,
  Trash2,
  Loader2,
  GripVertical,
  Check,
  Eye,
  X,
} from "lucide-react";
import { loadPdfDocument, renderPageThumbnail } from "@/lib/pdf/client";

export interface ThumbnailItem {
  id: string;
  pageIndex: number; // 0-based
  pageNumber: number; // 1-based
  rotation: number; // 0, 90, 180, 270
  selected: boolean;
  thumbnailUrl?: string;
  sourceFileName?: string;
}

export interface PdfThumbnailGridProps {
  file: File;
  items: ThumbnailItem[];
  onItemsChange: React.Dispatch<React.SetStateAction<ThumbnailItem[]>>;
  allowReorder?: boolean;
  allowRotate?: boolean;
  allowDelete?: boolean;
  allowSelect?: boolean;
  showOldNumber?: boolean;
}

function SortableThumbnailCard({
  item,
  allowReorder,
  allowRotate,
  allowDelete,
  allowSelect,
  onRotate,
  onDelete,
  onToggleSelect,
  onPreview,
}: {
  item: ThumbnailItem;
  allowReorder?: boolean;
  allowRotate?: boolean;
  allowDelete?: boolean;
  allowSelect?: boolean;
  onRotate?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleSelect?: (id: string) => void;
  onPreview?: (url: string, title: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !allowReorder });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col rounded-2xl border bg-white p-2.5 shadow-sm transition-all duration-200 ${
        isDragging
          ? "border-rose-500 shadow-2xl scale-105 opacity-90"
          : item.selected
          ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
      }`}
    >
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-1 mb-2 px-1">
        {/* Page badge */}
        <div className="flex items-center gap-1.5">
          {allowReorder && (
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 rounded touch-none"
              title="Kéo thả để sắp xếp"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          )}
          <span className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
            Trang {item.pageNumber}
          </span>
        </div>

        {/* Checkbox selection */}
        {allowSelect && (
          <button
            type="button"
            onClick={() => onToggleSelect?.(item.id)}
            className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
              item.selected
                ? "bg-rose-600 border-rose-600 text-white"
                : "border-slate-300 bg-white hover:border-slate-400"
            }`}
          >
            {item.selected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </button>
        )}
      </div>

      {/* Thumbnail preview area */}
      <div
        className="relative aspect-[1/1.414] w-full overflow-hidden rounded-xl bg-slate-100 border border-slate-100 flex items-center justify-center cursor-pointer"
        onClick={() => {
          if (item.thumbnailUrl) {
            onPreview?.(item.thumbnailUrl, `Trang ${item.pageNumber}`);
          }
        }}
      >
        {item.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnailUrl}
            alt={`Trang ${item.pageNumber}`}
            className="h-full w-full object-contain transition-transform duration-300"
            style={{
              transform: `rotate(${item.rotation}deg)`,
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
            <span className="text-[10px]">Đang tải...</span>
          </div>
        )}

        {/* Hover preview eye button */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="p-2 rounded-full bg-white/90 text-slate-800 shadow-md">
            <Eye className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Bottom Tool actions */}
      {(allowRotate || allowDelete) && (
        <div className="mt-2.5 flex items-center justify-between gap-1 pt-2 border-t border-slate-100">
          {allowRotate && (
            <button
              type="button"
              onClick={() => onRotate?.(item.id)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Xoay trang 90 độ"
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>Xoay</span>
            </button>
          )}

          {allowDelete && (
            <button
              type="button"
              onClick={() => onDelete?.(item.id)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
              title="Xóa trang này"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Xóa</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function PdfThumbnailGrid({
  file,
  items,
  onItemsChange,
  allowReorder = false,
  allowRotate = false,
  allowDelete = false,
  allowSelect = false,
}: PdfThumbnailGridProps) {
  const [previewModal, setPreviewModal] = useState<{ url: string; title: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Lazy render thumbnails when items change or file loads
  useEffect(() => {
    let isCancelled = false;

    async function loadThumbnails() {
      try {
        const doc = await loadPdfDocument(file);
        for (let i = 0; i < items.length; i++) {
          if (isCancelled) break;
          const itm = items[i];
          if (!itm.thumbnailUrl) {
            const url = await renderPageThumbnail(doc, itm.pageIndex + 1, 0.45, 0);
            if (!isCancelled) {
              onItemsChange((prev) =>
                prev.map((item) => (item.id === itm.id ? { ...item, thumbnailUrl: url } : item))
              );
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải thumbnail trang:", err);
      }
    }

    loadThumbnails();

    return () => {
      isCancelled = true;
    };
  }, [file]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      onItemsChange(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleRotate = (id: string) => {
    onItemsChange(
      items.map((item) =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const handleDelete = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const handleToggleSelect = (id: string) => {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  return (
    <div className="space-y-4">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {items.map((item) => (
              <SortableThumbnailCard
                key={item.id}
                item={item}
                allowReorder={allowReorder}
                allowRotate={allowRotate}
                allowDelete={allowDelete}
                allowSelect={allowSelect}
                onRotate={handleRotate}
                onDelete={handleDelete}
                onToggleSelect={handleToggleSelect}
                onPreview={(url, title) => setPreviewModal({ url, title })}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Large Preview Modal */}
      {previewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setPreviewModal(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-3xl p-4 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-800">{previewModal.title}</span>
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewModal.url}
                alt={previewModal.title}
                className="max-h-[75vh] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
