"use client";

import Image from "next/image";

export type MultiSelectOption = {
  value: string;
  label: string;
  iconSrc?: string;
  iconAlt?: string;
};

export type MultiSelectProps = {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  toggleClasses?: string;
  showSelectedList?: boolean;
};

const defaultToggleClasses =
  "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-neutral-600";

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className = "",
  toggleClasses = defaultToggleClasses,
  showSelectedList = true,
}: MultiSelectProps) {
  const config = {
    placeholder,
    toggleTag: '<button type="button" aria-expanded="false"></button>',
    toggleClasses,
    toggleCountText: "selected",
    dropdownClasses:
      "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
    optionClasses:
      "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-hidden focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
    optionTemplate:
      "<div class=\"flex items-center\"><div class=\"me-2\" data-icon></div><div><div class=\"hs-selected:font-semibold text-sm text-gray-800 dark:text-neutral-200\" data-title></div></div><div class=\"ms-auto\"><span class=\"hidden hs-selected:block\"><svg class=\"shrink-0 size-4 text-blue-600\" xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" viewBox=\"0 0 16 16\"><path d=\"M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z\"/></svg></span></div></div>",
    extraMarkup:
      '<div class="absolute top-1/2 end-3 -translate-y-1/2"><svg class="shrink-0 size-3.5 text-gray-500 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg></div>',
  };

  const wrapperClassName = ["relative w-full text-gray-700 dark:text-neutral-200", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName}>
      <select
        multiple
        className="hidden"
        data-hs-select={JSON.stringify(config)}
        value={value}
        onChange={(event) => {
          const selected = Array.from(event.target.selectedOptions).map((option) => option.value);
          onChange(selected);
        }}
      >
        {options.map((option) => {
          const iconMarkup = option.iconSrc
            ? `<img class="shrink-0 size-5 rounded-full" src="${option.iconSrc}" alt="${
                option.iconAlt ?? option.label
              }" />`
            : undefined;

          return (
            <option
              key={option.value}
              value={option.value}
              data-hs-select-option={
                iconMarkup
                  ? JSON.stringify({
                      icon: iconMarkup,
                    })
                  : undefined
              }
            >
              {option.label}
            </option>
          );
        })}
      </select>

      {showSelectedList && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.length ? (
            value.map((selectedValue) => {
              const option = options.find((item) => item.value === selectedValue);
              if (!option) {
                return null;
              }

              return (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 dark:border-neutral-800 dark:text-neutral-200"
                >
                  {option.iconSrc && (
                    <Image
                      src={option.iconSrc}
                      alt={option.iconAlt ?? option.label}
                      width={20}
                      height={20}
                      className="size-5 rounded-full object-cover"
                    />
                  )}
                  <span>{option.label}</span>
                </span>
              );
            })
          ) : (
            <span className="text-xs text-gray-400 dark:text-neutral-500">No option selected</span>
          )}
        </div>
      )}
    </div>
  );
}
