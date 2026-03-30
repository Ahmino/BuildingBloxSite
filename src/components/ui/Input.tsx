import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...rest }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-300">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={[
            "w-full rounded-lg border bg-gray-800 px-4 py-2.5 text-sm text-white",
            "placeholder-gray-500 outline-none transition-colors",
            error
              ? "border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400"
              : "border-gray-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500",
            className,
          ].join(" ")}
          {...rest}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
