"use client";

import { useState, useCallback } from "react";
import type { MonthlyFinance, FinanceFormData } from "@/types";
import { useData } from "@/context/DataContext";
import { validateFinanceForm, sanitizePositiveInt } from "@/lib/validators";
import type { FinanceValidationErrors } from "@/lib/validators";

const EMPTY_FORM: FinanceFormData = { month: "January", year: 2024, revenue: 0, expenses: 0 };

export default function useFinanceForm() {
  const { addFinance, updateFinance } = useData();

  const [form, setForm] = useState<FinanceFormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<FinanceValidationErrors | null>(null);

  const updateField = useCallback(
    (field: keyof FinanceFormData, value: string | number) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors(null);
    },
    [],
  );

  const openAdd = useCallback(() => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrors(null);
    setVisible(true);
  }, []);

  const openEdit = useCallback((f: MonthlyFinance) => {
    setForm({ month: f.month, year: f.year, revenue: f.revenue, expenses: f.expenses });
    setEditingId(f.id);
    setErrors(null);
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setEditingId(null);
    setErrors(null);
  }, []);

  const submit = useCallback(() => {
    const validationErrors = validateFinanceForm(form);
    if (validationErrors) {
      setErrors(validationErrors);
      return false;
    }

    const sanitised: FinanceFormData = {
      month: form.month,
      year: Math.round(form.year),
      revenue: sanitizePositiveInt(form.revenue),
      expenses: sanitizePositiveInt(form.expenses),
    };

    if (editingId) {
      updateFinance(editingId, sanitised);
    } else {
      addFinance(sanitised);
    }

    close();
    return true;
  }, [form, editingId, addFinance, updateFinance, close]);

  return { form, editingId, visible, errors, updateField, openAdd, openEdit, close, submit };
}
