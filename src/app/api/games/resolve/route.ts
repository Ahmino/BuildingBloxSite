import { NextRequest, NextResponse } from "next/server";
import { resolveGameFromLink } from "@/lib/roblox";

/**
 * POST /api/games/resolve
 *
 * Accepts a Roblox game URL and returns full game data
 * (name, CCU, visits, thumbnail, etc.).
 *
 * Body: { "url": "https://www.roblox.com/games/12345/Game-Name" }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url.trim() : "";

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const game = await resolveGameFromLink(url);

    if (!game) {
      return NextResponse.json(
        { error: "Could not resolve game. Check the URL and try again." },
        { status: 422 },
      );
    }

    return NextResponse.json({ game });
  } catch (error) {
    console.error("Resolve game error:", error);
    return NextResponse.json(
      { error: "Failed to resolve game data" },
      { status: 502 },
    );
  }
}
