"use client";

import { SpecialtyStepProps } from "@/lib/types/components/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { Button } from "@/components/ui/button";

import { useSpecialtyStep } from "@/hooks/components/provider/auth/signup/specialty-step/use-specialty-step";

const SpecialtyStep = (props: SpecialtyStepProps) => {
  const {
    selectedSpecialty,
    handleSpecialtySelect,
    specialties,
    isLoadingSpecialties,
  } = useSpecialtyStep(props);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto w-full max-w-2xl space-y-6 duration-500 sm:space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          {SIGN_UP_TEXTS.specialtyStep.title}
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          {SIGN_UP_TEXTS.specialtyStep.subtitle}
        </p>
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {isLoadingSpecialties
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted h-14 w-full animate-pulse rounded-xl"
              />
            ))
          : specialties.map((category) => (
              <Button
                key={category.id}
                onClick={() => handleSpecialtySelect(category.id)}
                variant={
                  selectedSpecialty === category.id ? "default" : "outline"
                }
                className={`h-auto rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 sm:px-6 sm:py-4 sm:text-lg ${
                  selectedSpecialty === category.id
                    ? "scale-[1.02] shadow-md"
                    : "hover:bg-muted/50 hover:border-primary/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {category.name}
              </Button>
            ))}
      </div>
    </div>
  );
};

export default SpecialtyStep;
