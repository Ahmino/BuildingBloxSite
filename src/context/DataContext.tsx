"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Game, GameFormData, MonthlyFinance, FinanceFormData } from "@/types";
import { defaultGames } from "@/data/games";
import { defaultFinances } from "@/data/finances";
import { generateId } from "@/lib/format";

interface DataContextType {
  games: Game[];
  addGame: (data: GameFormData) => void;
  updateGame: (id: string, data: Partial<GameFormData>) => void;
  deleteGame: (id: string) => void;
  finances: MonthlyFinance[];
  addFinance: (data: FinanceFormData) => void;
  updateFinance: (id: string, data: Partial<FinanceFormData>) => void;
  deleteFinance: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>(defaultGames);
  const [finances, setFinances] = useState<MonthlyFinance[]>(defaultFinances);

  /* ── Games ─────────────────────────────────────────────── */
  const addGame = useCallback((data: GameFormData) => {
    setGames((prev) => [...prev, { ...data, id: generateId() }]);
  }, []);

  const updateGame = useCallback((id: string, updates: Partial<GameFormData>) => {
    setGames((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  }, []);

  const deleteGame = useCallback((id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
  }, []);

  /* ── Finances ──────────────────────────────────────────── */
  const addFinance = useCallback((data: FinanceFormData) => {
    setFinances((prev) => [...prev, { ...data, id: generateId() }]);
  }, []);

  const updateFinance = useCallback((id: string, updates: Partial<FinanceFormData>) => {
    setFinances((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }, []);

  const deleteFinance = useCallback((id: string) => {
    setFinances((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <DataContext.Provider
      value={{
        games, addGame, updateGame, deleteGame,
        finances, addFinance, updateFinance, deleteFinance,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
}
