"use client";

import { Card, Button, Input, Select, Textarea } from "@/components/ui";
import { GAME_STATUS_OPTIONS } from "@/lib/constants";
import type { GameFormData } from "@/types";
import type { GameValidationErrors } from "@/lib/validators";

interface GameFormProps {
  form: GameFormData;
  errors: GameValidationErrors | null;
  isEditing: boolean;
  onUpdate: (field: keyof GameFormData, value: string | number) => void;
  onSubmit: () => boolean;
  onCancel: () => void;
}

export default function GameForm({
  form,
  errors,
  isEditing,
  onUpdate,
  onSubmit,
  onCancel,
}: GameFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card className="mb-8">
      <h2 className="mb-4 text-lg font-semibold">
        {isEditing ? "Edit Game" : "Add New Game"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="game-title"
            label="Title *"
            value={form.title}
            onChange={(e) => onUpdate("title", e.target.value)}
            placeholder="Game title"
            error={errors?.title}
          />
          <Input
            id="game-genre"
            label="Genre *"
            value={form.genre}
            onChange={(e) => onUpdate("genre", e.target.value)}
            placeholder="e.g. Battle Royale, Tycoon"
            error={errors?.genre}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="game-icon"
            label="Icon (emoji)"
            value={form.icon}
            onChange={(e) => onUpdate("icon", e.target.value)}
            placeholder="e.g. &#9876;&#65039;"
          />
          <Input
            id="game-ccu"
            label="CCU"
            type="number"
            value={form.ccu}
            onChange={(e) => onUpdate("ccu", parseInt(e.target.value) || 0)}
            min={0}
          />
          <Input
            id="game-mau"
            label="MAU"
            type="number"
            value={form.mau}
            onChange={(e) => onUpdate("mau", parseInt(e.target.value) || 0)}
            min={0}
          />
        </div>

        <Select
          id="game-status"
          label="Status"
          options={GAME_STATUS_OPTIONS}
          value={form.status}
          onChange={(e) => onUpdate("status", e.target.value)}
        />

        <Textarea
          id="game-description"
          label="Description *"
          value={form.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          rows={3}
          placeholder="Game description"
          error={errors?.description}
        />

        <div className="flex gap-3">
          <Button type="submit">{isEditing ? "Save Changes" : "Add Game"}</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
