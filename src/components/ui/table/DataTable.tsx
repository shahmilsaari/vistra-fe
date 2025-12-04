"use client";

import { Select, Skeleton } from "@/components/ui/common";
import { ColumnToggle } from "./ColumnToggle";
import { InputText } from "../form/InputText";
import type { TableColumn } from "./types";
import { ReactNode, useEffect, useId, useMemo, useState } from "react";

export type DataTableProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: TableColumn<T>[];
  /**
   * Sets the DOM id on the outer wrapper; auto-generated when omitted.
   */
  id?: string;
  className?: string;
  selectable?: boolean;
  pageSizeOptions?: number[];
  searchPlaceholder?: string;
  renderActions?: (row: T) => ReactNode;
  getRowId?: (row: T, index: number) => string | number;
  searchKeys?: (keyof T)[];
  emptyMessage?: string;
  isLoading?: boolean;
  skeletonRowCount?: number;
};

/**
 * Renders the Preline datatable markup with client-side pagination and column visibility controls.
 */
export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  id,
  className = "",
  selectable = true,
  pageSizeOptions = [10, 15, 20, 25, 50],
  searchPlaceholder = "Search",
  renderActions,
  getRowId,
  searchKeys,
  emptyMessage = "No data available",
  isLoading = false,
  skeletonRowCount = 5,
}: DataTableProps<T>) {
  const generatedId = useId().replace(/:/g, "");
  const tableId = id ?? `hs-datatable-${generatedId}`;
  const searchInputId = `${tableId}-search`;
  const selectAllId = `${tableId}-select-all`;

  const initialVisibility = useMemo(() => {
    const map: Record<string, boolean> = {};
    columns.forEach((column) => {
      const stringKey = String(column.key);
      map[stringKey] = column.hideable === false ? true : !(column.hidden ?? false);
    });
    return map;
  }, [columns]);

  const [visibleColumnsMap, setVisibleColumnsMap] = useState(initialVisibility);

  useEffect(() => {
    setVisibleColumnsMap(initialVisibility);
  }, [initialVisibility]);

  const visibleColumns = useMemo(
    () =>
      columns.filter((column) => {
        if (column.hideable === false) {
          return true;
        }
        return visibleColumnsMap[String(column.key)] !== false;
      }),
    [columns, visibleColumnsMap]
  );

  const visibleColumnCount = visibleColumns.length;
  const hideableColumns = columns.filter((column) => column.hideable ?? true);
  const canToggleColumns = hideableColumns.length > 0;

  const normalizedSearchKeys =
    searchKeys ?? (columns.map((column) => column.key) as (keyof T)[]);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] ?? 10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) {
      return data;
    }

    const lowerQuery = searchTerm.toLowerCase();
    return data.filter((row) =>
      normalizedSearchKeys.some((key) => {
        const value = row[key];
        return value != null && String(value).toLowerCase().includes(lowerQuery);
      })
    );
  }, [data, normalizedSearchKeys, searchTerm]);

  const totalCount = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const pageRows = filteredRows.slice(startIndex, startIndex + pageSize);
  const from = totalCount === 0 ? 0 : startIndex + 1;
  const to = totalCount === 0 ? 0 : Math.min(startIndex + pageRows.length, totalCount);
  const colSpan = visibleColumns.length + (selectable ? 1 : 0) + (renderActions ? 1 : 0);

  const pageButtons = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, safeCurrentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }
    return pages;
  }, [safeCurrentPage, totalPages]);

  const pageSizeOptionsMemo = useMemo(
    () => pageSizeOptions.map((option) => ({ label: String(option), value: option })),
    [pageSizeOptions]
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const toggleColumnVisibility = (key: keyof T) => {
    const stringKey = String(key);
    const columnDef = columns.find((column) => String(column.key) === stringKey);
    if (!columnDef || columnDef.hideable === false) {
      return;
    }

    setVisibleColumnsMap((prev) => {
      const currentlyVisible = prev[stringKey] !== false;
      if (currentlyVisible) {
        const totalVisible = columns.reduce((count, column) => {
          const columnKey = String(column.key);
          const visible = column.hideable === false ? true : prev[columnKey] !== false;
          return visible ? count + 1 : count;
        }, 0);

        if (totalVisible <= 1) {
          return prev;
        }
      }

      return {
        ...prev,
        [stringKey]: !currentlyVisible,
      };
    });
  };

  return (
    <div id={tableId} className={`flex flex-col ${className}`}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="grow">
          <div className="relative max-w-xs w-full">
            <label htmlFor={searchInputId} className="sr-only">
              Search
            </label>
            <InputText
              id={searchInputId}
              value={searchTerm}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="ps-9"
              containerClassName="space-y-0"
            />
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
              <svg
                className="size-4 text-gray-400 dark:text-neutral-500"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-base text-gray-600 dark:text-neutral-400">
          <span className="whitespace-nowrap">Rows per page</span>
          <Select
            options={pageSizeOptionsMemo}
            value={pageSize}
            onChange={(value) => handlePageSizeChange(Number(value))}
            className="w-20"
          />
        </div>

        {canToggleColumns && (
          <ColumnToggle
            columns={columns}
            visibleColumnsMap={visibleColumnsMap}
            visibleColumnCount={visibleColumnCount}
            onToggle={toggleColumnVisibility}
          />
        )}
      </div>

      <div className="overflow-x-auto min-h-130">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm shadow-slate-200 dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-none">
              <table className="min-w-full">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    {selectable && (
                      <th scope="col" className="py-3 ps-3">
                        <div className="flex items-center h-5">
                          <input
                            id={selectAllId}
                            type="checkbox"
                            className="border-gray-300 rounded-sm text-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:focus:ring-offset-neutral-900"
                          />
                          <label className="sr-only" htmlFor={selectAllId}>
                            Select all rows
                          </label>
                        </div>
                      </th>
                    )}
                    {visibleColumns.map((column) => (
                      <th
                        key={String(column.key)}
                        scope="col"
                        className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-white/80"
                      >
                        <div className="inline-flex items-center gap-1">
                          {column.header}
                          {column.sortable && (
                            <svg
                              className="size-3.5 text-white/60"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m7 15 5 5 5-5"></path>
                              <path d="m7 9 5-5 5 5"></path>
                            </svg>
                          )}
                        </div>
                      </th>
                    ))}
                    {renderActions && (
                      <th className="py-3 px-4 text-end text-xs font-semibold uppercase tracking-wider text-white/80">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="bg-white dark:bg-neutral-950">
                  {isLoading ? (
                    Array.from({ length: skeletonRowCount }).map((_, index) => (
                      <tr
                        key={`${tableId}-skeleton-${index}`}
                        className="border-b border-gray-100 bg-white hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                      >
                        {selectable && (
                          <td className="py-3 ps-3">
                            <Skeleton className="h-5 w-5 rounded" radius="full" />
                          </td>
                        )}
                        {visibleColumns.map((column) => (
                          <td
                            key={`${tableId}-skeleton-${index}-${String(column.key)}`}
                            className="py-3 px-4"
                          >
                            <Skeleton className="h-5" />
                          </td>
                        ))}
                        {renderActions && (
                          <td className="py-3 px-4">
                            <Skeleton className="h-5" />
                          </td>
                        )}
                      </tr>
                    ))
                  ) : pageRows.length === 0 ? (
                    <tr className="border-b border-gray-100 bg-white dark:border-neutral-800 dark:bg-neutral-950">
                      <td
                        colSpan={colSpan}
                        className="px-4 py-10 text-center text-sm text-gray-400 dark:text-neutral-500"
                      >
                        {emptyMessage}
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((row, rowIndex) => {
                      const absoluteIndex = startIndex + rowIndex;
                      const rowKey = getRowId?.(row, absoluteIndex) ?? `${tableId}-row-${absoluteIndex}`;
                      const checkboxId = `${tableId}-row-checkbox-${absoluteIndex}`;
                      return (
                        <tr
                          key={rowKey}
                          className="border-b border-gray-100 bg-white hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900"
                        >
                          {selectable && (
                            <td className="py-3 ps-3">
                              <div className="flex items-center h-5">
                                <input
                                  id={checkboxId}
                                  type="checkbox"
                                  className="border-gray-300 rounded-sm text-blue-500 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-600 dark:focus:ring-offset-neutral-900"
                                />
                                <label className="sr-only" htmlFor={checkboxId}>
                                  Select row
                                </label>
                              </div>
                            </td>
                          )}
                          {visibleColumns.map((column) => (
                            <td
                              key={`${rowKey}-${String(column.key)}`}
                              className={`py-3 px-4 text-sm text-gray-600 dark:text-neutral-200 ${column.className ?? ""}`}
                            >
                              {column.render ? column.render(row) : (row[column.key] as ReactNode)}
                            </td>
                          ))}
                          {renderActions && (
                            <td className="py-3 px-4 text-end text-sm font-medium">
                              {renderActions(row)}
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mt-4 text-base text-gray-600 dark:text-neutral-400">
        <div className="whitespace-nowrap">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{from}</span> to{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{to}</span> of{" "}
          <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span>{" "}
          {totalCount === 1 ? "entry" : "entries"}
        </div>

        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            className="p-2.5 min-w-10 inline-flex justify-center items-center gap-x-2 rounded-full text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            disabled={safeCurrentPage === 1}
          >
            «
          </button>

          {pageButtons.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => handlePageChange(pageNumber)}
              className={`min-w-10 rounded-full px-3 py-1 text-sm transition ${pageNumber === safeCurrentPage
                ? "bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-white"
                : "text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            className="p-2.5 min-w-10 inline-flex justify-center items-center gap-x-2 rounded-full text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            disabled={safeCurrentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
