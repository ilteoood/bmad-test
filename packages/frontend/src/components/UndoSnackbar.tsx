import { useEffect } from "react";

type UndoSnackbarProps = {
  message: string;
  actionLabel: string;
  onAction: () => void;
  onClose: () => void;
  durationMs?: number;
};

export default function UndoSnackbar({
  message,
  actionLabel,
  onAction,
  onClose,
  durationMs = 5000,
}: UndoSnackbarProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      onClose();
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs, onClose]);

  return (
    <div className="snackbar">
      <span>{message}</span>
      <button className="snackbar-action" onClick={onAction}>
        {actionLabel}
      </button>
      <button className="snackbar-close" onClick={onClose} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}
