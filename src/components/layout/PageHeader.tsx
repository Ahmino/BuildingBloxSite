interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-gray-400">{description}</p>
      )}
      {children}
    </div>
  );
}
