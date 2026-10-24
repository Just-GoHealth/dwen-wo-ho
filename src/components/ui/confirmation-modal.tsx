"use client";

import { ConfirmDialog } from "@just-gohealth/ui";
import { ConfirmationModalProps } from "@/lib/types/components/shared/confirmation-modal";

/**
 * Backed by `@just-gohealth/ui`'s ConfirmDialog (focus trap, Esc to close).
 * `variant="danger"` maps to the destructive tone; the other variants use
 * the default (primary) tone.
 */
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  loadingText = "Processing...",
}: ConfirmationModalProps) => {
  return (
    <ConfirmDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={title}
      description={message}
      // The package shows the confirm label next to its spinner while
      // loading, so swap in the loading copy here.
      confirmLabel={isLoading ? loadingText : confirmText}
      cancelLabel={cancelText}
      tone={variant === "danger" ? "destructive" : "default"}
      loading={isLoading}
      onConfirm={onConfirm}
    />
  );
};
