"use client";

import Link from "next/link";
import { PageShell } from "@/components/layout";
import { Card, StatCard } from "@/components/ui";
import { defaultGames } from "@/data/games";
import { compactNumber } from "@/lib/format";

const stats = [
  { label: "Total CCU", value: "113K+", description: "Concurrent users across all games" },
  { label: "Monthly Active Users", value: "7.1M+", description: "Players every month" },
  { label: "Games Live", value: "4", description: "Active titles on Roblox" },
  { label: "Team Members", value: "30+", description: "Developers, artists & creators" },
];

const collaborations = [
  { brand: "Nike", description: "In-game branded experience and virtual merchandise collection" },
  { brand: "Netflix", description: "Promotional tie-in game for major series launch" },
  { brand: "Gucci", description: "Virtual fashion show and limited-edition avatar items" },
  { brand: "NFL", description: "Official Super Bowl halftime experience on Roblox" },
  { brand: "Samsung", description: "Interactive product showcase and scavenger hunt event" },
  { brand: "Warner Bros.", description: "Movie premiere in-game event with exclusive rewards" },
];

export default function HomePage() {
  const liveGames = defaultGames.filter((g) => g.status === "live");

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/20 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-brand-800/40 bg-brand-950/50 px-4 py-1.5 text-sm text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            113K+ players online now
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
            {stats.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} description={s.description} valueClassName="text-brand-400" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="border-b border-gray-800 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold">Featured Games</h2>
              <p className="mt-1 text-gray-400">Our top-performing live titles</p>
            </div>
            <Link href="/games" className="text-sm font-medium text-brand-400 hover:text-brand-300">
              View all &rarr;
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {liveGames.map((game) => (
              <Card key={game.id} className="transition-colors hover:border-gray-700">
                <div className="mb-3 text-3xl">{game.icon}</div>
                <h3 className="font-semibold">{game.title}</h3>
                <p className="mt-1 text-xs text-gray-500">{game.genre}</p>
                <div className="mt-3 flex gap-4 text-xs">
                  <span className="text-green-400">{compactNumber(game.ccu)} CCU</span>
                  <span className="text-blue-400">{compactNumber(game.mau)} MAU</span>
                </div>
              </Card>
            ))}
          </div>
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
