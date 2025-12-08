import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { API_BASE_URL, normalizePaginatedAttachments } from "@/services/api";
import { getServerAuth } from "@/lib/server-auth";
import { mapAttachmentToDocument } from "@/modules/home/mappers";
import { FolderPageClient } from "@/modules/folders/FolderPageClient";
import type { DocumentItem } from "@/modules/home/data";

const DEFAULT_LIMIT = 100;

async function fetchFolderAttachmentsServer(cookieHeader: string, folderName: string) {
  const query = new URLSearchParams({
    limit: DEFAULT_LIMIT.toString(),
    sortBy: "createdAt",
    sortOrder: "desc",
    folder: folderName,
  });

  const response = await fetch(`${API_BASE_URL}/attachments?${query.toString()}`, {
    headers: {
      Accept: "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/login");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message ?? payload?.error ?? "Unable to load folder.";
    throw new Error(message);
  }

  const normalized = normalizePaginatedAttachments(payload);
  return normalized.data.map(mapAttachmentToDocument);
}

type PageProps = {
  params: Promise<{ name: string }>;
};

export default async function FolderPage({ params }: PageProps) {
  const { name } = await params;
  const folderName = decodeURIComponent(name);
  const headerList = await Promise.resolve(headers());
  const cookieHeader = typeof headerList.get === "function" ? headerList.get("cookie") ?? "" : "";
  const { user } = await getServerAuth();

  let initialData: DocumentItem[] = [];
  try {
    initialData = await fetchFolderAttachmentsServer(cookieHeader, folderName);
  } catch {
    // Fall back to empty data; client will show errors via toasts when re-fetching.
  }

  return (
    <FolderPageClient
      folderName={folderName}
      initialData={initialData}
      initialUser={user ?? undefined}
      defaultPageSize={DEFAULT_LIMIT}
    />
  );
}
