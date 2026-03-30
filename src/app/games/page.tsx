"use client";

import { PageShell, PageHeader } from "@/components/layout";
import { Card, Badge } from "@/components/ui";
import { defaultGames } from "@/data/games";
import { compactNumber } from "@/lib/format";

export default function GamesPage() {
  const totalCCU = defaultGames.reduce((sum, g) => sum + g.ccu, 0);
  const totalMAU = defaultGames.reduce((sum, g) => sum + g.mau, 0);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12">
        <PageHeader
          title="Our Games"
          description="Explore our portfolio of Roblox experiences, from live titles to upcoming releases."
        >
          <div className="mt-4 flex gap-6 text-sm">
            <span className="text-gray-400">
              Total CCU: <span className="font-semibold text-green-400">{compactNumber(totalCCU)}</span>
            </span>
            <span className="text-gray-400">
              Total MAU: <span className="font-semibold text-blue-400">{compactNumber(totalMAU)}</span>
            </span>
          </div>
        </PageHeader>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {defaultGames.map((game) => (
            <Card key={game.id} className="flex flex-col">
              <div className="mb-4 flex items-start justify-between">
                <div className="text-4xl">{game.icon}</div>
                <Badge status={game.status} />
              </div>
              <h2 className="text-lg font-semibold">{game.title}</h2>
              <p className="mt-1 text-xs font-medium text-brand-400">{game.genre}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">
                {game.description}
              </p>
              {game.status !== "development" && (
                <div className="mt-4 flex gap-6 border-t border-gray-800 pt-4 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">CCU</div>
                    <div className="font-semibold text-green-400">{compactNumber(game.ccu)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">MAU</div>
                    <div className="font-semibold text-blue-400">{compactNumber(game.mau)}</div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
