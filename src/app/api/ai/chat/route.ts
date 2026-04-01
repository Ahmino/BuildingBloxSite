import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { Messages } from "@anthropic-ai/sdk";
import { summarizeFinances, summarizeGames, buildSystemPrompt } from "@/lib/insights";
import type { MonthlyFinance } from "@/types";
import type { RobloxGame } from "@/lib/roblox";

type HistoryEntry = { role: "user" | "assistant"; content: string };

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const WEB_SEARCH_TOOL: Messages.WebSearchTool20250305 = {
  type: "web_search_20250305",
  name: "web_search",
  max_uses: 4,
};

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured in .env.local" },
      { status: 500 },
    );
  }

  let body: { message: string; finances: MonthlyFinance[]; games: RobloxGame[]; history: HistoryEntry[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { message, finances = [], games = [], history = [] } = body;

  if (!message?.trim()) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  try {
    const fin = summarizeFinances(finances);
    const gm = summarizeGames(games);
    const systemPrompt = buildSystemPrompt(fin, gm);

    // Build conversation including history
    const msgs: Messages.MessageParam[] = [
      ...history.slice(-12).map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: message.trim() },
    ];

    const searches: string[] = [];
    let finalText = "";

    // Agentic loop — handles multiple web searches until end_turn
    for (let iter = 0; iter < 6; iter++) {
      const resp = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        system: systemPrompt,
        tools: [WEB_SEARCH_TOOL],
        messages: msgs,
      });

      // Collect search queries from server_tool_use blocks
      for (const block of resp.content) {
        if (block.type === "server_tool_use" && block.name === "web_search") {
          const q = (block.input as { query?: string }).query;
          if (q) searches.push(q);
        }
      }

      // Accumulate any text produced this round
      for (const block of resp.content) {
        if (block.type === "text") finalText += block.text;
      }

      if (resp.stop_reason === "end_turn") break;

      if (resp.stop_reason === "tool_use") {
        // Append assistant's turn (contains ServerToolUseBlock + WebSearchToolResultBlock)
        msgs.push({ role: "assistant", content: resp.content });

        // Build user turn: pass back the web search results so Claude can continue
        const toolResults: Messages.WebSearchToolResultBlockParam[] = (
          resp.content as Messages.ContentBlock[]
        )
          .filter(
            (b): b is Messages.WebSearchToolResultBlock =>
              b.type === "web_search_tool_result",
          )
          .map((b) => ({
            type: "web_search_tool_result" as const,
            tool_use_id: b.tool_use_id,
            content: b.content as Messages.WebSearchToolResultBlockParamContent,
          }));

        if (toolResults.length > 0) {
          msgs.push({ role: "user", content: toolResults });
          finalText = ""; // reset — Claude will now synthesise with search results
        } else {
          break; // no results to pass back, use whatever we have
        }
      } else {
        break; // max_tokens or other stop
      }
    }

    return Response.json({ text: finalText, searches });
  } catch (error) {
    console.error("[AI chat]", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return Response.json(
      { error: `AI request failed: ${msg}` },
      { status: 500 },
    );
  }
}
