"use client";

import { ArrowRight } from "lucide-react";
import { Controller } from "react-hook-form";
import { Chip } from "@/components/curator/create/creative-studios/shared/chip";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCampusStep1 } from "@/hooks/components/curator/create/campus/use-campus-step-1";
import {
  CAMPUS_STEP_1_FIELD_ERROR_CLASS,
  CAMPUS_STEP_1_FIELD_LABEL_CLASS,
  CAMPUS_STEP_1_FORM_SECTIONS,
} from "@/lib/constants/components/curator/create/creative-studios";

export function CampusStep1() {
  const {
    control,
    register,
    errors,
    serverErrors,
    nickError,
    nickRef,
    addNick,
    rmNick,
    nicks,
    onSubmit,
    typeOptions,
    locationOptions,
  } = useCampusStep1();

  const selectOptions = {
    type: typeOptions,
    location: locationOptions,
  } as const;

  return (
    <div className="cs-page-enter p-4 md:p-8">
      <h2 className="text-foreground text-2xl font-semibold tracking-tight">
        Create New Campus
      </h2>
      <p className="text-muted-foreground mt-1 mb-6 text-sm">
        Fill in the campus details below
      </p>

      <form onSubmit={onSubmit} className="max-w-md">
        <FieldGroup className="gap-4">
          {CAMPUS_STEP_1_FORM_SECTIONS.map((section) => {
            switch (section.kind) {
              case "text": {
                const serverError = serverErrors[section.name];
                const error =
                  errors[section.name] ??
                  (serverError ? { message: serverError } : undefined);

                return (
                  <Field key={section.name} data-invalid={!!error}>
                    <FieldLabel
                      htmlFor={section.id}
                      className={CAMPUS_STEP_1_FIELD_LABEL_CLASS}
                    >
                      {section.label}
                      {section.required ? (
                        <span className="text-destructive"> *</span>
                      ) : null}
                    </FieldLabel>
                    <Input
                      id={section.id}
                      placeholder={section.placeholder}
                      aria-invalid={section.required ? !!error : undefined}
                      {...register(section.name)}
                    />
                    {section.required || error ? (
                      <FieldError
                        className={CAMPUS_STEP_1_FIELD_ERROR_CLASS}
                        errors={[error]}
                      />
                    ) : null}
                  </Field>
                );
              }

              case "nicks":
                return (
                  <Field key="nicks" data-invalid={!!nickError}>
                    <FieldLabel
                      htmlFor="campus-nick"
                      className={CAMPUS_STEP_1_FIELD_LABEL_CLASS}
                    >
                      Nicknames
                    </FieldLabel>
                    <InputGroup className="border-input focus-within:border-primary/60 rounded-lg border transition-all duration-200">
                      <InputGroupInput
                        id="campus-nick"
                        ref={nickRef}
                        placeholder="Press Enter to add"
                        aria-invalid={!!nickError}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addNick();
                          }
                        }}
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="button"
                          size="icon-sm"
                          className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full transition-colors duration-150"
                          onClick={addNick}
                          aria-label="Add nickname"
                        >
                          <ArrowRight data-icon="inline-start" />
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldError className={CAMPUS_STEP_1_FIELD_ERROR_CLASS}>
                      {nickError}
                    </FieldError>
                    {nicks.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {nicks.map((n, i) => (
                          <Chip
                            key={n}
                            label={n}
                            color="purple"
                            onRemove={() => rmNick(i)}
                          />
                        ))}
                      </div>
                    ) : null}
                  </Field>
                );

              case "select":
                return (
                  <Controller
                    key={section.name}
                    name={section.name}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={
                          fieldState.invalid || !!serverErrors[section.name]
                        }
                      >
                        <FieldLabel
                          htmlFor={section.id}
                          className={CAMPUS_STEP_1_FIELD_LABEL_CLASS}
                        >
                          {section.label}{" "}
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Select
                          value={field.value || undefined}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id={section.id}
                            className="h-auto w-full py-2.5 shadow-none"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder={section.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {selectOptions[section.optionsKey].map(
                                (option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ),
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FieldError
                          className={CAMPUS_STEP_1_FIELD_ERROR_CLASS}
                          errors={[
                            fieldState.error ??
                              (serverErrors[section.name]
                                ? { message: serverErrors[section.name] }
                                : undefined),
                          ]}
                        />
                      </Field>
                    )}
                  />
                );
            }
          })}

          <Button
            type="submit"
            className="bg-primary mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-medium text-white transition-all duration-200 hover:-translate-y-px active:translate-y-0"
          >
            Next
            <ArrowRight data-icon="inline-end" />
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
