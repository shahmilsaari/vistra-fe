"use client";

import type { DataTableProps, MultiSelectOption } from "@/components/ui";

export type DocumentItem = {
  id: number;
  name: string;
  createdBy: string;
  date: string;
  size: string;
  kind: "folder" | "file";
};

const renderNameCell = (row: DocumentItem) => {
  const iconColor = row.kind === "folder" ? "text-amber-500 dark:text-amber-400" : "text-sky-500 dark:text-sky-400";
  const iconPath =
    row.kind === "folder"
      ? "M3 7h5l2 2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h8"
      : "M6 3h8l5 5v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z";

  return (
    <div className="flex items-center gap-3">
      <span className={`grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-slate-50 dark:border-neutral-700 dark:bg-neutral-900 ${iconColor}`}>
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d={iconPath} />
          {row.kind === "file" && <path d="M14 3v5h5" />}
        </svg>
      </span>
      <span className="text-sm font-semibold text-gray-900 dark:text-neutral-100">{row.name}</span>
    </div>
  );
};

export const documents: DocumentItem[] = [
  { id: 1, name: "Appointment resolutions", createdBy: "John Green", date: "12 Apr 2024", size: "-", kind: "folder" },
  { id: 2, name: "Policy approvals", createdBy: "John Green", date: "12 Apr 2024", size: "-", kind: "folder" },
  { id: 3, name: "2025_01_15_Director_Appointment_Resolution.pdf", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
  { id: 4, name: "2024_12_10_Dividend_Declaration_Resolution.docx", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
  { id: 5, name: "2023_08_05_Investment_Policy_Approval.pdf", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
  { id: 6, name: "2023_07_30_Quarterly_Audit_Report.pdf", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
  { id: 7, name: "Shareholder meetings", createdBy: "John Green", date: "12 Apr 2024", size: "-", kind: "folder" },
  { id: 8, name: "2023_04_22_Risk_Assessment.docx", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
  { id: 9, name: "2022_10_11_Environmental_Policy.pdf", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
  { id: 10, name: "Compliance binders", createdBy: "John Green", date: "12 Apr 2024", size: "-", kind: "folder" },
  { id: 11, name: "2024_05_01_Tax_Filing_Summary.pdf", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
  { id: 12, name: "Executive Committee", createdBy: "John Green", date: "12 Apr 2024", size: "-", kind: "folder" },
  { id: 13, name: "2024_03_16_Board_Minutes.docx", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
  { id: 14, name: "2022_02_28_Service_Agreement.pdf", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
  { id: 15, name: "Audit working papers", createdBy: "John Green", date: "12 Apr 2024", size: "-", kind: "folder" },
  { id: 16, name: "2021_11_12_IT_Secure_Practice.pdf", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
  { id: 17, name: "2020_09_07_Retention_Schedule.docx", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
  { id: 18, name: "HR archive", createdBy: "John Green", date: "12 Apr 2024", size: "-", kind: "folder" },
  { id: 19, name: "2023_06_19_Data_Governance.pdf", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
  { id: 20, name: "2024_01_03_Annual_Review.docx", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file" },
];

export const documentColumns: DataTableProps<DocumentItem>["columns"] = [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: renderNameCell,
    className: "text-sm text-gray-900 dark:text-neutral-100",
  },
  {
    key: "createdBy",
    header: "Created by",
    sortable: true,
    className: "text-sm text-gray-500 dark:text-neutral-400",
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    className: "text-sm text-gray-500 dark:text-neutral-400",
  },
  {
    key: "size",
    header: "Size",
    sortable: false,
    className: "text-sm text-gray-500 dark:text-neutral-400",
  },
];

export const multiSelectOptions: MultiSelectOption[] = [
  {
    value: "1",
    label: "James Collins",
    iconSrc:
      "https://images.unsplash.com/photo-1659482633369-9fe69af50bfb?auto=format&fit=facearea&facepad=3&w=80&h=80&q=80",
  },
  {
    value: "2",
    label: "Amanda Harvey",
    iconSrc:
      "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?auto=format&fit=facearea&facepad=3&w=80&h=80&q=80",
  },
  {
    value: "3",
    label: "Costa Quinn",
    iconSrc:
      "https://images.unsplash.com/photo-1601935111741-ae98b2b230b0?auto=format&fit=facearea&facepad=3&w=80&h=80&q=80",
  },
];
