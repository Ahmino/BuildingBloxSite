import { CONTRACTS, CATEGORY_LABELS } from "@/lib/contracts/types";
import type { ContractConfig, ContractCategory } from "@/lib/contracts/types";

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
}

const CATEGORY_ORDER: ContractCategory[] = ["hiring", "game", "legal", "financial"];

export default function ContractTypePicker({ selected, onSelect }: Props) {
  const grouped = CATEGORY_ORDER.reduce<Record<string, ContractConfig[]>>((acc, cat) => {
    acc[cat] = CONTRACTS.filter((c) => c.category === cat);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {CATEGORY_ORDER.map((cat) => (
        <div key={cat}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">
            {CATEGORY_LABELS[cat]}
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {grouped[cat].map((contract) => {
              const isSelected = selected === contract.id;
              return (
                <button
                  key={contract.id}
                  onClick={() => onSelect(contract.id)}
                  className={`group relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-brand-600 bg-brand-950/30 shadow-lg shadow-brand-950/20"
                      : "border-gray-800 bg-gray-900/60 hover:border-gray-700 hover:bg-gray-800/60"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] text-white">
                      ✓
                    </span>
                  )}
                  <span className="text-2xl">{contract.icon}</span>
                  <div>
                    <p
                      className={`text-sm font-semibold leading-tight ${
                        isSelected ? "text-brand-300" : "text-gray-200"
                      }`}
                    >
                      {contract.label}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                      {contract.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
