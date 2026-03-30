interface StatCardProps {
  label: string;
  value: string;
  description?: string;
  valueClassName?: string;
}

export default function StatCard({
  label,
  value,
  description,
  valueClassName = "",
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm text-center">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold ${valueClassName}`}>{value}</p>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}
