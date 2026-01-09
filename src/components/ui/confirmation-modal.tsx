"use client";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  variant?: "success" | "danger" | "warning";
  isLoading?: boolean;
}

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
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const variantStyles = {
    success: "bg-green-500 hover:bg-green-600 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 max-w-sm w-full shadow-xl">
        <h2 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4 text-gray-800">
          {title}
        </h2>
        <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 sm:py-2 text-center font-medium rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              confirmText
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 sm:py-2 text-center font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};
