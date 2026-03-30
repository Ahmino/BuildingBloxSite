"use client";

import { Card, Button, Input, Select } from "@/components/ui";
import { MONTHS } from "@/lib/constants";
import { formatSignedCurrency } from "@/lib/format";
import type { FinanceFormData } from "@/types";
import type { FinanceValidationErrors } from "@/lib/validators";

const monthOptions = MONTHS.map((m) => ({ value: m, label: m }));

interface FinanceFormProps {
  form: FinanceFormData;
  errors: FinanceValidationErrors | null;
  isEditing: boolean;
  onUpdate: (field: keyof FinanceFormData, value: string | number) => void;
  onSubmit: () => boolean;
  onCancel: () => void;
}

export default function FinanceForm({
  form,
  errors,
  isEditing,
  onUpdate,
  onSubmit,
  onCancel,
}: FinanceFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const profit = form.revenue - form.expenses;

  return (
    <Card className="mb-8">
      <h2 className="mb-4 text-lg font-semibold">
        {isEditing ? "Edit Financial Record" : "Add Monthly Record"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            id="fin-month"
            label="Month"
            options={monthOptions}
            value={form.month}
            onChange={(e) => onUpdate("month", e.target.value)}
          />
          <Input
            id="fin-year"
            label="Year"
            type="number"
            value={form.year}
            onChange={(e) => onUpdate("year", parseInt(e.target.value) || 2024)}
            min={2020}
            max={2030}
            error={errors?.year}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="fin-revenue"
            label="Revenue ($)"
            type="number"
            value={form.revenue}
            onChange={(e) => onUpdate("revenue", parseInt(e.target.value) || 0)}
            min={0}
            error={errors?.revenue}
          />
          <Input
            id="fin-expenses"
            label="Expenses ($)"
            type="number"
            value={form.expenses}
            onChange={(e) => onUpdate("expenses", parseInt(e.target.value) || 0)}
            min={0}
            error={errors?.expenses}
          />
        </div>

        <div className="rounded-lg bg-gray-800/50 p-3">
          <p className="text-sm text-gray-400">
            Auto-calculated Profit/Loss:{" "}
            <span className={`font-bold ${profit >= 0 ? "text-green-400" : "text-red-400"}`}>
              {formatSignedCurrency(profit)}
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          <Button type="submit">{isEditing ? "Save Changes" : "Add Record"}</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
