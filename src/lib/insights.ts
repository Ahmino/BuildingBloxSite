import type { MonthlyFinance } from "@/types";
import type { RobloxGame } from "@/lib/roblox";

/* ─── Types ──────────────────────────────────────────────── */

export interface WithProfit extends MonthlyFinance {
  profit: number;
}

export interface FinancialSummary {
  records: WithProfit[];          // chronologically sorted
  best: WithProfit;
  worst: WithProfit;
  latest: WithProfit;
  previous: WithProfit | null;
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  avgProfit: number;
  revenueChangePct: number | null;
  expensesChangePct: number | null;
  profitChangePct: number | null;
}

export interface GameSummary {
  sorted: RobloxGame[];           // high → low CCU
  top: RobloxGame | null;
  bottom: RobloxGame | null;
  totalCCU: number;
  avgCCU: number;
  alerts: string[];
}

/* ─── Helpers ────────────────────────────────────────────── */

const MONTH_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pct(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
}

function fmt(n: number): string {
  return `$${n.toLocaleString()}`;
}

/* ─── Finance Analysis ───────────────────────────────────── */

export function summarizeFinances(finances: MonthlyFinance[]): FinancialSummary {
  const records: WithProfit[] = finances.map((f) => ({
    ...f,
    profit: f.revenue - f.expenses,
  }));

  records.sort((a, b) =>
    a.year !== b.year
      ? a.year - b.year
      : MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month),
  );

  const byProfit = [...records].sort((a, b) => b.profit - a.profit);
  const best = byProfit[0];
  const worst = byProfit[byProfit.length - 1];
  const latest = records[records.length - 1];
  const previous = records.length > 1 ? records[records.length - 2] : null;

  const totalRevenue = records.reduce((s, r) => s + r.revenue, 0);
  const totalExpenses = records.reduce((s, r) => s + r.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const avgProfit = records.length ? Math.round(totalProfit / records.length) : 0;

  return {
    records,
    best,
    worst,
    latest,
    previous,
    totalRevenue,
    totalExpenses,
    totalProfit,
    avgProfit,
    revenueChangePct: previous ? pct(latest.revenue, previous.revenue) : null,
    expensesChangePct: previous ? pct(latest.expenses, previous.expenses) : null,
    profitChangePct: previous ? pct(latest.profit, previous.profit) : null,
  };
}

/* ─── Game Analysis ──────────────────────────────────────── */

export function summarizeGames(games: RobloxGame[]): GameSummary {
  const sorted = [...games].sort((a, b) => b.playing - a.playing);
  const top = sorted[0] ?? null;
  const bottom = sorted[sorted.length - 1] ?? null;
  const totalCCU = games.reduce((s, g) => s + g.playing, 0);
  const avgCCU = games.length ? Math.round(totalCCU / games.length) : 0;

  const alerts: string[] = [];
  for (const g of games) {
    if (g.playing === 0) alerts.push(`${g.name} has 0 concurrent players`);
  }

  return { sorted, top, bottom, totalCCU, avgCCU, alerts };
}

/* ─── System Prompt Builder ──────────────────────────────── */

export function buildSystemPrompt(
  fin: FinancialSummary,
  gm: GameSummary,
): string {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const financialRows = fin.records.length
    ? fin.records
        .map(
          (r) =>
            `  - ${r.month} ${r.year}: Revenue ${fmt(r.revenue)}, Expenses ${fmt(r.expenses)}, Profit ${fmt(r.profit)}`,
        )
        .join("\n")
    : "  No financial data available.";

  const gameRows = gm.sorted.length
    ? gm.sorted
        .map(
          (g, i) =>
            `  ${i + 1}. ${g.name} — ${g.playing.toLocaleString()} CCU, ${g.visits.toLocaleString()} all-time visits, ${g.favoritedCount.toLocaleString()} favorites, genre: ${g.genre}`,
        )
        .join("\n")
    : "  No game data available.";

  const latestChange =
    fin.revenueChangePct !== null
      ? `\n  - Revenue vs previous month: ${fin.revenueChangePct >= 0 ? "+" : ""}${fin.revenueChangePct}%` +
        `\n  - Profit vs previous month: ${(fin.profitChangePct ?? 0) >= 0 ? "+" : ""}${fin.profitChangePct ?? 0}%`
      : "";

  const alertsText = gm.alerts.length
    ? `\n  - Alerts: ${gm.alerts.join("; ")}`
    : "\n  - No CCU alerts";

  return `You are a sharp, senior game-industry analyst and strategic advisor for BuildingBlox — a Roblox game development studio. Today is ${today}.

You have access to the web_search tool. Use it proactively to enrich your answers:
- When asked about a specific game, search for its community feedback, recent Roblox updates in that genre, and what similar top games are doing.
- When giving growth recommendations, search for current Roblox market trends and what mechanics are performing well.
- When asked about financials, search for Roblox developer monetization benchmarks or platform news that could affect revenue.
- 1–3 targeted searches per response is ideal. Search naturally, not mechanically.

## STUDIO FINANCIAL RECORDS
${financialRows}

## FINANCIAL METRICS
  - Best month: ${fin.best?.month ?? "N/A"} ${fin.best?.year ?? ""} (${fmt(fin.best?.profit ?? 0)} profit)
  - Worst month: ${fin.worst?.month ?? "N/A"} ${fin.worst?.year ?? ""} (${fmt(fin.worst?.profit ?? 0)} profit)
  - Total revenue: ${fmt(fin.totalRevenue)} | Total expenses: ${fmt(fin.totalExpenses)} | Total profit: ${fmt(fin.totalProfit)}
  - Average monthly profit: ${fmt(fin.avgProfit)}${latestChange}

## LIVE GAME PORTFOLIO
${gameRows}

## GAME HEALTH
  - Top performer: ${gm.top?.name ?? "N/A"} (${gm.top?.playing ?? 0} CCU)
  - Needs attention: ${gm.bottom?.name ?? "N/A"} (${gm.bottom?.playing ?? 0} CCU)
  - Total live CCU: ${gm.totalCCU.toLocaleString()} across ${gm.sorted.length} games
  - Average CCU per game: ${gm.avgCCU.toLocaleString()}${alertsText}

## HOW TO RESPOND
- Think like a strategist, not just a data reader. Blend the studio's numbers with real-world Roblox context from your searches.
- Be specific and actionable. Every insight should be grounded in the actual data and/or what you searched.
- Use bullet points for lists. Bold key numbers or names with **asterisks**.
- Stay focused (under 350 words unless the user asks for a deep dive).
- If a search reveals something surprising or urgent the studio should know, surface it proactively.`;
}
