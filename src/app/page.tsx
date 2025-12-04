"use client";

import { useState } from "react";

import { Canva, DataTable, Modal, MultiSelect } from "@/components/ui";
import { ThemeToggle } from "@/components/theme";
import { useToastStore, useUIStore } from "@/stores";
import { documentColumns, documents, multiSelectOptions, type DocumentItem } from "@/modules/home/data";
import { CreateFolderModal, UploadFileModal } from "@/modules/home/modals";

export default function Home() {
  const { isTableLoading, toggleTableLoading } = useUIStore();
  const { addToast } = useToastStore();
  const [selectedTeam, setSelectedTeam] = useState<string[]>(["1"]);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Preline Components
            </p>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              Reusable Data Table
            </h1>
            <p className="text-base text-gray-600 dark:text-neutral-400">
              This table component wraps the Preline datatable markup so you can feed it any dataset and
              keep the interactive UI provided by Preline.
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 space-y-3">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Toast Samples</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Trigger global success or error notifications.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                addToast({
                  type: "success",
                  title: "Settings saved",
                  message: "Your preferences have been updated successfully.",
                })
              }
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-500 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-green-400"
            >
              Show Success Toast
            </button>
            <button
              type="button"
              onClick={() =>
                addToast({
                  type: "error",
                  title: "Request failed",
                  message: "Something went wrong. Please try again.",
                })
              }
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-red-400"
            >
              Show Error Toast
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Modal</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Reusable modal component built on Preline overlays.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            Open Modal
          </button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            title="Modal title"
            footer={
              <>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700"
                >
                  Save changes
                </button>
              </>
            }
          >
            <p className="text-sm">
              This reusable modal accepts any children and footer actions so you can compose custom layouts without
              duplicating markup.
            </p>
          </Modal>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Canva-style Offcanvas</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              A reusable offcanvas component inspired by Preline’s overlay utilities with light/dark styling.
            </p>
          </div>
          <Canva />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Multi Select</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Multi-select component with avatars and keyboard support.
            </p>
          </div>
          <MultiSelect options={multiSelectOptions} value={selectedTeam} onChange={setSelectedTeam} />
          <p className="text-sm text-gray-600 dark:text-neutral-300">
            Selected:{" "}
            {selectedTeam.length
              ? selectedTeam.map((id) => multiSelectOptions.find((option) => option.value === id)?.label).join(", ")
              : "None"}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Data Table</h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Toggle the state below to preview the reusable skeleton loading experience.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <UploadFileModal />
              <CreateFolderModal />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={toggleTableLoading}
              className={`inline-flex items-center gap-x-2 rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-hidden focus-visible:ring-2 ${
                isTableLoading
                  ? "border-orange-200 bg-orange-500/10 text-orange-800 hover:bg-orange-500/20 focus-visible:ring-orange-400 dark:border-orange-500/40 dark:bg-orange-500/20 dark:text-orange-50"
                  : "border-sky-200 bg-sky-500/10 text-sky-800 hover:bg-sky-500/20 focus-visible:ring-sky-400 dark:border-sky-500/40 dark:bg-sky-500/20 dark:text-sky-50"
              }`}
            >
              {isTableLoading ? "Stop Loading" : "Simulate Loading"}
            </button>
          </div>
          <DataTable<DocumentItem>
            data={documents}
            columns={documentColumns}
            getRowId={(row) => row.id}
            renderActions={(row) => (
              <button
                type="button"
                className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-hidden focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
                onClick={() => console.log("Delete", row.name)}
              >
                Delete
              </button>
            )}
            isLoading={isTableLoading}
          />
        </div>
      </div>
    </main>
  );
}
