import { NextRequest, NextResponse } from "next/server";
import { fetchAllGames, fetchGamesForPlaceIds } from "@/lib/roblox";

/**
 * GET  /api/games              → returns default game list
 * POST /api/games  { placeIds } → returns data for specific place IDs
 *
 * Both responses are sorted by live players (highest first).
 */
export async function GET() {
  try {
    const games = await fetchAllGames();
    return NextResponse.json(
      { games },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } },
    );
  } catch (error) {
    console.error("Failed to fetch Roblox games:", error);
    return NextResponse.json({ error: "Failed to load game data" }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const placeIds: string[] = Array.isArray(body.placeIds) ? body.placeIds : [];

    if (placeIds.length === 0) {
      return NextResponse.json({ games: [] });
    }

    const games = await fetchGamesForPlaceIds(placeIds);
    return NextResponse.json({ games });
  } catch (error) {
    console.error("Failed to fetch Roblox games:", error);
    return NextResponse.json({ error: "Failed to load game data" }, { status: 502 });
  }
}
