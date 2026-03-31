"use client";

import { useData } from "@/context/DataContext";
import { useGames } from "@/context/GamesContext";
import { PageHeader } from "@/components/layout";
import { Card, StatCard } from "@/components/ui";
import { compactNumber, formatCurrency, formatSignedCurrency } from "@/lib/format";

export default function DashboardPage() {
  const { finances } = useData();
  const { games, loading } = useGames();

  const totalPlaying = games.reduce((sum, g) => sum + g.playing, 0);
  const totalVisits = games.reduce((sum, g) => sum + g.visits, 0);
  const totalRevenue = finances.reduce((sum, f) => sum + f.revenue, 0);
  const totalExpenses = finances.reduce((sum, f) => sum + f.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const latestMonth = finances.length > 0 ? finances[finances.length - 1] : null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <PageHeader title="Admin Dashboard" description="Overview of games, players, and financials" />

      {/* Top Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Games"
          value={loading ? "..." : String(games.length)}
          description="in the portfolio"
        />
        <StatCard
          label="Live Players"
          value={loading ? "..." : compactNumber(totalPlaying)}
          description="playing right now"
          valueClassName="text-green-400"
        />
        <StatCard
          label="Total Visits"
          value={loading ? "..." : compactNumber(totalVisits)}
          description="all-time across all games"
          valueClassName="text-blue-400"
        />
        <StatCard
          label="Total Profit (YTD)"
          value={`${totalProfit >= 0 ? "+" : ""}${formatCurrency(totalProfit)}`}
          description="revenue - expenses"
          valueClassName={totalProfit >= 0 ? "text-green-400" : "text-red-400"}
        />
      </div>

      {/* Monthly Breakdown */}
      <h2 className="mb-4 text-lg font-semibold">Monthly Financial Summary</h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {finances.map((f) => {
          const profit = f.revenue - f.expenses;
          return (
            <Card key={f.id}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{f.month} {f.year}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${profit >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {profit >= 0 ? "Profit" : "Loss"}
                </span>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenue</span>
                  <span className="font-medium text-green-400">{formatCurrency(f.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Expenses</span>
                  <span className="font-medium text-red-400">{formatCurrency(f.expenses)}</span>
                </div>
                <div className="border-t border-gray-800 pt-2 flex justify-between">
                  <span className="text-gray-400">Profit / Loss</span>
                  <span className={`font-bold ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {formatSignedCurrency(profit)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Latest Month Highlight */}
      {latestMonth && (
        <Card highlight>
          <h2 className="mb-2 text-lg font-semibold">
            Latest Month: {latestMonth.month} {latestMonth.year}
          </h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(latestMonth.revenue)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Expenses</p>
              <p className="text-xl font-bold text-red-400">{formatCurrency(latestMonth.expenses)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Net</p>
              <p className={`text-xl font-bold ${latestMonth.revenue - latestMonth.expenses >= 0 ? "text-green-400" : "text-red-400"}`}>
                {formatCurrency(latestMonth.revenue - latestMonth.expenses)}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
