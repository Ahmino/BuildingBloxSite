"use client";

import Image from "next/image";
import type { RobloxGame } from "@/lib/roblox";
import { compactNumber } from "@/lib/format";

interface GameCardProps {
  game: RobloxGame;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <a
      href={game.gameUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-sm transition-all duration-300 hover:border-brand-600/50 hover:shadow-lg hover:shadow-brand-600/5 hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-800">
        {game.thumbnailUrl ? (
          <Image
            src={game.thumbnailUrl}
            alt={game.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-gray-600">
            🎮
          </div>
        )}

        {/* Live CCU badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-gray-950/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
          {compactNumber(game.playing)} playing
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug text-white group-hover:text-brand-400 transition-colors">
          {game.name}
        </h3>
        <p className="mt-1 text-xs font-medium text-brand-400/80">{game.genre}</p>
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-gray-400 line-clamp-2">
          {game.description}
        </p>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-4 border-t border-gray-800 pt-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <span className="font-medium text-gray-300">{compactNumber(game.playing)}</span>
            <span>CCU</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-gray-300">{compactNumber(game.visits)}</span>
            <span>visits</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <svg className="h-3.5 w-3.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-gray-300">{compactNumber(game.favoritedCount)}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
