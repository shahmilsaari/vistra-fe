import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { HomePageClient } from "@/modules/home/HomePageClient";
import { API_BASE_URL, normalizePaginatedAttachments, type PaginatedAttachments } from "@/services/api";
import { getServerAuth } from "@/lib/server-auth";
import { mapAttachmentToDocument, mapDirectoryToDocument } from "@/modules/home/mappers";

const DEFAULT_LIMIT = 25;
const DEFAULT_SORT = { field: "createdAt", order: "desc" as const };

const emptyAttachments: PaginatedAttachments = {
  data: [],
  directories: [],
  meta: {
    totalCount: 0,
    totalPages: 1,
    page: 1,
    limit: DEFAULT_LIMIT,
  },
};

async function fetchAttachmentsServer(cookieHeader: string) {
  const query = new URLSearchParams({
    limit: DEFAULT_LIMIT.toString(),
    sortBy: DEFAULT_SORT.field,
    sortOrder: DEFAULT_SORT.order,
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
    const message = payload?.message ?? payload?.error ?? "Unable to load attachments.";
    throw new Error(message);
  }

  return normalizePaginatedAttachments(payload);
}

export default async function HomePage() {
  // Turbopack can surface headers() as a promise; normalize and guard.
  const headerList = await Promise.resolve(headers());
  const cookieHeader = typeof headerList.get === "function" ? headerList.get("cookie") ?? "" : "";
  const { user } = await getServerAuth();

  let attachments = emptyAttachments;
  try {
    attachments = await fetchAttachmentsServer(cookieHeader);
  } catch {
    // Fall back to empty data; client will show an error toast if needed.
  }

  const directoryRows = (attachments.directories ?? []).map(mapDirectoryToDocument);
  const fileRows = attachments.data.map(mapAttachmentToDocument);
  const initialData = [...directoryRows, ...fileRows];
  const initialTotal = (attachments.meta?.totalCount ?? 0) + directoryRows.length;

  return (
    <HomePageClient
      initialData={initialData}
      initialTotal={initialTotal}
      initialUser={user ?? undefined}
      defaultSortField={DEFAULT_SORT.field}
      defaultSortOrder={DEFAULT_SORT.order}
      defaultPageSize={DEFAULT_LIMIT}
    />
  );
}
