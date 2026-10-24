import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { SchoolEditPanelFooterProps } from "@/lib/types/components/curator/schools/schools";

export const SchoolEditFooter = ({
  handleDisable,
  isPending,
  hasChanges,
}: SchoolEditPanelFooterProps) => {
  return (
    <div className="border-border bg-muted/40 flex flex-col-reverse gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
      <Button
        type="button"
        onClick={handleDisable}
        variant="ghost"
        className="text-destructive hover:text-destructive hover:bg-destructive/10 flex items-center gap-2 px-6 font-medium"
      >
        <Ban className="h-4 w-4" />
        Archive School
      </Button>
      <LoadingButton
        type="submit"
        form="school-edit-form"
        loading={isPending}
        loadingText="Updating..."
        disabled={!hasChanges}
        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 px-8 font-semibold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
      >
        Update School
      </LoadingButton>
    </div>
  );
};
