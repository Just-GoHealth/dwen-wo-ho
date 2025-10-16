import { useForm, type UseFormProps, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";

export function useSelectedValuesFromReactHookForm<T extends FieldValues>(
  schema: z.ZodSchema<T>,
  options: Omit<UseFormProps<T>, "resolver"> = {}
) {
  const form = useForm<T>({
    resolver: zodResolver(schema as any),
    ...options,
  });

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    formState: form.formState,
    watch: form.watch,
  } as const;
}
