import { LucideIcon } from "lucide-react";

interface TabContentStateProps {
  isLoading: boolean;
  isEmpty: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  EmptyIcon?: LucideIcon;
  children: React.ReactNode;
}

export const TabContentState = ({
  isLoading,
  isEmpty,
  loadingMessage = "Loading...",
  emptyMessage = "No data available",
  EmptyIcon,
  children,
}: TabContentStateProps) => {
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2" />
        <p className="text-gray-500">{loadingMessage}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="py-12 text-center">
        {EmptyIcon && (
          <EmptyIcon className="mx-auto mb-4 h-12 w-12 text-gray-300" />
        )}
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};
