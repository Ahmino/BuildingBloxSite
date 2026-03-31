"use client";

import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/layout";
import { Card, StatCard } from "@/components/ui";
import { useGames } from "@/context/GamesContext";
import { compactNumber } from "@/lib/format";

const collaborations = [
  { brand: "Nike", description: "In-game branded experience and virtual merchandise collection" },
  { brand: "Netflix", description: "Promotional tie-in game for major series launch" },
  { brand: "Gucci", description: "Virtual fashion show and limited-edition avatar items" },
  { brand: "NFL", description: "Official Super Bowl halftime experience on Roblox" },
  { brand: "Samsung", description: "Interactive product showcase and scavenger hunt event" },
  { brand: "Warner Bros.", description: "Movie premiere in-game event with exclusive rewards" },
];

export default function HomePage() {
  const { games, loading } = useGames();

  const totalPlaying = games.reduce((sum, g) => sum + g.playing, 0);
  const totalVisits = games.reduce((sum, g) => sum + g.visits, 0);

  // Top 4 by current players (already sorted from context)
  const featured = games.slice(0, 4);

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-800/40 bg-brand-950/50 px-4 py-1.5 text-sm text-brand-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            {loading ? "Loading live data..." : `${compactNumber(totalPlaying)} players online now`}
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            We Build Worlds
            <br />
            <span className="text-brand-400">Millions Play In</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            BuildingBlox is a professional Roblox game development studio creating
            immersive experiences that reach millions of players worldwide. From
            battle royales to tycoons, we build games that players love.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/games" className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-500">
              View Our Games
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-lg border border-gray-700 bg-gray-900 px-6 py-3 text-sm font-semibold text-gray-200 transition-all hover:border-gray-600 hover:bg-gray-800">
              Work With Us
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-800 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            <StatCard label="Live Players" value={loading ? "..." : compactNumber(totalPlaying)} description="Playing right now across all games" valueClassName="text-green-400" />
            <StatCard label="Total Visits" value={loading ? "..." : compactNumber(totalVisits)} description="All-time plays" valueClassName="text-blue-400" />
            <StatCard label="Games" value={loading ? "..." : String(games.length)} description="Titles in the portfolio" valueClassName="text-brand-400" />
            <StatCard label="Team Members" value="30+" description="Developers, artists & creators" valueClassName="text-brand-400" />
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="border-b border-gray-800 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Featured Games</h2>
              <p className="mt-1 text-gray-400">Our top-performing titles right now</p>
            </div>
            <Link href="/games" className="text-sm font-medium text-brand-400 hover:text-brand-300">
              View all &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-gray-800 bg-gray-900/60 p-5">
                  <div className="mb-3 h-12 w-12 rounded-lg bg-gray-800" />
                  <div className="h-4 w-3/4 rounded bg-gray-800" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-gray-800" />
                  <div className="mt-3 h-3 w-2/3 rounded bg-gray-800" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((game) => (
                <a
                  key={game.universeId}
                  href={game.gameUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm transition-all hover:border-brand-600/50 hover:-translate-y-1"
                >
                  <div className="mb-3 relative h-12 w-12 overflow-hidden rounded-lg bg-gray-800">
                    {game.thumbnailUrl && (
                      <Image src={game.thumbnailUrl} alt={game.name} fill sizes="48px" className="object-cover" />
                    )}
                  </div>
                  <h3 className="font-semibold truncate group-hover:text-brand-400 transition-colors">{game.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">{game.genre}</p>
                  <div className="mt-3 flex gap-4 text-xs">
                    <span className="flex items-center gap-1 text-green-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                      {compactNumber(game.playing)} CCU
                    </span>
                    <span className="text-blue-400">{compactNumber(game.visits)} visits</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Collaborations */}
      <section className="border-b border-gray-800 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold">Brand Collaborations</h2>
          <p className="mt-1 text-gray-400">Trusted by world-class brands for in-game experiences</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {collaborations.map((collab) => (
              <Card key={collab.brand} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-600/20 text-sm font-bold text-brand-400">
                  {collab.brand.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold">{collab.brand}</h3>
                  <p className="mt-1 text-sm text-gray-400">{collab.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
