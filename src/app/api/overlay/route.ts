import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const TIMERS_DIR = path.join(process.cwd(), "public", "timers");
const ICON_SIZE = 512; // square size to normalise everything to

/**
 * POST /api/overlay
 *
 * Body:
 *   thumbnailUrl  - Roblox CDN image URL (or any public image URL)
 *   timer         - filename without extension, e.g. "1H", "45m", "30m"
 *   position      - "center" | "bottom-center" | "bottom-right" (default: "bottom-center")
 *   overlayScale  - 0.1–1.0, how large the timer is relative to the icon (default: 0.65)
 *
 * Returns: PNG binary
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      thumbnailUrl,
      timer,
      position = "bottom-center",
      overlayScale = 0.65,
    }: {
      thumbnailUrl: string;
      timer: string;
      position?: "center" | "bottom-center" | "bottom-right";
      overlayScale?: number;
    } = body;

    // ── Validate inputs ────────────────────────────────────
    if (!thumbnailUrl || !timer) {
      return NextResponse.json(
        { error: "thumbnailUrl and timer are required" },
        { status: 400 },
      );
    }

    // Sanitise timer name — only allow alphanumeric + dash/underscore
    const safeTimer = timer.replace(/[^a-zA-Z0-9_-]/g, "");
    const timerPath = path.join(TIMERS_DIR, `${safeTimer}.png`);

    // ── Check timer file exists ────────────────────────────
    try {
      await fs.access(timerPath);
    } catch {
      const available = await listTimers();
      return NextResponse.json(
        { error: `Timer "${safeTimer}.png" not found. Available: ${available.join(", ")}` },
        { status: 404 },
      );
    }

    // ── Fetch the game icon ────────────────────────────────
    const iconRes = await fetch(thumbnailUrl);
    if (!iconRes.ok) {
      return NextResponse.json({ error: "Failed to fetch game icon" }, { status: 502 });
    }
    const iconBuffer = Buffer.from(await iconRes.arrayBuffer());

    // ── Normalise icon to square canvas ───────────────────
    const iconSharp = sharp(iconBuffer).resize(ICON_SIZE, ICON_SIZE, {
      fit: "cover",
      position: "centre",
    });
    const iconResized = await iconSharp.png().toBuffer();

    // ── Prepare timer overlay ─────────────────────────────
    const scale = Math.min(1, Math.max(0.1, overlayScale));
    const overlaySize = Math.round(ICON_SIZE * scale);

    const timerResized = await sharp(timerPath)
      .resize(overlaySize, overlaySize, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    // ── Calculate position ────────────────────────────────
    const padding = Math.round(ICON_SIZE * 0.04); // 4% padding from edges
    let left: number;
    let top: number;

    switch (position) {
      case "center":
        left = Math.round((ICON_SIZE - overlaySize) / 2);
        top = Math.round((ICON_SIZE - overlaySize) / 2);
        break;
      case "bottom-right":
        left = Math.max(0, ICON_SIZE - overlaySize - padding);
        top = Math.max(0, ICON_SIZE - overlaySize - padding);
        break;
      case "bottom-center":
      default:
        left = Math.round((ICON_SIZE - overlaySize) / 2);
        top = Math.max(0, ICON_SIZE - overlaySize - padding);
        break;
    }

    // ── Composite & output ────────────────────────────────
    const outputBuffer = await sharp(iconResized)
      .composite([{ input: timerResized, left, top, blend: "over" }])
      .png({ quality: 90, compressionLevel: 6 })
      .toBuffer();

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${safeTimer}-overlay.png"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Overlay error:", error);
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 });
  }
}

/**
 * GET /api/overlay  → list available timer files
 */
export async function GET() {
  const timers = await listTimers();
  return NextResponse.json({ timers });
}

async function listTimers(): Promise<string[]> {
  try {
    const files = await fs.readdir(TIMERS_DIR);
    return files
      .filter((f) => f.toLowerCase().endsWith(".png"))
      .map((f) => f.replace(/\.png$/i, ""))
      .sort();
  } catch {
    return [];
  }
}
