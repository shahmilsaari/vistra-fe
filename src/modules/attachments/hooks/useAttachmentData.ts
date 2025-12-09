import { useEffect, useRef, useState } from "react";
import type { AttachmentItem, AttachmentLog, AttachmentDetail } from "@/services/api";
import { fetchAttachment } from "@/services/api";
import { useToastStore } from "@/stores";

export function useAttachmentData(
  attachmentId: number,
  initialDetail?: AttachmentDetail,
  isAuthLoading?: boolean
) {
  const addToast = useToastStore((state) => state.addToast);
  const [attachment, setAttachment] = useState<AttachmentItem | null>(initialDetail?.attachment ?? null);
  const [logs, setLogs] = useState<AttachmentLog[]>(initialDetail?.logs?.data ?? []);
  const [isLoading, setIsLoading] = useState(!initialDetail);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hasLoadedOnce = useRef(Boolean(initialDetail));

  useEffect(() => {
    if (isAuthLoading) return;
    if (hasLoadedOnce.current) return;

    if (!attachmentId || Number.isNaN(attachmentId)) {
      setErrorMessage("Invalid attachment identifier.");
      setIsLoading(false);
      setAttachment(null);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setErrorMessage(null);
    setAttachment(null);
    hasLoadedOnce.current = true;

    fetchAttachment(attachmentId, controller.signal)
      .then((data) => {
        setAttachment(data.attachment);
        setLogs(data.logs.data);
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
        const message = error instanceof Error ? error.message : "Unable to load attachment.";
        setErrorMessage(message);
        addToast({ type: "error", title: "Unable to load attachment", message });
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [attachmentId, addToast, isAuthLoading]);

  return {
    attachment,
    setAttachment,
    logs,
    isLoading,
    errorMessage,
  };
}
