"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import QuickPrompts from "./QuickPrompts";
import type { MonthlyFinance } from "@/types";
import type { RobloxGame } from "@/lib/roblox";

/* ─── Types ──────────────────────────────────────────────── */

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

interface Props {
  finances: MonthlyFinance[];
  games: RobloxGame[];
}

/* ─── Message Bubble ─────────────────────────────────────── */

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  const lines = message.content.split("\n");

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          isUser ? "bg-gray-700 text-gray-300" : "bg-brand-600 text-white"
        }`}
      >
        {isUser ? "A" : "AI"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "rounded-tr-sm bg-brand-600 text-white"
            : "rounded-tl-sm bg-gray-800 text-gray-100"
        }`}
      >
        {lines.map((line, i) => {
          const isBullet = line.trimStart().startsWith("- ") || line.trimStart().startsWith("• ");
          const bulletContent = isBullet ? line.trimStart().slice(2) : null;

          if (isBullet) {
            return (
              <div key={i} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                <span>{bulletContent}</span>
              </div>
            );
          }
          if (line.trim() === "") return <div key={i} className="h-2" />;
          return <p key={i}>{line}</p>;
        })}
        {message.streaming && (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current opacity-70" />
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
      <p className="text-sm font-medium text-gray-300">
        Ask me anything about your studio
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Use the quick prompts below or type your own question
      </p>
    </div>
  );
}

/* ─── Main Chat Panel ────────────────────────────────────── */

export default function ChatPanel({ finances, games }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;

      setError(null);
      setInput("");

      const userMsg: Message = { role: "user", content: trimmed };
      const history = messages.map(({ role, content }) => ({ role, content }));

      setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "", streaming: true }]);
      setStreaming(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, finances, games, history }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Server error ${res.status}`);
        }

        const reader = res.body!.getReader();
        const dec = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += dec.decode(value, { stream: true });
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: accumulated, streaming: true },
          ]);
        }

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: accumulated, streaming: false },
        ]);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong";
        setError(msg);
        setMessages((prev) => prev.slice(0, -1)); // remove empty assistant bubble
      } finally {
        setStreaming(false);
        inputRef.current?.focus();
      }
    },
    [finances, games, messages, streaming],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
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
              Powered by Claude · {games.length} games · {finances.length} financial records
            </p>
          </div>
        </div>
        {messages.length > 0 && (
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
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-5">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-5 mb-2 rounded-lg border border-red-900/40 bg-red-950/30 px-4 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Quick prompts */}
      <div className="border-t border-gray-800 px-5">
        <QuickPrompts onSelect={send} disabled={streaming} />
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
            disabled={streaming}
            className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 outline-none transition-colors focus:border-brand-600 disabled:opacity-50"
            style={{ maxHeight: "120px", overflowY: "auto" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || streaming}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-all hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send"
          >
            {streaming ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.769 59.769 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-gray-600">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
