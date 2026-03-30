import type { Game } from "@/types";

export const defaultGames: Game[] = [
  {
    id: "1",
    title: "Blox Battlegrounds",
    description:
      "An intense PvP battle royale experience with dynamic maps and custom weapon systems. Drop in, gear up, and be the last one standing.",
    icon: "\u2694\uFE0F",
    ccu: 45200,
    mau: 2800000,
    genre: "Battle Royale",
    status: "live",
  },
  {
    id: "2",
    title: "Blox Tycoon Empire",
    description:
      "Build your business empire from the ground up. Manage resources, hire workers, and compete with other tycoons in a persistent economy.",
    icon: "\uD83C\uDFED",
    ccu: 32100,
    mau: 1950000,
    genre: "Tycoon / Simulation",
    status: "live",
  },
  {
    id: "3",
    title: "Escape the Blox",
    description:
      "Solve puzzles, find keys, and escape increasingly complex obby-style challenges. New chapters released monthly.",
    icon: "\uD83D\uDD13",
    ccu: 18700,
    mau: 1200000,
    genre: "Obby / Adventure",
    status: "live",
  },
  {
    id: "4",
    title: "Blox Racing League",
    description:
      "High-speed competitive racing with customizable vehicles, tracks, and tournaments. Climb the leaderboards and earn exclusive rewards.",
    icon: "\uD83C\uDFCE\uFE0F",
    ccu: 12400,
    mau: 870000,
    genre: "Racing",
    status: "live",
  },
  {
    id: "5",
    title: "Blox World RPG",
    description:
      "A massive open-world RPG with quests, dungeons, crafting, and a deep storyline. Currently in closed beta with early access supporters.",
    icon: "\uD83D\uDDFA\uFE0F",
    ccu: 5300,
    mau: 340000,
    genre: "RPG",
    status: "beta",
  },
  {
    id: "6",
    title: "Blox Horror Nights",
    description:
      "A terrifying co-op horror experience. Explore haunted locations, solve mysteries, and survive the night with friends.",
    icon: "\uD83D\uDC7B",
    ccu: 0,
    mau: 0,
    genre: "Horror",
    status: "development",
  },
];
