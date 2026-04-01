"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useGames } from "@/context/GamesContext";
import { PageHeader } from "@/components/layout";
import { Card, Button } from "@/components/ui";
import type { RobloxGame } from "@/lib/roblox";

type Position = "center" | "bottom-center" | "bottom-right";

const POSITIONS: { value: Position; label: string }[] = [
  { value: "bottom-center", label: "Bottom Center" },
  { value: "center", label: "Center" },
  { value: "bottom-right", label: "Bottom Right" },
];

export default function OverlayPage() {
  const { games, loading: gamesLoading } = useGames();

  const [timers, setTimers] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState<RobloxGame | null>(null);
  const [selectedTimer, setSelectedTimer] = useState<string>("");
  const [position, setPosition] = useState<Position>("bottom-center");
  const [scale, setScale] = useState(1.0);
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Load available timer files
  useEffect(() => {
    fetch("/api/overlay")
      .then((r) => r.json())
      .then((d) => {
        setTimers(d.timers ?? []);
        if (d.timers?.length > 0) setSelectedTimer(d.timers[0]);
      })
      .catch(() => setTimers([]));
  }, []);

  const handleGenerate = async () => {
    if (!selectedGame || !selectedTimer) return;
    setError("");
    setGenerating(true);
    setPreviewUrl(null);

    try {
      const res = await fetch("/api/overlay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thumbnailUrl: selectedGame.thumbnailUrl,
          timer: selectedTimer,
          position,
          overlayScale: scale,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to generate image");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!previewUrl || !selectedGame || !selectedTimer) return;
    const a = document.createElement("a");
    a.href = previewUrl;
    a.download = `${selectedGame.name.replace(/[^a-z0-9]/gi, "_")}_${selectedTimer}.png`;
    a.click();
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader
        title="Timer Overlay Tool"
        description="Select a game icon and a timer, then generate and download the combined image."
      />

      {/* No timers warning */}
      {timers.length === 0 && (
        <Card className="mb-6 border-yellow-800/40 bg-yellow-950/20">
          <p className="text-sm font-medium text-yellow-400">No timer images found.</p>
          <p className="mt-1 text-sm text-gray-400">
            Drop your PNG timer files (e.g. <code className="text-brand-400">1H.png</code>,{" "}
            <code className="text-brand-400">45m.png</code>) into{" "}
            <code className="text-brand-400">public/timers/</code> and refresh.
          </p>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* ── Controls ── */}
        <div className="space-y-6">
          {/* Game picker */}
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              1. Select Game
            </h2>
            {gamesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-lg bg-gray-800" />
                ))}
              </div>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                {games.map((game) => (
                  <button
                    key={game.placeId}
                    onClick={() => { setSelectedGame(game); setPreviewUrl(null); }}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                      selectedGame?.placeId === game.placeId
                        ? "border-brand-600 bg-brand-950/40"
                        : "border-gray-800 hover:border-gray-700 hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-700">
                      {game.thumbnailUrl && (
                        <Image src={game.thumbnailUrl} alt={game.name} fill sizes="40px" className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{game.name}</p>
                      <p className="text-xs text-gray-500">{game.genre}</p>
                    </div>
                    {selectedGame?.placeId === game.placeId && (
                      <span className="ml-auto shrink-0 text-brand-400">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Timer picker */}
          <Card>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
              2. Select Timer
            </h2>
            {timers.length === 0 ? (
              <p className="text-sm text-gray-500">No timers available — see warning above.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {timers.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setSelectedTimer(t); setPreviewUrl(null); }}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      selectedTimer === t
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Options */}
          <Card>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              3. Options
            </h2>
            <div className="space-y-4">
              {/* Position */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Position
                </label>
                <div className="flex gap-2">
                  {POSITIONS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => { setPosition(p.value); setPreviewUrl(null); }}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                        position === p.value
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-gray-700 text-gray-300 hover:border-gray-600"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scale */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Timer Size — <span className="text-brand-400">{Math.round(scale * 100)}%</span>
                </label>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={Math.round(scale * 100)}
                  onChange={(e) => { setScale(parseInt(e.target.value) / 100); setPreviewUrl(null); }}
                  className="w-full accent-brand-500"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-600">
                  <span>20%</span><span>100%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Generate */}
          <Button
            fullWidth
            onClick={handleGenerate}
            disabled={!selectedGame || !selectedTimer || generating}
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating...
              </span>
            ) : (
              "Generate Overlay"
            )}
          </Button>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        {/* ── Preview ── */}
        <div>
          <Card className="sticky top-24">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Preview
            </h2>

            {previewUrl ? (
              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl border border-gray-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Overlay preview"
                    className="w-full"
                  />
                </div>
                <Button fullWidth onClick={handleDownload} variant="secondary">
                  ↓ Download PNG
                </Button>
                <p className="text-center text-xs text-gray-500">
                  512 × 512 px · PNG · transparent overlay preserved
                </p>
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-gray-800 text-center">
                <div>
                  <p className="text-4xl mb-2">🖼️</p>
                  <p className="text-sm text-gray-500">
                    {!selectedGame
                      ? "Select a game to start"
                      : !selectedTimer
                      ? "Select a timer"
                      : "Click Generate Overlay"}
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
