import * as React from "react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./select";
import { cn } from "@/lib/utils";

interface FormSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
}

const FormSelect = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  FormSelectProps
>(
  (
    { value, onValueChange, placeholder, className, children, ...props },
    ref
  ) => {
    const baseStyles =
      "font-bold w-full rounded-xl border-2 sm:border-4 text-gray-500 p-2 sm:p-3 bg-gray-200/50 !h-12 sm:!h-14 hover:bg-gray-300/50 transition-colors";

    const fontSizeStyles = "text-base sm:text-lg md:text-lg lg:text-lg";

    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          ref={ref}
          className={cn(baseStyles, fontSizeStyles, className)}
          {...props}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full border-2 sm:border-4 border-gray-300 rounded-xl shadow-lg bg-white p-0">
          {children}
        </SelectContent>
      </Select>
    );
  }
);

FormSelect.displayName = "FormSelect";

export { FormSelect };
