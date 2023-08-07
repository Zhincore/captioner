import type { FileEntry } from "@tauri-apps/api/fs";

const allowedExtensions = ["png", "jpg", "jpeg", "webp"];

export function filterFiles(files: FileEntry[]) {
  return files
    .filter((file) => file.children || allowedExtensions.includes(file.name.split(".").slice(-1)[0]))
    .sort((a, b) => {
      const folders = +!!b.children - +!!a.children;
      if (folders) return folders;
      return a.name.localeCompare(b.name);
    });
}
