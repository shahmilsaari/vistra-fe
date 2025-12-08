import type { AttachmentItem, DirectoryItem } from "@/services/api";
import type { DocumentItem } from "@/modules/home/data";

export const formatBytes = (value?: number) => {
  if (!value) {
    return "-";
  }
  if (value < 1024) {
    return `${value} B`;
  }
  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
};

export const formatDate = (value?: string) => {
  if (!value) {
    return "-";
  }
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const resolveAttachmentPath = (rawPath: AttachmentItem["path"]): string => {
  if (!rawPath) {
    return "/";
  }
  if (typeof rawPath === "string") {
    return rawPath || "/";
  }

  return rawPath.name ? `/${rawPath.name}` : "/";
};

export const mapDirectoryToDocument = (directory: DirectoryItem, index: number): DocumentItem => ({
  id: -1 * (index + 1), // Negative IDs for directories
  name: directory.name,
  createdBy: directory.createdBy?.name ?? "System",
  date: formatDate(directory.createdAt),
  size: "-",
  kind: "folder",
  path: directory.path,
});

export const mapAttachmentToDocument = (attachment: AttachmentItem): DocumentItem => ({
  id: attachment.id,
  name: attachment.name,
  createdBy: attachment.createdBy?.name ?? attachment.owner?.name ?? "Unknown",
  date: formatDate(attachment.createdAt),
  size: formatBytes(attachment.size),
  kind: attachment.kind === "folder" ? "folder" : "file",
  path: resolveAttachmentPath(attachment.path),
});
