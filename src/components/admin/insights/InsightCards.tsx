import { useMemo } from "react";
import { summarizeFinances, summarizeGames } from "@/lib/insights";
import { compactNumber, formatCurrency } from "@/lib/format";
import type { MonthlyFinance } from "@/types";
import type { RobloxGame } from "@/lib/roblox";

interface Props {
  finances: MonthlyFinance[];
  games: RobloxGame[];
}

interface InsightCardData {
  label: string;
  value: string;
  sub: string;
  trend?: "up" | "down" | "neutral";
  accent: string;
}

export default function InsightCards({ finances, games }: Props) {
  const cards: InsightCardData[] = useMemo(() => {
    const fin = summarizeFinances(finances);
    const gm = summarizeGames(games);

    const trendDir = (pct: number | null): "up" | "down" | "neutral" =>
      pct === null ? "neutral" : pct >= 0 ? "up" : "down";

    return [
      {
        label: "Total Profit",
        value: formatCurrency(fin.totalProfit),
        sub: `Avg ${formatCurrency(fin.avgProfit)} / mo`,
        trend: trendDir(fin.profitChangePct),
        accent: fin.totalProfit >= 0 ? "text-emerald-400" : "text-red-400",
      },
      {
        label: "Best Month",
        value: fin.best ? `${fin.best.month} ${fin.best.year}` : "—",
        sub: fin.best ? `${formatCurrency(fin.best.profit)} profit` : "No data",
        trend: "up",
        accent: "text-brand-400",
      },
      {
        label: "Latest Profit Δ",
        value:
          fin.profitChangePct !== null
            ? `${fin.profitChangePct >= 0 ? "+" : ""}${fin.profitChangePct}%`
            : "—",
        sub: fin.latest
          ? `${fin.latest.month} vs ${fin.previous?.month ?? "prior"}`
          : "No data",
        trend: trendDir(fin.profitChangePct),
        accent:
          (fin.profitChangePct ?? 0) >= 0 ? "text-emerald-400" : "text-red-400",
      },
      {
        label: "Top Game",
        value: gm.top?.name ?? "—",
        sub: gm.top ? `${compactNumber(gm.top.playing)} CCU live` : "No games",
        trend: "neutral",
        accent: "text-purple-400",
      },
      {
        label: "Total Live CCU",
        value: compactNumber(gm.totalCCU),
        sub: `${gm.sorted.length} games · avg ${compactNumber(gm.avgCCU)}`,
        trend: "neutral",
        accent: "text-sky-400",
      },
      {
        label: "Alerts",
        value: gm.alerts.length === 0 ? "All clear" : `${gm.alerts.length} warning${gm.alerts.length > 1 ? "s" : ""}`,
        sub: gm.alerts.length === 0 ? "No CCU issues" : gm.alerts[0],
        trend: gm.alerts.length === 0 ? "up" : "down",
        accent: gm.alerts.length === 0 ? "text-emerald-400" : "text-yellow-400",
      },
    ];
  }, [finances, games]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            {card.label}
          </p>
          <p className={`mt-1.5 text-lg font-bold leading-tight ${card.accent}`}>
            {card.value}
          </p>
          <p className="mt-0.5 truncate text-xs text-gray-500">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
