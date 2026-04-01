"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import QuickPrompts from "./QuickPrompts";
import type { MonthlyFinance } from "@/types";
import type { RobloxGame } from "@/lib/roblox";

/* ─── Types ──────────────────────────────────────────────── */

type Role = "user" | "assistant" | "searches";

interface Message {
  role: Role;
  content: string;
  searches?: string[];
}

interface Props {
  finances: MonthlyFinance[];
  games: RobloxGame[];
}

/* ─── Helpers ────────────────────────────────────────────── */

/** Render a response with basic markdown: **bold**, bullet lines, headings */
function RichText({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.trim() === "") return <div key={i} className="h-1.5" />;

        // Heading lines: ## or #
        if (/^#{1,3}\s/.test(line)) {
          const heading = line.replace(/^#{1,3}\s/, "");
          return (
            <p key={i} className="mt-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {heading}
            </p>
          );
        }

        // Bullet lines: - or • or numbered  1.
        const bulletMatch = line.match(/^(\s*)([-•*]|\d+\.)\s+(.*)/);
        if (bulletMatch) {
          const content = bulletMatch[3];
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
              <span className="flex-1">{renderInline(content)}</span>
            </div>
          );
        }

        return <p key={i}>{renderInline(line)}</p>;
      })}
    </div>
  );
}

/** Render **bold** and plain inline text */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

/* ─── Message Bubble ─────────────────────────────────────── */

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "searches") {
    return (
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-2 px-4 py-1">
          {(message.searches ?? []).map((q, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 rounded-full border border-sky-800/40 bg-sky-950/40 px-3 py-1 text-xs text-sky-400"
            >
              <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              {q}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          isUser ? "bg-gray-700 text-gray-300" : "bg-brand-600 text-white"
        }`}
      >
        {isUser ? "A" : "AI"}
      </div>

      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-brand-600 text-white"
            : "rounded-tl-sm bg-gray-800 text-gray-100"
        }`}
      >
        {isUser ? (
          <p>{message.content}</p>
        ) : (
          <RichText text={message.content} />
        )}
      </div>
    </div>
  );
}

/* ─── Thinking State ─────────────────────────────────────── */

function ThinkingBubble({ searches }: { searches: string[] }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
        AI
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-gray-800 px-4 py-3 text-sm">
        {searches.length === 0 ? (
          <div className="flex items-center gap-2 text-gray-400">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            Thinking…
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
              Researching…
            </div>
            {searches.map((q, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-sky-400">
                <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
                {q}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Empty State ────────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/20 text-3xl">
        🤖
      </div>
      <p className="text-sm font-medium text-gray-300">Ask me anything about your studio</p>
      <p className="mt-1 text-xs text-gray-500">
        I'll research the web + your live data to give you real insights
      </p>
    </div>
  );
}

/* ─── Main Panel ─────────────────────────────────────────── */

export default function ChatPanel({ finances, games }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [liveSearches, setLiveSearches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || thinking) return;

      setError(null);
      setInput("");
      setLiveSearches([]);

      const userMsg: Message = { role: "user", content: trimmed };
      const history = messages
        .filter((m) => m.role !== "searches")
        .map(({ role, content }) => ({ role: role as "user" | "assistant", content }));

      setMessages((prev) => [...prev, userMsg]);
      setThinking(true);

      const controller = new AbortController();
      abortRef.current = controller;

      // Poll-style: simulate search progress by polling a flag
      // (server will stream searches via JSON response once done)
      const searchPoll = setInterval(() => {
        // Spinner stays until we get a response
      }, 500);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, finances, games, history }),
          signal: controller.signal,
        });

        clearInterval(searchPoll);

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Server error ${res.status}`);
        }

        const data: { text: string; searches: string[] } = await res.json();

        setMessages((prev) => {
          const next = [...prev];
          // Insert search trail if any searches were done
          if (data.searches.length > 0) {
            next.push({ role: "searches", content: "", searches: data.searches });
          }
          next.push({ role: "assistant", content: data.text });
          return next;
        });
      } catch (err) {
        clearInterval(searchPoll);
        if ((err as Error).name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setError(msg);
      } finally {
        setThinking(false);
        setLiveSearches([]);
        abortRef.current = null;
        inputRef.current?.focus();
      }
    },
    [finances, games, messages, thinking],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setThinking(false);
    setLiveSearches([]);
  };

  const handleClear = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-800 bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold">
            AI
          </div>
          <div>
            <p className="text-sm font-semibold">Studio Assistant</p>
            <p className="text-xs text-gray-500">
              Claude Sonnet · web search · {games.length} games · {finances.length} financial records
            </p>
          </div>
        </div>
        {messages.length > 0 && !thinking && (
          <button
            onClick={handleClear}
            className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-800 hover:text-gray-300"
          >
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-4">
        {messages.length === 0 && !thinking ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {thinking && <ThinkingBubble searches={liveSearches} />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-5 mb-2 rounded-lg border border-red-900/40 bg-red-950/30 px-4 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Quick prompts */}
      <div className="border-t border-gray-800 px-5">
        <QuickPrompts onSelect={send} disabled={thinking} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 px-5 py-4">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about finances, games, or studio performance…"
            rows={1}
            disabled={thinking}
            className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none transition-colors focus:border-brand-600 disabled:opacity-50"
            style={{ maxHeight: "120px", overflowY: "auto" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          {thinking ? (
            <button
              onClick={handleStop}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-700 bg-gray-800 text-gray-400 transition-all hover:border-red-700 hover:text-red-400"
              aria-label="Stop"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => send(input)}
              disabled={!input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-all hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.769 59.769 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-gray-600">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
