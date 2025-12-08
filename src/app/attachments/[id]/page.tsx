import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { API_BASE_URL } from "@/services/api";
import { getServerAuth } from "@/lib/server-auth";
import type { AttachmentDetail } from "@/services/api";
import { AttachmentPageClient } from "@/modules/attachments/AttachmentPageClient";

const coerceAttachmentDetail = (payload: unknown): AttachmentDetail | null => {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  if (obj.attachment && obj.logs) {
    return obj as AttachmentDetail;
  }
  if (obj.data && typeof obj.data === "object" && "attachment" in (obj.data as Record<string, unknown>)) {
    return (obj.data as AttachmentDetail) as AttachmentDetail;
  }
  return null;
};

async function fetchAttachmentServer(cookieHeader: string, id: number): Promise<AttachmentDetail> {
  const response = await fetch(`${API_BASE_URL}/attachments/${id}`, {
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
    const message = payload?.message ?? payload?.error ?? "Unable to load attachment.";
    throw new Error(message);
  }

  const detail = coerceAttachmentDetail(payload);
  if (!detail) {
    throw new Error("Invalid attachment payload.");
  }
  return detail;
}

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AttachmentPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  if (Number.isNaN(id)) {
    redirect("/");
  }

  const headerList = await Promise.resolve(headers());
  const cookieHeader = typeof headerList.get === "function" ? headerList.get("cookie") ?? "" : "";
  const { user } = await getServerAuth();

  let initialDetail: AttachmentDetail | null = null;
  try {
    initialDetail = await fetchAttachmentServer(cookieHeader, id);
  } catch {
    // Client will display error state if detail is null.
  }

  return (
    <AttachmentPageClient
      attachmentId={id}
      initialDetail={initialDetail ?? undefined}
      initialUser={user ?? undefined}
    />
  );
}
