"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type StorageProgressProps = {
  used?: number;
  total?: number;
};

export function StorageProgress({ used = 41, total = 100 }: StorageProgressProps) {
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

  const percentage = Math.round((used / total) * 100);

  const options: ApexOptions = {
    chart: {
      type: "radialBar",
      background: "transparent",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: "65%",
        },
        track: {
          background: isDark ? "#374151" : "#e5e7eb",
          strokeWidth: "100%",
        },
        dataLabels: {
          name: {
            show: true,
            offsetY: 20,
            color: isDark ? "#9ca3af" : "#6b7280",
            fontSize: "12px",
            fontWeight: 400,
          },
          value: {
            show: true,
            offsetY: -15,
            color: isDark ? "#fff" : "#111",
            fontSize: "32px",
            fontWeight: 700,
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: ["#10b981"],
        stops: [0, 100],
      },
    },
    colors: ["#059669"],
    stroke: {
      lineCap: "round",
    },
    labels: ["Storage Used"],
  };

  return (
    <div className="rounded-2xl bg-white p-6 dark:bg-neutral-800">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Storage Progress</h3>
      </div>

      <Chart options={options} series={[percentage]} type="radialBar" height={220} />

      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-neutral-600 dark:text-neutral-400">Used</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-neutral-200 dark:bg-neutral-600" />
          <span className="text-xs text-neutral-600 dark:text-neutral-400">Available</span>
        </div>
      </div>
    </div>
  );
}
