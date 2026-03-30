import { ButtonHTMLAttributes, forwardRef } from "react";
import type { Variant } from "@/types";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-500 focus:ring-brand-400",
  secondary:
    "border border-gray-700 bg-gray-900 text-gray-200 hover:border-gray-600 hover:bg-gray-800 focus:ring-gray-500",
  danger:
    "bg-red-600 text-white hover:bg-red-500 focus:ring-red-400",
  ghost:
    "text-gray-400 hover:bg-gray-800 hover:text-white focus:ring-gray-500",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidth, className = "", children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-all",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950",
          "disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          fullWidth ? "w-full" : "",
          className,
        ].join(" ")}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
