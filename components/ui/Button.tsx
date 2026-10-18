import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white border-transparent hover:bg-brand-700 active:bg-brand-800 shadow-sm",
  secondary:
    "bg-surface text-slate-700 border-line hover:bg-slate-50 hover:text-slate-900 shadow-sm",
  ghost: "bg-transparent text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900",
  danger: "bg-critical text-white border-transparent hover:bg-red-700 active:bg-red-800 shadow-sm",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

/** One button for the whole app: variants and sizes, no ad-hoc classes. */
export function Button({
  variant = "secondary",
  size = "sm",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-md border font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    />
  );
}
