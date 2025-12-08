"use client";

import { Select } from "@/components/ui/common";
import { ColumnToggle } from "./ColumnToggle";
import { InputText } from "../form/InputText";
import type { TableColumn } from "./types";
import { KeyboardEvent, ReactNode, useEffect, useId, useMemo, useState } from "react";

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
  /** Total number of available rows when pagination is handled externally. */
  totalEntries?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (sortField: string, sortOrder: "asc" | "desc") => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
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
  searchPlaceholder = "Search...",
  renderActions,
  getRowId,
  searchKeys,
  emptyMessage = "No data available",
  isLoading = false,
  skeletonRowCount = 5,
  totalEntries,
  sortField,
  sortOrder,
  onSortChange,
  pageSize,
  onPageSizeChange,
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
  const [currentPageSize, setCurrentPageSize] = useState(pageSize ?? pageSizeOptions[0] ?? 10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeof pageSize === "number" && pageSize !== currentPageSize) {
      setCurrentPageSize(pageSize);
      setCurrentPage(1);
    }
  }, [pageSize, currentPageSize]);

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

  const filteredCount = filteredRows.length;
  const totalCount = totalEntries ?? filteredCount;
  const totalPages = Math.max(1, Math.ceil(totalCount / currentPageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * currentPageSize;
  const pageRows = filteredRows.slice(startIndex, startIndex + currentPageSize);
  const from = totalCount === 0 ? 0 : startIndex + 1;
  const to = totalCount === 0 ? 0 : Math.min(startIndex + pageRows.length, totalCount);
  const colSpan = visibleColumns.length + (selectable ? 1 : 0) + (renderActions ? 1 : 0);

  const effectiveSortOrder = sortOrder ?? "desc";
  const handleSortRequest = (column: TableColumn<T>) => {
    if (!column.sortable || !onSortChange) {
      return;
    }

    const columnSortField = column.sortField ?? String(column.key);
    const isCurrentSort = columnSortField === sortField;
    const nextOrder = isCurrentSort && effectiveSortOrder === "desc" ? "asc" : "desc";
    onSortChange(columnSortField, nextOrder);
  };

  const handleHeaderKeyDown = (event: KeyboardEvent<HTMLDivElement>, column: TableColumn<T>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }
    event.preventDefault();
    handleSortRequest(column);
  };

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
    setCurrentPageSize(value);
    setCurrentPage(1);
    onPageSizeChange?.(value);
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
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="grow">
          <div className="relative max-w-sm w-full">
            <label htmlFor={searchInputId} className="sr-only">
              Search
            </label>
            <InputText
              id={searchInputId}
              value={searchTerm}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder={searchPlaceholder}
              className="ps-10 py-2.5 text-sm rounded-xl border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              containerClassName="space-y-0"
            />
            <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3.5">
              <svg
                className="size-4 text-neutral-400 dark:text-neutral-500"
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

        <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="whitespace-nowrap font-medium">Rows per page</span>
          <Select
            options={pageSizeOptionsMemo}
            value={currentPageSize}
            onChange={(value) => handlePageSizeChange(Number(value))}
            className="w-20 rounded-lg border-neutral-200 text-sm focus:border-neutral-400 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
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

      <div className="overflow-x-auto min-h-[400px] rounded-2xl border border-neutral-200/50 bg-white/80 backdrop-blur-sm shadow-lg shadow-neutral-200/50 dark:border-neutral-800/50 dark:bg-neutral-900/80 dark:shadow-neutral-950/50">
        <table className="min-w-full divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
          <thead className="bg-gradient-to-r from-neutral-50 to-neutral-100/50 dark:from-neutral-800/50 dark:to-neutral-800/30">
            <tr>
              {selectable && (
                <th scope="col" className="py-3 ps-4 pe-3 w-10">
                  <div className="flex items-center h-5">
                    <input
                      id={selectAllId}
                      type="checkbox"
                      className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:checked:bg-white dark:checked:border-white dark:focus:ring-offset-neutral-900"
                    />
                    <label className="sr-only" htmlFor={selectAllId}>
                      Select all rows
                    </label>
                  </div>
                </th>
              )}
              {visibleColumns.map((column) => {
                const columnSortField = column.sortField ?? String(column.key);
                const canSort = column.sortable && typeof onSortChange === "function";
                const isActiveSort = canSort && sortField === columnSortField;
                const activeOrder = isActiveSort ? (sortOrder ?? "desc") : undefined;
                return (
                  <th
                    key={columnSortField}
                    scope="col"
                    className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400"
                    aria-sort={
                      isActiveSort ? (activeOrder === "desc" ? "descending" : "ascending") : undefined
                    }
                  >
                    <div
                      className={`inline-flex items-center gap-1 ${canSort ? "cursor-pointer group hover:text-neutral-700 dark:hover:text-neutral-200" : ""}`}
                      role={canSort ? "button" : undefined}
                      tabIndex={canSort ? 0 : undefined}
                      onClick={canSort ? () => handleSortRequest(column) : undefined}
                      onKeyDown={canSort ? (event) => handleHeaderKeyDown(event, column) : undefined}
                    >
                      {column.header}
                      {column.sortable && (
                        <span className="flex flex-col text-[10px] leading-none text-neutral-400 dark:text-neutral-500">
                          <span
                            className={`leading-none ${isActiveSort && activeOrder === "asc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-500"}`}
                          >
                            ▲
                          </span>
                          <span
                            className={`leading-none ${isActiveSort && activeOrder === "desc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 dark:text-neutral-500"}`}
                          >
                            ▼
                          </span>
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              {renderActions && (
                <th className="py-3 px-6 text-right text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200/50 bg-white/60 dark:divide-neutral-800/50 dark:bg-neutral-900/60">
            {isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, index) => (
                <tr
                  key={`${tableId}-skeleton-${index}`}
                  className="animate-pulse"
                >
                  {selectable && (
                    <td className="py-4 ps-6 pe-3">
                      <div className="h-4 w-4 rounded bg-neutral-200 dark:bg-neutral-800"></div>
                    </td>
                  )}
                  {visibleColumns.map((column) => (
                    <td
                      key={`${tableId}-skeleton-${index}-${String(column.key)}`}
                      className="py-4 px-6"
                    >
                      <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-800 w-3/4"></div>
                    </td>
                  ))}
                  {renderActions && (
                    <td className="py-4 px-6">
                      <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-800 w-1/2 ms-auto"></div>
                    </td>
                  )}
                </tr>
              ))
            ) : pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={colSpan}
                  className="px-6 py-12 text-center text-sm text-neutral-500 dark:text-neutral-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <svg className="h-8 w-8 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>{emptyMessage}</p>
                  </div>
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
                    className="group transition-all hover:bg-gradient-to-r hover:from-violet-50/50 hover:to-indigo-50/30 dark:hover:from-violet-900/10 dark:hover:to-indigo-900/10"
                  >
                    {selectable && (
                      <td className="py-4 ps-6 pe-3">
                        <div className="flex items-center h-5">
                          <input
                            id={checkboxId}
                            type="checkbox"
                            className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:checked:bg-white dark:checked:border-white dark:focus:ring-offset-neutral-900"
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
                        className={`py-4 px-6 text-sm text-neutral-600 dark:text-neutral-300 ${column.className ?? ""}`}
                      >
                        {column.render ? column.render(row) : (row[column.key] as ReactNode)}
                      </td>
                    ))}
                    {renderActions && (
                      <td className="py-4 px-6 text-right text-sm font-medium">
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

      <div className="flex flex-wrap justify-between items-center gap-4 mt-6 text-sm text-neutral-500 dark:text-neutral-400">
        <div className="whitespace-nowrap">
          Showing <span className="font-semibold text-neutral-900 dark:text-white">{from}</span> to{" "}
          <span className="font-semibold text-neutral-900 dark:text-white">{to}</span> of{" "}
          <span className="font-semibold text-neutral-900 dark:text-white">{totalCount}</span>{" "}
          {totalCount === 1 ? "entry" : "entries"}
        </div>

        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
            disabled={safeCurrentPage === 1}
          >
            <span className="sr-only">Previous</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {pageButtons.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => handlePageChange(pageNumber)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${pageNumber === safeCurrentPage
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 disabled:opacity-50 disabled:pointer-events-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-white"
            disabled={safeCurrentPage === totalPages}
          >
            <span className="sr-only">Next</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
