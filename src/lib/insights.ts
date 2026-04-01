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
            `  ${i + 1}. ${g.name} — ${g.playing.toLocaleString()} CCU, ${g.visits.toLocaleString()} visits, ${g.favoritedCount.toLocaleString()} favorites`,
        )
        .join("\n")
    : "  No game data available.";

  const latestChange =
    fin.revenueChangePct !== null
      ? `\n  - Revenue change vs previous month: ${fin.revenueChangePct >= 0 ? "+" : ""}${fin.revenueChangePct}%` +
        `\n  - Profit change vs previous month: ${(fin.profitChangePct ?? 0) >= 0 ? "+" : ""}${fin.profitChangePct ?? 0}%`
      : "";

  const alertsText = gm.alerts.length
    ? `\n  - Alerts: ${gm.alerts.join("; ")}`
    : "\n  - No CCU alerts";

  return `You are an AI assistant for BuildingBlox, a Roblox game development studio. Today is ${today}.

FINANCIAL RECORDS:
${financialRows}

FINANCIAL METRICS:
  - Best month: ${fin.best?.month ?? "N/A"} ${fin.best?.year ?? ""} (${fmt(fin.best?.profit ?? 0)} profit)
  - Worst month: ${fin.worst?.month ?? "N/A"} ${fin.worst?.year ?? ""} (${fmt(fin.worst?.profit ?? 0)} profit)
  - Total revenue: ${fmt(fin.totalRevenue)}
  - Total expenses: ${fmt(fin.totalExpenses)}
  - Total profit: ${fmt(fin.totalProfit)}
  - Avg monthly profit: ${fmt(fin.avgProfit)}${latestChange}

LIVE GAME DATA:
${gameRows}

GAME METRICS:
  - Top game: ${gm.top?.name ?? "N/A"} (${gm.top?.playing ?? 0} CCU)
  - Lowest game: ${gm.bottom?.name ?? "N/A"} (${gm.bottom?.playing ?? 0} CCU)
  - Total CCU: ${gm.totalCCU.toLocaleString()}
  - Average CCU per game: ${gm.avgCCU.toLocaleString()}${alertsText}

RESPONSE RULES:
- Be concise, direct, and data-driven. Use bullet points for lists.
- Base all recommendations on the data above.
- Keep responses under 300 words unless the user explicitly asks for detailed analysis.
- Format currency as $X,XXX. Format large numbers with commas.
- You are speaking to a studio manager who wants practical, actionable insights.
- Do not make up data or speculate beyond what is provided.`;
}
