"use client";

import { PageShell, PageHeader } from "@/components/layout";
import { GameCard, StatCard, Button } from "@/components/ui";
import { useGames } from "@/context/GamesContext";
import { compactNumber } from "@/lib/format";

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/60"
        >
          <div className="aspect-square w-full bg-gray-800" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-3/4 rounded bg-gray-800" />
            <div className="h-3 w-1/3 rounded bg-gray-800" />
            <div className="h-3 w-full rounded bg-gray-800" />
            <div className="h-3 w-5/6 rounded bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GamesPage() {
  const { games, loading, error, refetch } = useGames();

  const totalPlaying = games.reduce((sum, g) => sum + g.playing, 0);
  const totalVisits = games.reduce((sum, g) => sum + g.visits, 0);
  const totalFavorites = games.reduce((sum, g) => sum + g.favoritedCount, 0);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <PageHeader
          title="Our Games"
          description="Explore the full BuildingBlox portfolio — every game below is pulling live player counts directly from Roblox."
        />

        {!loading && games.length > 0 && (
          <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Live Players" value={compactNumber(totalPlaying)} description="playing right now" valueClassName="text-green-400" />
            <StatCard label="Total Visits" value={compactNumber(totalVisits)} description="all-time across all games" valueClassName="text-blue-400" />
            <StatCard label="Total Favorites" value={compactNumber(totalFavorites)} description="player favorites" valueClassName="text-red-400" />
            <StatCard label="Games" value={String(games.length)} description="in the portfolio" valueClassName="text-brand-400" />
          </div>
        )}

        {error && (
          <div className="mb-8 flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 py-16 text-center">
            <p className="text-red-400">{error}</p>
            <Button variant="secondary" onClick={refetch} className="mt-4">Try Again</Button>
          </div>
        )}

        {loading && <LoadingSkeleton />}

        {!loading && !error && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game) => (
              <GameCard key={game.universeId} game={game} />
            ))}
          </div>
        )}

        {!loading && games.length > 0 && (
          <p className="mt-8 text-center text-xs text-gray-600">
            Player counts refresh automatically every 60 seconds.
          </p>
        )}
      </div>
    </PageShell>
  );
}
