import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function TextField({ label, error, id, ...props }: TextFieldProps) {
  const fieldId = id ?? props.name;
  return (
    <div>
      <label htmlFor={fieldId} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={fieldId}
        className="w-full rounded-md px-3 py-2 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        {...props}
      />
      {error && <p className="mt-1 text-sm text-critical">{error}</p>}
    </div>
  );
}
