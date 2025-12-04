"use client";

import { useEffect, useRef, useState } from "react";
import type { TableColumn } from "./types";

type ColumnToggleProps<T extends Record<string, unknown>> = {
  columns: TableColumn<T>[];
  visibleColumnsMap: Record<string, boolean>;
  visibleColumnCount: number;
  onToggle: (key: keyof T) => void;
};

export function ColumnToggle<T extends Record<string, unknown>>({
  columns,
  visibleColumnsMap,
  visibleColumnCount,
  onToggle,
}: ColumnToggleProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [showAbove, setShowAbove] = useState(false);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (isOpen && ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowAbove(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setShowAbove(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const calculatePlacement = () => {
      const triggerRect = ref.current?.getBoundingClientRect();
      const panelHeight = panelRef.current?.offsetHeight ?? 0;
      if (!triggerRect) {
        setShowAbove(false);
        return;
      }
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;
      if (spaceBelow < panelHeight + 12 && spaceAbove > spaceBelow) {
        setShowAbove(true);
      } else {
        setShowAbove(false);
        }
    };

    calculatePlacement();
    window.addEventListener("resize", calculatePlacement);
    window.addEventListener("scroll", calculatePlacement, { passive: true });
    return () => {
      window.removeEventListener("resize", calculatePlacement);
      window.removeEventListener("scroll", calculatePlacement);
    };
  }, [isOpen, columns]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() =>
          setIsOpen((open) => {
            if (open) {
              setShowAbove(false);
            }
            return !open;
          })
        }
        className="inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-2xs transition hover:bg-gray-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
      >
        Columns
        <svg
          className={`size-3 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className={`absolute right-0 z-20 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-md dark:border-neutral-700 dark:bg-neutral-900 ${showAbove ? "bottom-full mb-2" : "mt-2"}`}
        >
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-neutral-500">
            Toggle columns
          </p>
          <div className="max-h-60 space-y-1 overflow-y-auto pr-1">
            {columns.map((column) => {
              const columnKey = String(column.key);
              const hideable = column.hideable ?? true;
              const isChecked = column.hideable === false ? true : visibleColumnsMap[columnKey] !== false;
              const disableToggle = !hideable || (isChecked && visibleColumnCount === 1);
              return (
                <label
                  key={columnKey}
                  className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm ${
                    disableToggle
                      ? "text-gray-300 dark:text-neutral-600"
                      : "text-gray-700 hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={disableToggle}
                    onChange={() => onToggle(column.key)}
                    className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span>{column.header}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
