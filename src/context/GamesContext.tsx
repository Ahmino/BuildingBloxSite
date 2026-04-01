"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import type { RobloxGame } from "@/lib/roblox";

interface GamesContextType {
  games: RobloxGame[];
  placeIds: string[];
  loading: boolean;
  error: string | null;
  addGameByUrl: (url: string) => Promise<{ game?: RobloxGame; error?: string }>;
  removeGame: (placeId: string) => void;
  refetch: () => void;
}

const GamesContext = createContext<GamesContextType | null>(null);

const LS_KEY = "buildingblox_place_ids";

/** Read place IDs from localStorage (instant, browser-only). */
function readLocalStorage(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Write place IDs to localStorage. */
function writeLocalStorage(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(ids));
  } catch { /* quota exceeded — ignore */ }
}

/** Persist place IDs to the server JSON file. */
async function persistToServer(ids: string[]) {
  try {
    await fetch("/api/games/list", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeIds: ids }),
    });
  } catch {
    // Silent fail — localStorage is the primary fallback
  }
}

/** Load the initial place ID list: localStorage first, then server file. */
async function loadInitialPlaceIds(): Promise<string[]> {
  // 1. Try localStorage (instant)
  const local = readLocalStorage();
  if (local && local.length > 0) return local;

  // 2. Fall back to server JSON file
  try {
    const res = await fetch("/api/games/list");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.placeIds) && data.placeIds.length > 0) {
        writeLocalStorage(data.placeIds);
        return data.placeIds;
      }
    }
  } catch { /* ignore */ }

  return [];
}

export function GamesProvider({ children }: { children: ReactNode }) {
  const [placeIds, setPlaceIds] = useState<string[]>([]);
  const [games, setGames] = useState<RobloxGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  /* ── Load saved place IDs on mount ────────────────────── */
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    loadInitialPlaceIds().then((ids) => {
      setPlaceIds(ids);
    });
  }, []);

  /* ── Fetch live game data whenever placeIds change ────── */
  const fetchGames = useCallback(async () => {
    if (placeIds.length === 0) {
      setGames([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const res = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeIds }),
      });
      if (!res.ok) throw new Error("Failed to load games");
      const data = await res.json();
      setGames(data.games);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [placeIds]);

  useEffect(() => {
    if (!initialized.current) return;
    fetchGames();
    const interval = setInterval(fetchGames, 60_000);
    return () => clearInterval(interval);
  }, [fetchGames]);

  /* ── Persist whenever placeIds change ─────────────────── */
  const isFirstRender = useRef(true);
  useEffect(() => {
    // Skip the initial empty render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (placeIds.length === 0) return;

    writeLocalStorage(placeIds);
    persistToServer(placeIds);
  }, [placeIds]);

  /* ── Add game by URL ──────────────────────────────────── */
  const addGameByUrl = useCallback(
    async (url: string): Promise<{ game?: RobloxGame; error?: string }> => {
      try {
        const res = await fetch("/api/games/resolve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const data = await res.json();

        if (!res.ok || !data.game) {
          return { error: data.error || "Could not resolve game." };
        }

        const game: RobloxGame = data.game;

        if (placeIds.includes(game.placeId)) {
          return { error: "This game is already in the list." };
        }

        const newIds = [...placeIds, game.placeId];
        setPlaceIds(newIds);
        setGames((prev) =>
          [...prev, game].sort((a, b) => b.playing - a.playing),
        );

        return { game };
      } catch {
        return { error: "Network error. Please try again." };
      }
    },
    [placeIds],
  );

  /* ── Remove game ──────────────────────────────────────── */
  const removeGame = useCallback(
    (placeId: string) => {
      const newIds = placeIds.filter((id) => id !== placeId);
      setPlaceIds(newIds);
      setGames((prev) => prev.filter((g) => g.placeId !== placeId));

      // Persist immediately
      writeLocalStorage(newIds);
      persistToServer(newIds);
    },
    [placeIds],
  );

  return (
    <GamesContext.Provider
      value={{ games, placeIds, loading, error, addGameByUrl, removeGame, refetch: fetchGames }}
    >
      {children}
    </GamesContext.Provider>
  );
}

export function useGames(): GamesContextType {
  const context = useContext(GamesContext);
  if (!context) throw new Error("useGames must be used within GamesProvider");
  return context;
}
