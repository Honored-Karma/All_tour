import React, { useRef } from "react";
import { X } from "lucide-react";
import { useDialog } from "../../hooks/useDialog";

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  open,
  onClose,
  title,
  closeLabel,
  children,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(open, dialogRef, onClose);

  if (!open) return null;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-ink/25 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="liquid-glass-modal relative w-full max-w-4xl max-h-[90dvh] rounded-3xl overflow-hidden flex flex-col text-ink">
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface-soft shrink-0">
          <span className="editorial-kicker text-muted truncate pr-4">
            {title}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-soft hover:bg-surface-hover text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sage"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};
