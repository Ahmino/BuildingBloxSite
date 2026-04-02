"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout";
import ContractTypePicker from "@/components/admin/contracts/ContractTypePicker";
import ContractForm from "@/components/admin/contracts/ContractForm";

export default function ContractsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <PageHeader
        title="Contracts & Documents"
        description="Select a contract type, fill in the details, and download a ready-to-sign Word document."
      />

      {/* Info banner */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-sky-900/30 bg-sky-950/20 px-4 py-3 text-sm text-sky-400">
        <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          Generated contracts are for internal use and should be reviewed by a legal professional before signing.
          Fields marked with <span className="text-brand-400">*</span> are required.
        </span>
      </div>

      {/* Contract type picker */}
      <section className="rounded-xl border border-gray-800 bg-gray-950 p-6">
        <h2 className="mb-5 text-sm font-semibold text-gray-200">Choose a Contract Type</h2>
        <ContractTypePicker selected={selectedId} onSelect={handleSelect} />
      </section>

      {/* Dynamic form — slides in when a type is selected */}
      {selectedId && (
        <ContractForm
          key={selectedId}
          contractId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
