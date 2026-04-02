"use client";

import { useState, useEffect } from "react";
import { CONTRACTS } from "@/lib/contracts/types";
import type { ContractField, ContractFormData } from "@/lib/contracts/types";

interface Props {
  contractId: string;
  onClose: () => void;
}

/* ─── Field Renderer ─────────────────────────────────────── */

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: ContractField;
  value: string;
  onChange: (val: string) => void;
}) {
  const base =
    "w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none transition-colors focus:border-brand-600";

  if (field.type === "select") {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={base}>
        <option value="">Select…</option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={3}
        className={`${base} resize-none`}
      />
    );
  }

  return (
    <input
      type={field.type === "email" ? "email" : field.type === "date" ? "date" : field.type === "number" ? "number" : "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      min={field.type === "number" ? "0" : undefined}
      className={base}
    />
  );
}

/* ─── Main Form ──────────────────────────────────────────── */

export default function ContractForm({ contractId, onClose }: Props) {
  const config = CONTRACTS.find((c) => c.id === contractId);

  const [formData, setFormData] = useState<ContractFormData>({});
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset form when contract type changes
  useEffect(() => {
    setFormData({});
    setError(null);
    setSuccess(false);
  }, [contractId]);

  if (!config) return null;

  const setValue = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleGenerate = async () => {
    // Client-side required validation
    const missing = config.fields
      .filter((f) => f.required && !formData[f.key]?.trim())
      .map((f) => f.label);

    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/contracts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractId, data: formData }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Generation failed");
      }

      // Trigger browser download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${config.label.replace(/\s+/g, "-").toLowerCase()}-contract.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  // Group fields by row for half/full layout
  const rows: ContractField[][] = [];
  let i = 0;
  while (i < config.fields.length) {
    const curr = config.fields[i];
    if (curr.width === "half" && config.fields[i + 1]?.width === "half") {
      rows.push([curr, config.fields[i + 1]]);
      i += 2;
    } else {
      rows.push([curr]);
      i += 1;
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/60">
      {/* Form header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <p className="font-semibold text-gray-100">{config.label}</p>
            <p className="text-xs text-gray-500">{config.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-gray-300"
          aria-label="Close form"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Fields */}
      <div className="space-y-5 px-6 py-6">
        {rows.map((row, ri) => (
          <div key={ri} className={`grid gap-4 ${row.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
            {row.map((field) => (
              <div key={field.key}>
                <label className="mb-1.5 block text-xs font-medium text-gray-400">
                  {field.label}
                  {field.required && <span className="ml-0.5 text-brand-400">*</span>}
                </label>
                <FieldInput
                  field={field}
                  value={formData[field.key] ?? ""}
                  onChange={(val) => setValue(field.key, val)}
                />
                {field.hint && (
                  <p className="mt-1 text-xs text-gray-600">{field.hint}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-800 px-6 py-4">
        <div className="flex-1">
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          {success && (
            <p className="flex items-center gap-1.5 text-sm text-emerald-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Contract downloaded successfully!
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setFormData({}); setSuccess(false); setError(null); }}
            className="rounded-lg px-4 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200"
          >
            Clear
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Generate & Download .docx
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
