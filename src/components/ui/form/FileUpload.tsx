"use client";

import { FilePond, registerPlugin } from "react-filepond";
import type { FilePondFile, FilePondInitialFile, FilePondOptions } from "filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFilePoster from "filepond-plugin-file-poster";
import { useEffect, useRef, type ReactNode } from "react";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css";

type FileUploadEntry = FilePondInitialFile | FilePondFile | string;

type FileUploadProps = {
  files: FileUploadEntry[];
  onUpdateFiles: (files: FilePondFile[]) => void;
  label?: ReactNode;
  options?: FilePondOptions;
};

registerPlugin(FilePondPluginImagePreview, FilePondPluginFilePoster);

const formatBytes = (bytes: number) => {
  if (bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const suffixes = ["B", "KB", "MB", "GB"];
  const tier = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), suffixes.length - 1);
  const value = bytes / Math.pow(k, tier);
  return `${value.toFixed(1)} ${suffixes[tier]}`;
};

export function FileUpload({ files, onUpdateFiles, label, options }: FileUploadProps) {
  const namesRef = useRef<Set<string>>(new Set());
  const totalSize = files.reduce((sum, file) => {
    if (typeof file === "string") {
      return sum;
    }
    return sum + (file?.file?.size ?? 0);
  }, 0);

  const totalLabel = totalSize > 0 ? `${Math.round(totalSize / 1024)} KB` : "0 KB";

  useEffect(() => {
    const current = new Set<string>();
    files.forEach((entry) => {
      if (!entry) return;
      if (typeof entry === "string") {
        current.add(entry);
        return;
      }
      const name = entry.file?.name ?? (entry as FilePondInitialFile).source?.toString() ?? "";
      if (name) current.add(name);
    });
    namesRef.current = current;
  }, [files]);

  const handleBeforeAddFile = (item: FilePondFile) => {
    const name = item.file?.name ?? "";
    if (name && namesRef.current.has(name)) {
      return false;
    }
    if (name) {
      namesRef.current.add(name);
    }
    if (typeof options?.beforeAddFile === "function") {
      return options.beforeAddFile(item);
    }
    return true;
  };

  return (
    <div className="space-y-4">
      {label && (
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {label}
        </div>
      )}

      <div className="relative rounded-[24px] border border-transparent bg-gradient-to-br from-white to-slate-50 p-[2px] shadow-[0_20px_35px_rgba(15,23,42,0.08)] dark:from-neutral-800 dark:to-neutral-900">
        <div className="rounded-[22px] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:bg-neutral-800 dark:shadow-none">

          {/* Header Section */}
          <div className="border-b border-slate-100 p-6 dark:border-neutral-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-slate-800 dark:text-white">
                  Drag & drop files or browse
                </h3>
                <p className="text-sm text-slate-500 dark:text-neutral-300">
                  Supported formats: any · Max 5MB per file
                </p>
              </div>

              {files.length > 0 && (
                <div className="ml-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-right dark:border-neutral-600 dark:bg-neutral-700">
                  <div className="text-2xl font-bold text-slate-800 dark:text-white">
                    {files.length}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-neutral-300">
                    {files.length === 1 ? "file" : "files"}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Area */}
          <div className="p-6">
            <div className="relative rounded-[20px] border-2 border-dashed border-slate-200 bg-gradient-to-br from-blue-50/30 via-white/50 to-slate-50/30 p-8 transition-all hover:border-blue-300 hover:bg-blue-50/40 dark:border-neutral-600 dark:from-neutral-700/50 dark:via-neutral-800/50 dark:to-neutral-900/50 dark:hover:border-blue-500">
              <div className="absolute inset-0 pointer-events-none rounded-[20px] bg-gradient-to-br from-blue-100/20 to-transparent opacity-60 dark:from-blue-500/10 dark:opacity-30"></div>

              <div className="relative">
                <FilePond
                  files={files}
                  onupdatefiles={onUpdateFiles}
                  allowMultiple
                  allowFileTypeValidation
                  allowFileSizeValidation
                  allowFileRename
                  allowImagePreview
                  allowImageExifOrientation
                  allowFilePoster
                  beforeAddFile={handleBeforeAddFile}
                  fileRenameFunction={(file) => {
                    const existing = files.map((f) =>
                      typeof f === "string" ? f : f.file?.name ?? ""
                    );
                    if (!existing.includes(file.name)) {
                      return file.name;
                    }
                    const [basename, extension] = file.name.split(/\.(?=[^\\.]+$)/);
                    let index = 1;
                    let newName = `${basename} (${index})${extension ? `.${extension}` : ""}`;
                    while (existing.includes(newName)) {
                      index += 1;
                      newName = `${basename} (${index})${extension ? `.${extension}` : ""}`;
                    }
                    return newName;
                  }}
                  labelIdle='<span class="text-base text-slate-600 dark:text-neutral-300">Drop files here or <span class="filepond--label-action font-semibold text-blue-600 dark:text-blue-400">browse</span></span>'
                  filePosterHeight={140}
                  filePosterMaxHeight={180}
                  filePosterMaxWidth={180}
                  credits={false}
                  className="[&_.filepond--root]:rounded-[18px] [&_.filepond--panel-root]:bg-transparent [&_.filepond--root]:border-none [&_.filepond--drop-label]:text-base [&_.filepond--root]:p-0 [&_.filepond--label-action]:text-blue-600 dark:[&_.filepond--label-action]:text-blue-400 [&_.filepond--root]:bg-transparent [&_.filepond--credits]:hidden [&_.filepond--root]:shadow-none [&_.filepond--item]:mb-3"
                  {...options}
                />
              </div>
            </div>
          </div>

          {/* Files List Section */}
          {files.length > 0 && (
            <div className="border-t border-slate-100 p-6 dark:border-neutral-700">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-white">
                  Uploaded Files
                </h4>
                <div className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  Total: {totalLabel}
                </div>
              </div>

              <div className="space-y-2">
                {files.map((file, index) => {
                  const name = typeof file === "string" ? file : file.file?.name ?? "Unknown";
                  const size = typeof file === "string" ? 0 : file.file?.size ?? 0;
                  return (
                    <div
                      key={`${name}-${size}-${index}`}
                      className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-neutral-600 dark:bg-neutral-700 dark:hover:border-blue-500"
                    >
                      {/* File Icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm dark:from-blue-600 dark:to-blue-700">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>

                      {/* File Info */}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-slate-700 dark:text-white">
                          {name}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-400 dark:text-neutral-300">
                          {formatBytes(size)}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-500/20 dark:text-green-300">
                        Ready
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export type { FileUploadProps, FileUploadEntry };
