interface Prompt {
  label: string;
  message: string;
}

const PROMPTS: Prompt[] = [
  { label: "Financial Summary", message: "Give me a financial summary of the studio." },
  { label: "Best & Worst Month", message: "What were the best and worst financial months and why?" },
  { label: "Profit Trend", message: "How has profit trended month over month? Include percentages." },
  { label: "Top Game", message: "Which game is performing best and what makes it stand out?" },
  { label: "Lowest Game", message: "Which game has the lowest performance and what should we do about it?" },
  { label: "Compare Games", message: "Compare all games side by side based on CCU and visits." },
  { label: "Studio Recommendation", message: "Based on the data, which game should the studio focus on growing and why?" },
  { label: "CCU Alerts", message: "Are there any games with concerning CCU numbers? Give me a quick health check." },
  { label: "Weekly Summary", message: "Give me a quick weekly summary of studio performance across finances and games." },
  { label: "Revenue vs Expenses", message: "Analyze our revenue versus expenses. Are we spending too much anywhere?" },
];

interface Props {
  onSelect: (message: string) => void;
  disabled?: boolean;
}

export default function QuickPrompts({ onSelect, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2 py-3">
      {PROMPTS.map((p) => (
        <button
          key={p.label}
          onClick={() => onSelect(p.message)}
          disabled={disabled}
          className="rounded-full border border-gray-700 bg-gray-800/60 px-3 py-1.5 text-xs font-medium text-gray-300 transition-all hover:border-brand-600 hover:bg-brand-950/40 hover:text-brand-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
