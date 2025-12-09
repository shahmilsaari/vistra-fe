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
  const isValidId = Boolean(attachmentId && !Number.isNaN(attachmentId));
  const [attachment, setAttachment] = useState<AttachmentItem | null>(
    isValidId ? initialDetail?.attachment ?? null : null
  );
  const [logs, setLogs] = useState<AttachmentLog[]>(isValidId ? initialDetail?.logs?.data ?? [] : []);
  const [isLoading, setIsLoading] = useState(isValidId && !initialDetail);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    isValidId ? null : "Invalid attachment identifier."
  );
  const hasLoadedOnce = useRef(Boolean(initialDetail));

  useEffect(() => {
    if (isValidId) return;

    const resetFrame = window.requestAnimationFrame(() => {
      setErrorMessage("Invalid attachment identifier.");
      setIsLoading(false);
      setAttachment(null);
      setLogs([]);
    });

    return () => window.cancelAnimationFrame(resetFrame);
  }, [isValidId]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (hasLoadedOnce.current) return;
    if (!isValidId) return;

    const controller = new AbortController();
    const startFrame = window.requestAnimationFrame(() => {
      setIsLoading(true);
      setErrorMessage(null);
      setAttachment(null);
      setLogs([]);
    });
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

    return () => {
      window.cancelAnimationFrame(startFrame);
      controller.abort();
    };
  }, [attachmentId, addToast, isAuthLoading, isValidId]);

  return {
    attachment,
    setAttachment,
    logs,
    isLoading,
    errorMessage,
  };
}
