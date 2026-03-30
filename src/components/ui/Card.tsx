import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  highlight?: boolean;
}

export default function Card({
  highlight,
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        "rounded-xl border p-6 backdrop-blur-sm",
        highlight
          ? "border-brand-800/40 bg-brand-950/30"
          : "border-gray-800 bg-gray-900/60",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
