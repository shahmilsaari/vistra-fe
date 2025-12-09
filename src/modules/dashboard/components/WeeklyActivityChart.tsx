"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type WeeklyActivityChartProps = {
  data?: Array<{ day: string; uploads: number }>;
};

// Dummy data for the week
const defaultData = [
  { day: "S", uploads: 45 },
  { day: "M", uploads: 52 },
  { day: "T", uploads: 74 },
  { day: "W", uploads: 85 },
  { day: "T", uploads: 62 },
  { day: "F", uploads: 48 },
  { day: "S", uploads: 35 },
];

export function WeeklyActivityChart({ data = defaultData }: WeeklyActivityChartProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const maxValue = Math.max(...data.map((d) => d.uploads));
  const highlightIndex = data.findIndex((d) => d.uploads === maxValue);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
        distributed: true,
        dataLabels: { position: "top" },
      },
    },
    colors: data.map((_, i) =>
      i === highlightIndex ? "#059669" : isDark ? "#374151" : "#e5e7eb"
    ),
    dataLabels: {
      enabled: true,
      formatter: (val, opts) => {
        if (opts.dataPointIndex === highlightIndex) {
          return `${val}%`;
        }
        return "";
      },
      offsetY: -25,
      style: {
        fontSize: "12px",
        fontWeight: 600,
        colors: [isDark ? "#fff" : "#111"],
      },
    },
    legend: { show: false },
    grid: { show: false },
    xaxis: {
      categories: data.map((d) => d.day),
      labels: {
        style: {
          colors: isDark ? "#9ca3af" : "#6b7280",
          fontSize: "13px",
          fontWeight: 500,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    tooltip: { enabled: false },
    states: {
      hover: { filter: { type: "darken" } },
    },
  };

  const series = [{ name: "Uploads", data: data.map((d) => d.uploads) }];

  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-neutral-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">File Analytics</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Weekly upload activity</p>
      </div>
      <Chart options={options} series={series} type="bar" height={200} />
    </div>
  );
}
