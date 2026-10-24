import { useForm, type UseFormProps, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod/v4";

export function useSelectedValuesFromReactHookForm<T extends FieldValues>(
  schema: z.ZodType<T>,
  options: Omit<UseFormProps<T>, "resolver"> = {},
) {
  const form = useForm<T>({
    // Zod 4 schema inference does not align with @hookform/resolvers types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    ...options,
  });

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    formState: form.formState,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
    setError: form.setError,
  } as const;
}
