import * as React from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.ComponentProps<"input"> {
  variant?: "default" | "password";
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseStyles =
      "font-bold w-full rounded-xl border-2 sm:border-4 text-gray-500 p-2 sm:p-3 bg-gray-200/50 h-12 sm:h-14";

    const fontSizeStyles = "text-base sm:text-lg md:text-lg lg:text-lg";

    const variantStyles = {
      default: "",
      password: "pr-16 sm:pr-20",
    };

    return (
      <Input
        ref={ref}
        className={cn(
          baseStyles,
          fontSizeStyles,
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
