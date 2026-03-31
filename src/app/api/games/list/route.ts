import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "data", "game-links.json");

/** Read the persisted place-ID list from disk. */
async function readList(): Promise<string[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Write the place-ID list to disk. */
async function writeList(ids: string[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(ids, null, 2), "utf-8");
}

/**
 * GET /api/games/list  → returns the saved place ID array
 */
export async function GET() {
  const ids = await readList();
  return NextResponse.json({ placeIds: ids });
}

/**
 * PUT /api/games/list  → replaces the entire list
 * Body: { "placeIds": ["123", "456"] }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const placeIds: string[] = Array.isArray(body.placeIds) ? body.placeIds : [];

    // Validate: only numeric strings
    const clean = placeIds.filter((id) => /^\d+$/.test(id));
    await writeList(clean);

    return NextResponse.json({ placeIds: clean });
  } catch (error) {
    console.error("Failed to save game list:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
