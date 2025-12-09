"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type StorageUsageChartProps = {
  data: Array<{ kind: string; count: number }>;
  totalBytes: number;
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const FILE_TYPE_COLORS: Record<string, string> = {
  pdf: "#ef4444",
  doc: "#3b82f6",
  docx: "#3b82f6",
  xls: "#10b981",
  xlsx: "#10b981",
  ppt: "#f59e0b",
  pptx: "#f59e0b",
  jpg: "#ec4899",
  jpeg: "#ec4899",
  png: "#8b5cf6",
  gif: "#06b6d4",
  mp4: "#6366f1",
  mp3: "#14b8a6",
  zip: "#737373",
  default: "#6366f1",
};

const getColorForType = (kind: string): string => {
  const lowerKind = kind.toLowerCase();
  return FILE_TYPE_COLORS[lowerKind] || FILE_TYPE_COLORS.default;
};

export function StorageUsageChart({ data, totalBytes }: StorageUsageChartProps) {
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

  // Calculate storage per kind (estimate based on count proportion)
  const totalFiles = data.reduce((sum, item) => sum + item.count, 0);
  const storageData = data
    .map((item) => ({
      kind: item.kind,
      bytes: totalFiles > 0 ? (item.count / totalFiles) * totalBytes : 0,
      count: item.count,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  // Treemap data format
  const treemapData = storageData.map((item) => ({
    x: item.kind.toUpperCase(),
    y: item.bytes,
  }));

  const options: ApexOptions = {
    chart: {
      type: "treemap",
      background: "transparent",
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 500,
      },
    },
    legend: { show: false },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
        colorScale: {
          ranges: storageData.map((item, index) => ({
            from: index,
            to: index,
            color: getColorForType(item.kind),
          })),
        },
      },
    },
    colors: storageData.map((item) => getColorForType(item.kind)),
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "13px",
        fontWeight: 600,
      },
      formatter: function (text: string, op: { value: number }) {
        return [text, formatBytes(op.value)];
      },
      offsetY: -2,
    },
    stroke: {
      width: 2,
      colors: [isDark ? "#18181b" : "#ffffff"],
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
      y: {
        formatter: (val: number) => formatBytes(val),
        title: {
          formatter: (seriesName: string) => seriesName,
        },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No storage data</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Storage Header */}
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <p className="text-3xl font-bold text-neutral-900 dark:text-white">{formatBytes(totalBytes)}</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">total storage used</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">{totalFiles}</p>
          <p className="text-xs text-neutral-400">files</p>
        </div>
      </div>

      <Chart
        options={options}
        series={[{ data: treemapData }]}
        type="treemap"
        height={240}
      />
    </div>
  );
}
