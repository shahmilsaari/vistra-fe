import { create } from "zustand";

type TableState = {
  pageSize: number;
  sortField: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  setPageSize: (pageSize: number) => void;
  setSorting: (field: string, order: "asc" | "desc") => void;
  setCurrentPage: (page: number) => void;
  resetPagination: () => void;
};

export const useTableStore = create<TableState>((set) => ({
  pageSize: 25,
  sortField: "createdAt",
  sortOrder: "desc",
  currentPage: 1,
  setPageSize: (pageSize) => set({ pageSize, currentPage: 1 }),
  setSorting: (sortField, sortOrder) => set({ sortField, sortOrder, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  resetPagination: () => set({ currentPage: 1 }),
}));
