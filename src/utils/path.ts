import type { AttachmentItem } from "@/services/api";

type BreadcrumbItem = {
  label: string;
  href: string;
};

export function getFolderPath(path: AttachmentItem["path"]): string {
  if (typeof path === "string") {
    return path.startsWith("/") ? path.slice(1) : path;
  }
  return path?.name ?? "";
}

export function getBreadcrumbFromPath(path: AttachmentItem["path"]): BreadcrumbItem | null {
  if (!path) return null;

  if (typeof path === "string") {
    const folderSlug = path.replace(/\//g, "");
    if (!folderSlug) return null;
    return {
      label: folderSlug,
      href: `/folders/${folderSlug}`,
    };
  }

  if (path.name) {
    return {
      label: path.name,
      href: `/folders/${path.name}`,
    };
  }

  return null;
}
