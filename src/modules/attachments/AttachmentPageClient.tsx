"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Spinner, FileIcon, Modal } from "@/components/ui";
import {
  AttachmentItem,
  AttachmentLog,
  fetchAttachment,
  fetchAttachmentRemarks,
  deleteAttachment,
  logout,
  PaginatedRemarksDto,
  RemarkItemDto,
  type AttachmentDetail,
} from "@/services/api";
import { RemarkModal } from "@/modules/home/modals";
import { useToastStore, useUserStore } from "@/stores";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/theme";
import type { UserProfile } from "@/stores/user-store";

const REMARKS_PAGE_LIMIT = 5;

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatAction = (action: string) => {
  switch (action) {
    case "attachment.upload": return "Added file";
    case "attachment.delete": return "Deleted file";
    case "attachment.rename": return "Renamed file";
    case "attachment.move": return "Moved file";
    case "attachment.download": return "Downloaded file";
    default: return action.replace("attachment.", "").replace("_", " ");
  }
};

type AttachmentPageClientProps = {
  attachmentId: number;
  initialDetail?: AttachmentDetail;
  initialUser?: UserProfile | null;
};

export function AttachmentPageClient({ attachmentId, initialDetail, initialUser }: AttachmentPageClientProps) {
  const router = useRouter();
  const addToast = useToastStore((state) => state.addToast);
  const { user, isLoading: isAuthLoading } = useAuth();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  const [attachment, setAttachment] = useState<AttachmentItem | null>(initialDetail?.attachment ?? null);
  const [logs, setLogs] = useState<AttachmentLog[]>(initialDetail?.logs?.data ?? []);
  const [isLoading, setIsLoading] = useState(!initialDetail);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showRemarks, setShowRemarks] = useState(false);
  const [remarks, setRemarks] = useState<RemarkItemDto[]>([]);
  const [remarksMeta, setRemarksMeta] = useState<PaginatedRemarksDto["meta"] | null>(null);
  const [remarksCount, setRemarksCount] = useState<number | null>(null);
  const [remarksPage, setRemarksPage] = useState(1);
  const [remarksLoading, setRemarksLoading] = useState(false);
  const [remarksError, setRemarksError] = useState<string | null>(null);
  const [remarksRefreshKey, setRemarksRefreshKey] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const hasSeededUser = useRef(false);
  const hasLoadedOnce = useRef(Boolean(initialDetail));

  const displayUser = user ?? initialUser ?? null;

  useEffect(() => {
    if (!hasSeededUser.current && initialUser && !user) {
      setUser(initialUser);
      hasSeededUser.current = true;
    }
  }, [initialUser, setUser, user]);

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

  useEffect(() => {
    setRemarks([]);
    setRemarksMeta(null);
    setRemarksCount(null);
    setRemarksPage(1);
    setRemarksError(null);
    setRemarksLoading(false);
    setRemarksRefreshKey((prev) => prev + 1);
  }, [attachmentId]);

  useEffect(() => {
    if (!attachmentId || showRemarks || remarksCount !== null) return;

    const controller = new AbortController();
    fetchAttachmentRemarks(attachmentId, { page: 1, limit: 1, signal: controller.signal })
      .then((payload) => setRemarksCount(payload.meta?.totalCount ?? 0))
      .catch(() => {});

    return () => controller.abort();
  }, [attachmentId, remarksCount, showRemarks]);

  useEffect(() => {
    if (!attachmentId || !showRemarks) return;

    const controller = new AbortController();
    setRemarksLoading(true);
    setRemarksError(null);

    fetchAttachmentRemarks(attachmentId, { page: remarksPage, limit: REMARKS_PAGE_LIMIT, signal: controller.signal })
      .then((payload) => {
        const nextRemarks = Array.isArray(payload.data) ? payload.data : [];
        setRemarks(nextRemarks);
        setRemarksMeta(payload.meta ?? null);
        setRemarksCount(payload.meta?.totalCount ?? nextRemarks.length ?? 0);
      })
      .catch((error) => {
        if (error instanceof Error && error.name === "AbortError") return;
        const message = error instanceof Error ? error.message : "Unable to load remarks.";
        setRemarksError(message);
        addToast({ type: "error", title: "Unable to load remarks", message });
      })
      .finally(() => setRemarksLoading(false));

    return () => controller.abort();
  }, [addToast, attachmentId, remarksPage, remarksRefreshKey, showRemarks]);

  const handleOpenRemarksPanel = () => {
    setRemarksPage(1);
    setShowRemarks(true);
  };

  const handleRemarkCreateSuccess = () => {
    setRemarksPage(1);
    setRemarksRefreshKey((prev) => prev + 1);
    setShowRemarks(true);
  };

  const displayedRemarkCount = remarksCount ?? remarksMeta?.totalCount ?? 0;
  const remarkButtonLabel = `${displayedRemarkCount} ${displayedRemarkCount === 1 ? "remark" : "remarks"}`;

  const currentRemarksPage = remarksMeta?.page ?? remarksPage;
  const totalRemarksPages = Math.max(remarksMeta?.totalPages ?? 1, 1);
  const canGoToPreviousRemarksPage = currentRemarksPage > 1;
  const canGoToNextRemarksPage = currentRemarksPage < totalRemarksPages;

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

  const handleLogout = async () => {
    setIsProfileOpen(false);
    try {
      await logout();
      addToast({ type: "success", title: "Logged out", message: "You have been signed out." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reach the server.";
      addToast({ type: "error", title: "Logout failed", message });
    } finally {
      clearUser();
      router.push("/login");
    }
  };

  if (isAuthLoading) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-900">
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete attachment"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteModal(false)}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-neutral-200 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        }
      >
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Are you sure you want to delete this attachment? This action cannot be undone.
        </p>
      </Modal>

      {/* Icon-only Sidebar */}
      <aside className="hidden lg:flex flex-col items-center w-16 py-4 border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
        {/* Logo */}
        <Link href="/" className="mb-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </Link>

        {/* Navigation Icons */}
        <nav className="flex flex-col items-center gap-2 flex-1">
          <Link
            href="/"
            className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            title="All folders"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </Link>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Search"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Favorites"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Documents"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Team"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Activity"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            title="Trash"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </nav>

        {/* Theme Toggle at bottom */}
        <div className="mt-auto">
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Breadcrumb and User */}
        <header className="flex items-center justify-between h-16 px-6 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
              All folders
            </Link>
            {attachment?.directory && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">/</span>
                <Link
                  href={`/folders/${attachment.directory}`}
                  className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                >
                  {attachment.directory}
                </Link>
              </>
            )}
            <span className="text-neutral-300 dark:text-neutral-600">/</span>
            <span className="text-neutral-900 dark:text-white font-medium truncate max-w-[200px]">
              {attachment?.name ?? "Loading..."}
            </span>
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3"
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-semibold">
                  {displayUser?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{displayUser?.name ?? "User"}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{displayUser?.role ?? "User"}</p>
                </div>
                <svg className={`size-4 text-neutral-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-neutral-200 shadow-lg dark:bg-neutral-800 dark:border-neutral-700 z-50">
                    <div className="p-3 border-b border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white">{displayUser?.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{displayUser?.email}</p>
                    </div>
                    <div className="p-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : errorMessage || !attachment ? (
            <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <svg className="size-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">Error Loading Attachment</h3>
              <p className="text-neutral-500 dark:text-neutral-400">{errorMessage ?? "Attachment not found."}</p>
              <Button onClick={() => router.push("/")}>Back to Dashboard</Button>
            </div>
          ) : (
            <div className="p-6 lg:p-8">
              {/* File Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 pb-8 border-b border-neutral-200 dark:border-neutral-700">
                {/* File Info */}
                <div className="flex items-start gap-4">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
                    <FileIcon
                      kind={attachment.kind}
                      mime={attachment.mime}
                      name={attachment.name}
                      className="size-8 text-neutral-500 dark:text-neutral-400"
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">{attachment.name}</h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      Created on {formatDate(attachment.createdAt)} by {attachment.createdBy?.name ?? "Unknown"}
                    </p>
                    {/* Action Links */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                      <button
                        type="button"
                        onClick={handleOpenFile}
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        Download
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        Share
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        More actions
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Card - Yellow/Lime dashed box */}
                <div className="rounded-xl border-2 border-dashed border-lime-300 bg-lime-50 p-5 dark:border-lime-600 dark:bg-lime-900/20 lg:min-w-[300px]">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Last updated on <span className="font-medium">{formatDate(attachment.updatedAt)}</span>
                  </p>
                  <div className="my-4 border-t border-dashed border-lime-300 dark:border-lime-600" />
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Shared with</p>
                      <button className="mt-1 inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        <span className="underline decoration-dotted underline-offset-2">4 members</span>
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Additional remark</p>
                      <button
                        onClick={handleOpenRemarksPanel}
                        className="mt-1 inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <span className="underline decoration-dotted underline-offset-2">{remarkButtonLabel}</span>
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* Dashed connector line with circle */}
                  <div className="hidden lg:flex justify-end mt-4 -mb-8 -mr-8">
                    <div className="flex flex-col items-center">
                      <div className="size-3 rounded-full border-2 border-neutral-400 bg-white dark:bg-neutral-800" />
                      <div className="w-px h-8 border-l-2 border-dashed border-neutral-400" />
                      <svg className="size-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Timeline */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Document timeline</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-700">
                        <th className="pb-3 text-left text-xs font-semibold text-neutral-900 dark:text-white">Member name</th>
                        <th className="pb-3 text-left text-xs font-semibold text-neutral-900 dark:text-white">Role</th>
                        <th className="pb-3 text-left text-xs font-semibold text-neutral-900 dark:text-white">Date & time</th>
                        <th className="pb-3 text-left text-xs font-semibold text-neutral-900 dark:text-white">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {logs.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                            No activity recorded yet.
                          </td>
                        </tr>
                      ) : (
                        logs.map((log) => (
                          <tr key={log.id}>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                                  {log.user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm text-neutral-900 dark:text-white">{log.user.name}</span>
                              </div>
                            </td>
                            <td className="py-4 text-sm text-neutral-500 dark:text-neutral-400">Administrator</td>
                            <td className="py-4 text-sm text-neutral-500 dark:text-neutral-400">{formatDateTime(log.createdAt)}</td>
                            <td className="py-4 text-sm text-neutral-500 dark:text-neutral-400">{formatAction(log.action)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Remarks Slide-over Panel */}
      {showRemarks && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowRemarks(false)} />
          <div className="fixed top-0 end-0 bottom-0 z-50 w-full max-w-md bg-white border-s border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700 flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Remarks</h3>
              <button
                type="button"
                onClick={() => setShowRemarks(false)}
                className="size-8 inline-flex justify-center items-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* File Info Card */}
            <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 dark:bg-neutral-800/50 dark:border-neutral-700">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
                <div className="flex size-8 shrink-0 items-center justify-center rounded bg-white dark:bg-neutral-700">
                  <FileIcon
                    kind={attachment?.kind}
                    name={attachment?.name ?? ""}
                    className="size-4 text-neutral-500 dark:text-neutral-400"
                  />
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-white truncate">{attachment?.name}</span>
              </div>
            </div>

            {/* Add Remark Button */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <RemarkModal
                attachmentId={attachmentId}
                onCreateSuccess={handleRemarkCreateSuccess}
                renderTrigger={(open) => (
                  <button
                    type="button"
                    onClick={open}
                    className="w-full py-2 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-900/20"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Remark
                  </button>
                )}
              />
            </div>

            {/* Remarks List */}
            <div className="flex-1 overflow-y-auto p-6">
              {remarksLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner size="sm" />
                </div>
              ) : remarksError ? (
                <p className="text-sm text-red-600 dark:text-red-400">{remarksError}</p>
              ) : !Array.isArray(remarks) || remarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-700 mb-3">
                    <svg className="size-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">No remarks have been added yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {remarks.map((remark) => (
                    <div key={remark.id} className="flex gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                        {remark.user.name ? remark.user.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white">{remark.user.name}</p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">{remark.title}</p>
                          </div>
                          <span className="text-xs text-neutral-400 whitespace-nowrap">{formatDateTime(remark.createdAt)}</span>
                        </div>
                        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{remark.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Footer */}
            {totalRemarksPages > 1 && (
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Page {currentRemarksPage} of {totalRemarksPages}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRemarksPage((prev) => Math.max(prev - 1, 1))}
                    disabled={!canGoToPreviousRemarksPage || remarksLoading}
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 disabled:opacity-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemarksPage((prev) => Math.min(prev + 1, totalRemarksPages))}
                    disabled={!canGoToNextRemarksPage || remarksLoading}
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 disabled:opacity-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
