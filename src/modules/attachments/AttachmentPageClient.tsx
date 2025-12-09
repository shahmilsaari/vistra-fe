"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@/components/ui";
import { AppLayout, Breadcrumb } from "@/components/layout";
import type { AttachmentDetail } from "@/services/api";
import { EditAttachmentModal } from "@/modules/attachments/modals";
import {
  AttachmentHeader,
  AttachmentTimeline,
  DeleteConfirmModal,
  RemarksDrawer,
} from "@/modules/attachments/components";
import {
  useAttachmentData,
  useAttachmentActions,
  useRemarksCount,
} from "@/modules/attachments/hooks";
import { useUserStore } from "@/stores";
import { useAuth } from "@/hooks/useAuth";
import type { UserProfile } from "@/stores/user-store";
import { getBreadcrumbFromPath } from "@/utils";

type AttachmentPageClientProps = {
  attachmentId: number;
  initialDetail?: AttachmentDetail;
  initialUser?: UserProfile | null;
};

export function AttachmentPageClient({
  attachmentId,
  initialDetail,
  initialUser,
}: AttachmentPageClientProps) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const setUser = useUserStore((state) => state.setUser);
  const hasSeededUser = useRef(false);
  const [showRemarks, setShowRemarks] = useState(false);

  // Custom hooks for data and actions
  const { attachment, setAttachment, logs, isLoading, errorMessage } = useAttachmentData(
    attachmentId,
    initialDetail,
    isAuthLoading
  );

  const {
    showDeleteModal,
    setShowDeleteModal,
    showEditModal,
    setShowEditModal,
    isDeleting,
    handleOpenFile,
    handleDelete,
    handleEditSuccess: baseHandleEditSuccess,
  } = useAttachmentActions(attachment);

  const remarksCount = useRemarksCount(attachmentId);

  // Seed user from initial data
  useEffect(() => {
    if (!hasSeededUser.current && initialUser && !user) {
      setUser(initialUser);
      hasSeededUser.current = true;
    }
  }, [initialUser, setUser, user]);

  // Enhanced edit success handler
  const handleEditSuccess = (updatedAttachment: typeof attachment) => {
    if (updatedAttachment) {
      setAttachment(updatedAttachment);
      baseHandleEditSuccess(updatedAttachment);
    }
  };

  if (isAuthLoading) {
    return null;
  }

  // Build breadcrumb items
  const pathCrumb = attachment?.path ? getBreadcrumbFromPath(attachment.path) : null;
  const breadcrumbItems = [
    { label: "All folders", href: "/" },
    ...(pathCrumb ? [pathCrumb] : []),
    { label: attachment?.name ?? "Loading..." },
  ];

  return (
    <AppLayout breadcrumb={<Breadcrumb items={breadcrumbItems} />}>
      {/* Edit Attachment Modal */}
      {attachment && (
        <EditAttachmentModal
          attachment={attachment}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        isDeleting={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      {/* Loading State */}
      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : errorMessage || !attachment ? (
        /* Error State */
        <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
            <svg className="size-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">Error Loading Attachment</h3>
          <p className="text-neutral-500 dark:text-neutral-400">{errorMessage ?? "Attachment not found."}</p>
          <Button onClick={() => router.push("/")}>Back to files</Button>
        </div>
      ) : (
        /* Main Content */
        <div className="p-6 lg:p-8">
          {/* File Header Section */}
          <AttachmentHeader
            attachment={attachment}
            remarksCount={remarksCount}
            onDownload={handleOpenFile}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => setShowDeleteModal(true)}
            onOpenRemarks={() => setShowRemarks(true)}
          />

          {/* Divider */}
          <div className="mt-4 mb-6 h-px bg-neutral-200 dark:bg-neutral-700" />

          {/* Document Timeline */}
          <AttachmentTimeline logs={logs} />
        </div>
      )}

      {/* Remarks Drawer */}
      <RemarksDrawer
        isOpen={showRemarks}
        onClose={() => setShowRemarks(false)}
        attachmentId={attachmentId}
        attachment={attachment}
      />
    </AppLayout>
  );
}
