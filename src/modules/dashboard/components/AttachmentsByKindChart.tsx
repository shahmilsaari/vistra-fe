"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type AttachmentsByKindChartProps = {
  data: Array<{ kind: string; count: number }>;
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

export function AttachmentsByKindChart({ data }: AttachmentsByKindChartProps) {
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

  const total = data.reduce((sum, item) => sum + item.count, 0);
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const series = sortedData.map((item) => Math.round((item.count / total) * 100));
  const labels = sortedData.map((item) => item.kind.toUpperCase());
  const colors = sortedData.map((item) => getColorForType(item.kind));

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      background: "transparent",
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: "30%",
          background: "transparent",
        },
        track: {
          background: isDark ? "#27272a" : "#f4f4f5",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: false,
          },
        },
        barLabels: {
          enabled: true,
          useSeriesColors: true,
          offsetX: -8,
          fontSize: "12px",
          formatter: function (seriesName: string, opts: { w: { globals: { series: number[] } }; seriesIndex: number }) {
            return seriesName + ": " + opts.w.globals.series[opts.seriesIndex] + "%";
          },
        },
      },
    },
    colors,
    labels,
    stroke: {
      lineCap: "round",
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 280,
          },
        },
      },
    ],
  };

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No files yet</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Chart options={options} series={series} type="radialBar" height={320} />

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {sortedData.slice(0, 5).map((item) => (
          <div key={item.kind} className="flex items-center gap-2">
            <div
              className="size-2.5 rounded-full"
              style={{ backgroundColor: getColorForType(item.kind) }}
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">
              {item.kind.toUpperCase()}
            </span>
            <span className="text-xs font-medium text-neutral-900 dark:text-white">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
