"use client";

import { useState } from "react";
import Button from "./Button";

interface ConfirmButtonProps {
  onConfirm: () => void;
  label?: string;
  confirmLabel?: string;
}

export default function ConfirmButton({
  onConfirm,
  label = "Delete",
  confirmLabel = "Confirm",
}: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex gap-1">
        <Button variant="danger" onClick={onConfirm} className="px-3 py-1.5 text-xs">
          {confirmLabel}
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(false)} className="px-3 py-1.5 text-xs">
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg px-3 py-1.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
    >
      {label}
    </button>
  );
}
