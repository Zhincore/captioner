import { filesystem } from "@neutralinojs/lib";

const allowedExtensions = ["png", "jpg", "jpeg", "webp"];

export interface FileEntry {
  path: string;
  name: string;
  ext: string;
  isDirectory: boolean;
}

export function getCaptionPath(imagePath: string) {
  return imagePath.split(".").slice(0, -1).join(".") + ".txt";
}

export async function loadFiles(path: string) {
  const files = await filesystem.readDirectory(path);
  const entries: FileEntry[] = [];

  for (const file of files) {
    const ext = file.entry.split(".").slice(-1)[0];
    const isDirectory = file.type == "DIRECTORY";

    if (file.entry.startsWith(".") || (!isDirectory && !allowedExtensions.includes(ext))) continue;

    entries.push({
      path: normalisePath(path, file.entry),
      name: file.entry,
      ext,
      isDirectory,
    });
  }

  return entries.sort((a, b) => {
    const folders = +b.isDirectory - +a.isDirectory;
    if (folders) return folders;
    return a.name.localeCompare(b.name);
  });
}

export function normalisePath(...parts: string[]) {
  return parts.join("/").replace(/\/{2,}/, "/");
}
