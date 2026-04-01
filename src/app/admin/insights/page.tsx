"use client";

import { useData } from "@/context/DataContext";
import { useGames } from "@/context/GamesContext";
import { PageHeader } from "@/components/layout";
import InsightCards from "@/components/admin/insights/InsightCards";
import ChatPanel from "@/components/admin/insights/ChatPanel";

export default function InsightsPage() {
  const { finances } = useData();
  const { games, loading: gamesLoading } = useGames();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8" style={{ minHeight: "calc(100vh - 80px)" }}>
      <PageHeader
        title="AI Insights"
        description="Ask your studio assistant about finances, game performance, and strategic recommendations."
      />

      {/* Summary cards */}
      <InsightCards finances={finances} games={games} />

      {/* Chat — takes remaining height */}
      <div className="flex-1" style={{ minHeight: "560px" }}>
        {gamesLoading ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-gray-800 bg-gray-950">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
              Loading game data…
            </div>
          </div>
        ) : (
          <ChatPanel finances={finances} games={games} />
        )}
      </div>
    </div>
  );
}
