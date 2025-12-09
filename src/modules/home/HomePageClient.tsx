"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useRef } from "react";
import { DataTable, Modal } from "@/components/ui";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { deleteAttachment, deleteDirectory, fetchAttachments } from "@/services/api";
import { useToastStore, useUIStore, useUserStore, useTableStore } from "@/stores";
import { documentColumns, type DocumentItem } from "@/modules/home/data";
import { CreateFolderModal, UploadFileModal, RemarkModal } from "@/modules/home/modals";
import { useAuth } from "@/hooks/useAuth";
import { useRouterLoading } from "@/hooks/useRouterLoading";
import { ConversationIcon } from "@/modules/home/modals/RemarkModal";
import { mapAttachmentToDocument, mapDirectoryToDocument } from "./mappers";
import type { UserProfile } from "@/stores/user-store";

type HomePageClientProps = {
  initialData?: DocumentItem[];
  initialTotal?: number;
  initialUser?: UserProfile | null;
  defaultSortField?: string;
  defaultSortOrder?: "asc" | "desc";
  defaultPageSize?: number;
};

export function HomePageClient({
  initialData = [],
  initialTotal,
  initialUser,
  defaultSortField = "createdAt",
  defaultSortOrder = "desc",
  defaultPageSize = 25,
}: HomePageClientProps) {
  const router = useRouterLoading();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { isTableLoading } = useUIStore();
  const setUser = useUserStore((state) => state.setUser);
  const addToast = useToastStore((state) => state.addToast);

  const { pageSize, sortField, sortOrder, setPageSize, setSorting } = useTableStore();

  const [tableData, setTableData] = useState<DocumentItem[]>(initialData);
  const [totalAttachments, setTotalAttachments] = useState<number | undefined>(initialTotal);
  const [isFetchingAttachments, setIsFetchingAttachments] = useState(false);
  const [deletingAttachmentId, setDeletingAttachmentId] = useState<number | null>(null);
  const [itemToDelete, setItemToDelete] = useState<DocumentItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const showSkeleton = isFetchingAttachments && tableData.length === 0;
  const hasHydratedUser = useRef(false);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    if (!hasHydratedUser.current && initialUser && !user) {
      setUser(initialUser);
      hasHydratedUser.current = true;
    }
  }, [initialUser, setUser, user]);

  const loadAttachments = useCallback(
    async (signal?: AbortSignal) => {
      setIsFetchingAttachments(true);
      try {
        const payload = await fetchAttachments({
          signal,
          limit: pageSize,
          sortBy: sortField,
          sortOrder,
          search: debouncedSearch || undefined,
        });

        const directoryRows = (payload.directories ?? []).map(mapDirectoryToDocument);
        const fileRows = payload.data.map(mapAttachmentToDocument);
        const rows = [...directoryRows, ...fileRows];

        setTableData(rows);
        setTotalAttachments((payload.meta?.totalCount ?? 0) + directoryRows.length);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        const message = error instanceof Error ? error.message : "Unable to load attachments.";
        addToast({ type: "error", title: "Unable to load data", message });
      } finally {
        setIsFetchingAttachments(false);
      }
    },
    [addToast, sortField, sortOrder, pageSize, debouncedSearch]
  );

  useEffect(() => {
    if (hasLoadedOnce.current) return;
    if (!isAuthLoading && user) {
      hasLoadedOnce.current = true;
      const controller = new AbortController();
      loadAttachments(controller.signal);
      return () => controller.abort();
    }
  }, [isAuthLoading, user, loadAttachments]);

  useEffect(() => {
    if (!hasLoadedOnce.current || isAuthLoading || !user) return;
    const controller = new AbortController();
    loadAttachments(controller.signal);
    return () => controller.abort();
  }, [pageSize, sortField, sortOrder, debouncedSearch, loadAttachments, isAuthLoading, user]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDeleteItem = useCallback(
    async (item: DocumentItem) => {
      setDeletingAttachmentId(item.id);
      try {
        if (item.kind === "folder") {
          await deleteDirectory(item.name);
        } else {
          await deleteAttachment(item.id);
        }
        addToast({ type: "success", title: "Deleted", message: "Item has been removed." });
        await loadAttachments();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to delete item.";
        addToast({ type: "error", title: "Delete failed", message });
      } finally {
        setDeletingAttachmentId(null);
      }
    },
    [addToast, loadAttachments]
  );

  const handleSortChange = useCallback((field: string, order: "asc" | "desc") => {
    setSorting(field, order);
  }, [setSorting]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
  }, [setPageSize]);

  return (
    <ProtectedRoute title="Files" subtitle="Manage and organize your documents.">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={Boolean(itemToDelete)}
          onClose={() => setItemToDelete(null)}
          title="Delete item"
          maxWidth="max-w-md"
          footer={
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-neutral-200 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 disabled:opacity-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!itemToDelete || deletingAttachmentId === itemToDelete.id}
                onClick={async () => {
                  if (!itemToDelete) return;
                  await handleDeleteItem(itemToDelete);
                  setItemToDelete(null);
                }}
                className="py-2 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-500/60 dark:bg-white dark:text-red-600 dark:hover:bg-red-50"
              >
                {itemToDelete && deletingAttachmentId === itemToDelete.id ? (
                  <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                Delete
              </button>
            </div>
          }
        >
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Are you sure you want to delete{" "}
            <span className="font-medium">{itemToDelete?.name}</span>? This action cannot be undone.
          </p>
        </Modal>
        {/* Header with Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Your Files</h1>
            <p className="mt-1 text-neutral-500 dark:text-neutral-400">
              Upload, organize, and collaborate on your documents.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <UploadFileModal onUploadSuccess={loadAttachments} />
            <CreateFolderModal onCreateSuccess={loadAttachments} />
          </div>
        </div>

        {/* Files Section */}
        <section className="pt-4">
          {showSkeleton ? (
            <div className="rounded-2xl bg-white dark:bg-neutral-800 overflow-hidden">
              <div className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4">
                    <div className="h-10 w-10 rounded-xl bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                      <div className="h-3 w-1/4 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-16 rounded-lg bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <DataTable<DocumentItem>
              data={tableData}
              columns={documentColumns}
              selectable={false}
              getRowId={(row) => row.id}
              searchTerm={searchQuery}
              onSearchChange={setSearchQuery}
              renderActions={(row) => (
                <div className="flex items-center justify-end gap-2">
                  {row.kind === "folder" ? (
                    <button
                      type="button"
                      onClick={() => router.push(`/folders/${row.name}`)}
                      className="py-1.5 px-3 inline-flex items-center gap-x-1.5 text-xs font-medium rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus:outline-none focus:bg-emerald-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-emerald-800/20 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-800/30 dark:focus:bg-emerald-800/30"
                    >
                      <svg className="shrink-0 size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      Open
                    </button>
                  ) : (
                    <>
                      <Link
                        href={`/attachments/${row.id}`}
                        className="py-1.5 px-3 inline-flex items-center gap-x-1.5 text-xs font-medium rounded-lg border border-neutral-200 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 focus:outline-none focus:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      >
                        <svg className="shrink-0 size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </Link>
                      <RemarkModal
                        attachmentId={row.id}
                        onCreateSuccess={loadAttachments}
                        renderTrigger={(open) => (
                          <button
                            type="button"
                            onClick={open}
                            className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:bg-indigo-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-indigo-800/20 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-800/30 dark:focus:bg-indigo-800/30"
                            aria-label="Add remark"
                          >
                            <ConversationIcon className="shrink-0 size-4" />
                          </button>
                        )}
                      />
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setItemToDelete(row)}
                    disabled={deletingAttachmentId === row.id}
                    className="py-1.5 px-3 inline-flex items-center gap-x-1.5 text-xs font-medium rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 focus:outline-none focus:bg-red-100 disabled:opacity-50 disabled:pointer-events-none dark:bg-red-800/20 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-800/30 dark:focus:bg-red-800/30"
                  >
                    {deletingAttachmentId === row.id ? (
                      <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <svg className="shrink-0 size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                    Delete
                  </button>
                </div>
              )}
              isLoading={isTableLoading}
              totalEntries={totalAttachments}
              sortField={sortField}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </section>
      </div>
    </ProtectedRoute>
  );
}
