import { useEffect, useState } from "react";
import { fetchAttachmentRemarks } from "@/services/api";

export function useRemarksCount(attachmentId: number) {
  const [remarksCount, setRemarksCount] = useState<number | null>(null);

  useEffect(() => {
    if (!attachmentId) return;

    const controller = new AbortController();
    fetchAttachmentRemarks(attachmentId, { page: 1, limit: 1, signal: controller.signal })
      .then((payload) => setRemarksCount(payload.meta?.totalCount ?? 0))
      .catch(() => { });

    return () => controller.abort();
  }, [attachmentId]);

  return remarksCount ?? 0;
}
