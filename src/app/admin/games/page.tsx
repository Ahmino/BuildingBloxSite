"use client";

import { useState } from "react";
import Image from "next/image";
import { useGames } from "@/context/GamesContext";
import { PageHeader } from "@/components/layout";
import { Button, Card, ConfirmButton, Input } from "@/components/ui";
import { compactNumber } from "@/lib/format";

export default function ManageGamesPage() {
  const { games, loading, addGameByUrl, removeGame } = useGames();

  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState("");
  const [resolving, setResolving] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMsg("");

    const trimmed = url.trim();
    if (!trimmed) {
      setFormError("Please paste a Roblox game URL.");
      return;
    }

    if (!trimmed.includes("roblox.com/games/")) {
      setFormError("Invalid URL. Use a link like: https://www.roblox.com/games/12345/Game-Name");
      return;
    }

    setResolving(true);
    const result = await addGameByUrl(trimmed);
    setResolving(false);

    if (result.error) {
      setFormError(result.error);
    } else if (result.game) {
      setSuccessMsg(`Added "${result.game.name}" successfully!`);
      setUrl("");
      setTimeout(() => {
        setSuccessMsg("");
        setShowForm(false);
      }, 2000);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-start justify-between">
        <PageHeader
          title="Manage Games"
          description="Add or remove games from the portfolio. Just paste a Roblox game link — the system pulls all data automatically."
        />
        {!showForm && (
          <Button onClick={() => { setShowForm(true); setFormError(""); setSuccessMsg(""); }}>
            + Add Game
          </Button>
        )}
      </div>

      {/* Add Game Form */}
      {showForm && (
        <Card className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Add Game by Link</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <Input
              id="game-url"
              label="Roblox Game URL"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setFormError(""); }}
              placeholder="https://www.roblox.com/games/12345/Game-Name"
              error={formError}
              disabled={resolving}
            />

            {resolving && (
              <div className="flex items-center gap-2 text-sm text-brand-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                Fetching game data from Roblox...
              </div>
            )}

            {successMsg && (
              <p className="text-sm text-green-400">{successMsg}</p>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={resolving}>
                {resolving ? "Resolving..." : "Add Game"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => { setShowForm(false); setUrl(""); setFormError(""); }}
                disabled={resolving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-800 bg-gray-900/60 p-4 h-20" />
          ))}
        </div>
      )}

      {/* Games List */}
      {!loading && (
        <div className="space-y-3">
          {games.map((game) => (
            <div
              key={game.placeId}
              className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-sm"
            >
              {/* Thumbnail */}
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-800">
                {game.thumbnailUrl && (
                  <Image src={game.thumbnailUrl} alt={game.name} fill sizes="48px" className="object-cover" />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold">{game.name}</h3>
                </div>
                <p className="text-sm text-gray-500">{game.genre}</p>
              </div>

              {/* Stats */}
              <div className="hidden gap-6 text-sm sm:flex">
                <div className="text-center">
                  <div className="text-xs text-gray-500">CCU</div>
                  <div className="flex items-center gap-1 font-medium text-green-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                    {compactNumber(game.playing)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Visits</div>
                  <div className="font-medium text-blue-400">{compactNumber(game.visits)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Favorites</div>
                  <div className="font-medium text-red-400">{compactNumber(game.favoritedCount)}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={game.gameUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
                >
                  View
                </a>
                <ConfirmButton onConfirm={() => removeGame(game.placeId)} />
              </div>
            </div>
          ))}

          {games.length === 0 && !loading && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/60 py-12 text-center text-gray-500">
              No games yet. Click &ldquo;+ Add Game&rdquo; and paste a Roblox link to get started.
            </div>
          )}
        </div>
      )}

      {/* Count */}
      {!loading && games.length > 0 && (
        <p className="mt-6 text-center text-xs text-gray-600">
          {games.length} game{games.length !== 1 ? "s" : ""} in portfolio &middot; data refreshes every 60s
        </p>
      )}
    </div>
  );
}
