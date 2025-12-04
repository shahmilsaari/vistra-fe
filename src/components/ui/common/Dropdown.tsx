"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option = {
  label: string;
  value: string | number;
};

export type DropdownProps = {
  options: Option[];
  value: Option["value"];
  onChange: (value: Option["value"]) => void;
  align?: "left" | "right";
  className?: string;
};

export function Dropdown({ options, value, onChange, align = "right", className = "" }: DropdownProps) {
  const id = useId().replace(/:/g, "");
  const dropdownId = `${id}-dropdown`;
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const alignmentClass = align === "right" ? "[--placement:bottom-right]" : "[--placement:bottom-left]";

  return (
    <div ref={ref} className={["hs-dropdown inline-flex", alignmentClass, className].filter(Boolean).join(" ")}>
      <button
        type="button"
        className="hs-dropdown-toggle inline-flex items-center gap-x-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"
        id={dropdownId}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {options.find((option) => option.value === value)?.label ?? value}
        <svg className="size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </button>
      <div
        className={`hs-dropdown-menu z-20 ${isOpen ? "block" : "hidden"} min-w-32 rounded-lg border border-gray-200 bg-white p-1 text-sm shadow-lg transition-[opacity,margin] duration hs-dropdown-open:opacity-100 dark:border-neutral-700 dark:bg-neutral-900`}
        aria-labelledby={dropdownId}
      >
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left ${isSelected
                ? "bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-white"
                : "text-gray-700 hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
              {isSelected && (
                <svg className="size-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
