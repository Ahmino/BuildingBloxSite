"use client";

import { useData } from "@/context/DataContext";
import { PageHeader } from "@/components/layout";
import { Button, StatCard, ConfirmButton } from "@/components/ui";
import { FinanceForm } from "@/components/forms";
import useFinanceForm from "@/hooks/useFinanceForm";
import { formatCurrency, formatSignedCurrency } from "@/lib/format";

export default function FinancesPage() {
  const { finances, deleteFinance } = useData();
  const finForm = useFinanceForm();

  const totalRevenue = finances.reduce((sum, f) => sum + f.revenue, 0);
  const totalExpenses = finances.reduce((sum, f) => sum + f.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <PageHeader title="Financial Management" description="Track monthly revenue, expenses, and profit/loss" />
        <Button onClick={finForm.openAdd}>+ Add Month</Button>
      </div>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Revenue" value={formatCurrency(totalRevenue)} valueClassName="text-green-400" />
        <StatCard label="Total Expenses" value={formatCurrency(totalExpenses)} valueClassName="text-red-400" />
        <StatCard
          label="Net Profit / Loss"
          value={formatSignedCurrency(totalProfit)}
          valueClassName={totalProfit >= 0 ? "text-green-400" : "text-red-400"}
        />
      </div>

      {finForm.visible && (
        <FinanceForm
          form={finForm.form}
          errors={finForm.errors}
          isEditing={!!finForm.editingId}
          onUpdate={finForm.updateField}
          onSubmit={finForm.submit}
          onCancel={finForm.close}
        />
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs font-medium uppercase tracking-wider text-gray-500">
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3 text-right">Revenue</th>
              <th className="px-4 py-3 text-right">Expenses</th>
              <th className="px-4 py-3 text-right">Profit / Loss</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {finances.map((f) => {
              const profit = f.revenue - f.expenses;
              return (
                <tr key={f.id} className="border-b border-gray-800/50 transition-colors hover:bg-gray-900/50">
                  <td className="px-4 py-3 font-medium">{f.month} {f.year}</td>
                  <td className="px-4 py-3 text-right text-green-400">{formatCurrency(f.revenue)}</td>
                  <td className="px-4 py-3 text-right text-red-400">{formatCurrency(f.expenses)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {formatSignedCurrency(profit)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => finForm.openEdit(f)}
                        className="rounded px-2 py-1 text-gray-400 hover:bg-gray-800 hover:text-white"
                      >
                        Edit
                      </button>
                      <ConfirmButton onConfirm={() => deleteFinance(f.id)} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {finances.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            No financial records yet. Click &ldquo;Add Month&rdquo; to get started.
          </div>
        )}
      </div>
    </div>
  );
}
