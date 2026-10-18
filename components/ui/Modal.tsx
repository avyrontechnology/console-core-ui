"use client";

import { useEffect } from "react";

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-lg border border-line bg-surface p-6 shadow-raised"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
  isBusy = false,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  isBusy?: boolean;
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="mb-6 text-sm">{message}</p>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onClose} className="rounded border px-4 py-2">
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isBusy}
          className="rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isBusy ? "Working…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
