import type { GameStatus } from "@/types";
import { STATUS_STYLES, STATUS_LABELS } from "@/lib/constants";

interface BadgeProps {
  status: GameStatus;
}

export default function Badge({ status }: BadgeProps) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
