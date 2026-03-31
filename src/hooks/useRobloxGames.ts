"use client";

import { useState, useEffect, useCallback } from "react";
import type { RobloxGame } from "@/lib/roblox";

interface UseRobloxGamesReturn {
  games: RobloxGame[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches live Roblox game data from our API route.
 * Auto-refreshes every 60 seconds to keep CCU current.
 */
export default function useRobloxGames(): UseRobloxGamesReturn {
  const [games, setGames] = useState<RobloxGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/games");
      if (!res.ok) throw new Error("Failed to load games");
      const data = await res.json();
      setGames(data.games);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();

    // Refresh CCU every 60s
    const interval = setInterval(fetchGames, 60_000);
    return () => clearInterval(interval);
  }, [fetchGames]);

  return { games, loading, error, refetch: fetchGames };
}
