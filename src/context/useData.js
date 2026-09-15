import { createContext, useContext } from "react";

export const DataCtx = createContext(null);

export function useData() {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}