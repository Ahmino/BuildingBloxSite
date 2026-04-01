import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { summarizeFinances, summarizeGames, buildSystemPrompt } from "@/lib/insights";
import type { MonthlyFinance } from "@/types";
import type { RobloxGame } from "@/lib/roblox";

type MessageParam = { role: "user" | "assistant"; content: string };

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY is not configured in .env.local" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: {
    message: string;
    finances: MonthlyFinance[];
    games: RobloxGame[];
    history: MessageParam[];
  };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { message, finances = [], games = [], history = [] } = body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return new Response(JSON.stringify({ error: "message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const fin = summarizeFinances(finances);
    const gm = summarizeGames(games);
    const systemPrompt = buildSystemPrompt(fin, gm);

    const messages: MessageParam[] = [
      ...history.slice(-12),
      { role: "user", content: message.trim() },
    ];

    const stream = client.messages.stream({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        const enc = new TextEncoder();
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(enc.encode(chunk.delta.text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[AI chat]", error);
    return new Response(
      JSON.stringify({ error: "AI request failed. Check your API key and try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
