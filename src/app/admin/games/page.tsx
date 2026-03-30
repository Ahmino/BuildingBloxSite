"use client";

import { useData } from "@/context/DataContext";
import { PageHeader } from "@/components/layout";
import { Button, Badge, ConfirmButton } from "@/components/ui";
import { GameForm } from "@/components/forms";
import useGameForm from "@/hooks/useGameForm";

export default function ManageGamesPage() {
  const { games, deleteGame } = useData();
  const gameForm = useGameForm();

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <PageHeader title="Manage Games" description="Add, edit, or remove games from the portfolio" />
        <Button onClick={gameForm.openAdd}>+ Add Game</Button>
      </div>

      {gameForm.visible && (
        <GameForm
          form={gameForm.form}
          errors={gameForm.errors}
          isEditing={!!gameForm.editingId}
          onUpdate={gameForm.updateField}
          onSubmit={gameForm.submit}
          onCancel={gameForm.close}
        />
      )}

      {/* Games List */}
      <div className="space-y-3">
        {games.map((game) => (
          <div
            key={game.id}
            className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-sm"
          >
            <div className="text-2xl">{game.icon || "\uD83C\uDFAE"}</div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-semibold">{game.title}</h3>
                <Badge status={game.status} />
              </div>
              <p className="text-sm text-gray-500">{game.genre}</p>
            </div>

            <div className="hidden gap-6 text-sm sm:flex">
              <div className="text-center">
                <div className="text-xs text-gray-500">CCU</div>
                <div className="font-medium text-green-400">{game.ccu.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500">MAU</div>
                <div className="font-medium text-blue-400">{game.mau.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => gameForm.openEdit(game)}
                className="rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              >
                Edit
              </button>
              <ConfirmButton onConfirm={() => deleteGame(game.id)} />
            </div>
          </div>
        ))}

        {games.length === 0 && (
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 py-12 text-center text-gray-500">
            No games yet. Click &ldquo;Add Game&rdquo; to get started.
          </div>
        )}
      </div>
    </div>
  );
}
