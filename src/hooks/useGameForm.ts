"use client";

import { useState, useCallback } from "react";
import type { Game, GameFormData, GameStatus } from "@/types";
import { useData } from "@/context/DataContext";
import { validateGameForm, sanitizeText, sanitizeDescription, sanitizePositiveInt } from "@/lib/validators";
import type { GameValidationErrors } from "@/lib/validators";

const EMPTY_FORM: GameFormData = {
  title: "",
  description: "",
  icon: "",
  ccu: 0,
  mau: 0,
  genre: "",
  status: "development",
};

export default function useGameForm() {
  const { addGame, updateGame } = useData();

  const [form, setForm] = useState<GameFormData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<GameValidationErrors | null>(null);

  const updateField = useCallback(
    (field: keyof GameFormData, value: string | number) => {
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

  const openEdit = useCallback((game: Game) => {
    setForm({
      title: game.title,
      description: game.description,
      icon: game.icon,
      ccu: game.ccu,
      mau: game.mau,
      genre: game.genre,
      status: game.status,
    });
    setEditingId(game.id);
    setErrors(null);
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
    setEditingId(null);
    setErrors(null);
  }, []);

  const submit = useCallback(() => {
    const validationErrors = validateGameForm(form);
    if (validationErrors) {
      setErrors(validationErrors);
      return false;
    }

    const sanitised: GameFormData = {
      title: sanitizeText(form.title),
      description: sanitizeDescription(form.description),
      icon: sanitizeText(form.icon, 10),
      genre: sanitizeText(form.genre),
      ccu: sanitizePositiveInt(form.ccu),
      mau: sanitizePositiveInt(form.mau),
      status: form.status as GameStatus,
    };

    if (editingId) {
      updateGame(editingId, sanitised);
    } else {
      addGame(sanitised);
    }

    close();
    return true;
  }, [form, editingId, addGame, updateGame, close]);

  return { form, editingId, visible, errors, updateField, openAdd, openEdit, close, submit };
}
