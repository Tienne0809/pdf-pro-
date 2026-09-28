import { get, set, del } from "idb-keyval";

const CHAIN_FILE_KEY = "pdf_pro_chained_file";
const CHAIN_METADATA_KEY = "pdf_pro_chained_metadata";

export interface ChainedFilePayload {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  blob: Blob;
}

/**
 * Save a processed file to IndexedDB for chaining to another tool
 */
export async function saveFileForChaining(fileBlob: Blob, fileName: string): Promise<void> {
  try {
    const payload: ChainedFilePayload = {
      name: fileName,
      type: fileBlob.type || "application/pdf",
      size: fileBlob.size,
      lastModified: Date.now(),
      blob: fileBlob,
    };
    await set(CHAIN_FILE_KEY, payload);
    await set(CHAIN_METADATA_KEY, {
      name: fileName,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error("Lỗi khi lưu file vào IndexedDB chuyển tiếp:", err);
  }
}

/**
 * Retrieve chained file if available and less than 15 minutes old
 */
export async function getChainedFile(): Promise<File | null> {
  try {
    const payload = await get<ChainedFilePayload>(CHAIN_FILE_KEY);
    if (!payload || !payload.blob) return null;

    // Check expiration (15 minutes)
    if (Date.now() - payload.lastModified > 15 * 60 * 1000) {
      await clearChainedFile();
      return null;
    }

    const file = new File([payload.blob], payload.name, {
      type: payload.type || "application/pdf",
      lastModified: payload.lastModified,
    });

    // Clear after consuming so it doesn't persist forever
    await clearChainedFile();
    return file;
  } catch (err) {
    console.error("Lỗi khi lấy file chuyển tiếp:", err);
    return null;
  }
}

/**
 * Clear the chained file from IndexedDB
 */
export async function clearChainedFile(): Promise<void> {
  try {
    await del(CHAIN_FILE_KEY);
    await del(CHAIN_METADATA_KEY);
  } catch (err) {
    console.error("Lỗi khi xóa file chuyển tiếp:", err);
  }
}
