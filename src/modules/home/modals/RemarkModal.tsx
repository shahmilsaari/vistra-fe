"use client";

import { useState } from "react";
import { Button, Modal, InputText } from "@/components/ui";
import { createRemark } from "@/services/api";
import { useToastStore } from "@/stores";
import type { ReactNode } from "react";

type RemarkModalProps = {
  attachmentId: number;
  onCreateSuccess?: () => void;
  renderTrigger?: (open: () => void) => ReactNode;
};

type ConversationIconProps = {
  className?: string;
};

export function ConversationIcon({ className = "h-4 w-4" }: ConversationIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16v10H9l-5 5V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h8M8 14h4" />
    </svg>
  );
}

const textareaClasses =
  "block w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:border-blue-400 dark:focus:ring-blue-400";

export function RemarkModal({ attachmentId, onCreateSuccess, renderTrigger }: RemarkModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const resetForm = () => {
    setTitle("");
    setMessage("");
  };

  const handleCreateRemark = async () => {
    if (!title.trim() || !message.trim()) {
      addToast({
        type: "warning",
        title: "Missing fields",
        message: "Provide both a title and a message for the remark.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createRemark({
        attachmentId,
        title: title.trim(),
        message: message.trim(),
      });
      addToast({
        type: "success",
        title: "Remark added",
        message: "Your remark has been recorded.",
      });
      setIsOpen(false);
      resetForm();
      onCreateSuccess?.();
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Unable to save the remark.";
      addToast({ type: "error", title: "Unable to save remark", message: messageText });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    resetForm();
  };

  const trigger = renderTrigger ? renderTrigger(openModal) : (
    <Button
      variant="outline"
      size="sm"
      onClick={openModal}
      className="gap-1"
      hideDefaultIcon
      leadingIcon={<ConversationIcon />}
    >
      Add remark
    </Button>
  );

  return (
    <>
      {trigger}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add remark"
        footer={
          <>
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <Button
              onClick={handleCreateRemark}
              disabled={isSubmitting}
              size="sm"
              className="gap-2"
              hideDefaultIcon
            >
              {isSubmitting ? "Saving..." : "Submit remark"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <InputText
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Remark title"
          />
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Message</label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              className={textareaClasses}
              placeholder="Add additional context about this update."
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
