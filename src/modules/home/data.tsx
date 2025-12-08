"use client";

import { FileIcon, type DataTableProps } from "@/components/ui";

export type DocumentItem = {
  id: number;
  name: string;
  createdBy: string;
  date: string;
  size: string;
  kind: "folder" | "file";
  path?: string;
};

const renderNameCell = (row: DocumentItem) => {
  const iconColor = row.kind === "folder" ? "text-amber-500 dark:text-amber-400" : "text-sky-500 dark:text-sky-400";

  return (
    <div className="flex w-full items-center gap-3">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-inner dark:border-neutral-700 dark:bg-neutral-900 ${iconColor}`}>
        <FileIcon kind={row.kind} name={row.name} className="h-5 w-5" />
      </span>
      <span className="min-w-0 text-sm font-medium text-neutral-900 dark:text-neutral-100">{row.name}</span>
    </div>
  );
};

export const documents: DocumentItem[] = [
  { id: 1, name: "Appointment resolutions", createdBy: "John Green", date: "12 Apr 2024", size: "-", kind: "folder", path: "/documents/policies" },
  { id: 2, name: "Policy approvals", createdBy: "John Green", date: "12 Apr 2024", size: "-", kind: "folder", path: "/documents/approvals" },
  { id: 3, name: "2025_01_15_Director_Appointment_Resolution.pdf", createdBy: "John Green", date: "12 Apr 2024", size: "1 KB", kind: "file", path: "/documents/2025" },
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
    sortField: "name",
    render: renderNameCell,
    className: "text-sm text-gray-900 dark:text-neutral-100",
  },
  {
    key: "createdBy",
    header: "Created by",
    sortable: false,
    className: "text-sm text-gray-500 dark:text-neutral-400",
  },
  {
    key: "date",
    header: "Date",
    sortable: true,
    sortField: "createdAt",
    className: "text-sm text-gray-500 dark:text-neutral-400",
  },
  {
    key: "size",
    header: "Size",
    sortable: true,
    sortField: "size",
    className: "text-sm text-gray-500 dark:text-neutral-400",
  },
];
