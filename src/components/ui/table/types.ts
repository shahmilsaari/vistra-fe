import type { ReactNode } from "react";

export type TableColumn<T extends Record<string, unknown>> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => ReactNode;
  className?: string;
  hideable?: boolean;
  hidden?: boolean;
};
