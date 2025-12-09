import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { AttachmentItem } from "@/services/api";
import { deleteAttachment } from "@/services/api";
import { useToastStore } from "@/stores";

export function useAttachmentActions(attachment: AttachmentItem | null) {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenFile = useCallback(() => {
    if (!attachment?.storageUrl) return;
    window.open(attachment.storageUrl, "_blank", "noopener");
  }, [attachment]);

  const handleDelete = async () => {
    setShowDeleteModal(false);
    if (!attachment) return;
    setIsDeleting(true);
    try {
      await deleteAttachment(attachment.id);
      addToast({ type: "success", title: "Deleted", message: "Attachment removed." });
      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete attachment.";
      addToast({ type: "error", title: "Delete failed", message });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = (updatedAttachment: AttachmentItem) => {
    const newFolder = typeof updatedAttachment.path === "string"
      ? updatedAttachment.path
      : updatedAttachment.path?.name ?? "";
    const oldFolder = typeof attachment?.path === "string"
      ? attachment.path
      : attachment?.path?.name ?? "";

    if (newFolder !== oldFolder) {
      router.refresh();
    }
  };

  return {
    showDeleteModal,
    setShowDeleteModal,
    showEditModal,
    setShowEditModal,
    isDeleting,
    handleOpenFile,
    handleDelete,
    handleEditSuccess,
  };
}
