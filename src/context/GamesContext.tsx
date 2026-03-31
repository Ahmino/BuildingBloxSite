"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import type { RobloxGame } from "@/lib/roblox";
import { GAME_CONFIGS } from "@/lib/roblox";

interface GamesContextType {
  /** Live game data sorted by CCU, refreshes automatically. */
  games: RobloxGame[];
  /** The managed list of place IDs (source of truth for which games to show). */
  placeIds: string[];
  loading: boolean;
  error: string | null;
  /** Add a game by pasting a Roblox URL. Returns the resolved game or an error string. */
  addGameByUrl: (url: string) => Promise<{ game?: RobloxGame; error?: string }>;
  /** Remove a game by its place ID. */
  removeGame: (placeId: string) => void;
  /** Force refresh live data. */
  refetch: () => void;
}

const GamesContext = createContext<GamesContextType | null>(null);

const DEFAULT_PLACE_IDS = GAME_CONFIGS.map((c) => c.placeId);

export function GamesProvider({ children }: { children: ReactNode }) {
  const [placeIds, setPlaceIds] = useState<string[]>(DEFAULT_PLACE_IDS);
  const [games, setGames] = useState<RobloxGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Fetch live data for all current placeIds ─────────── */
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
    fetchGames();
    const interval = setInterval(fetchGames, 60_000);
    return () => clearInterval(interval);
  }, [fetchGames]);

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

        // Prevent duplicates
        if (placeIds.includes(game.placeId)) {
          return { error: "This game is already in the list." };
        }

        setPlaceIds((prev) => [...prev, game.placeId]);
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
  const removeGame = useCallback((placeId: string) => {
    setPlaceIds((prev) => prev.filter((id) => id !== placeId));
    setGames((prev) => prev.filter((g) => g.placeId !== placeId));
  }, []);

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
