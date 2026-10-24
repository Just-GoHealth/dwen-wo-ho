import Image from "next/image";
import { BioStepProps } from "@/lib/types/components/provider/auth";
import { SIGN_UP_TEXTS } from "@/lib/constants/components/provider/auth/signup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBioStep } from "@/hooks/components/provider/auth/signup/bio-step/use-bio-step";

const BioStep = (props: BioStepProps) => {
  const { phoneNumber, bio, fieldError } = props;
  const { handlePhoneChange, handleBioChange, handleBioBlur } =
    useBioStep(props);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto w-full max-w-xl space-y-8 duration-500">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="office-phone">
            {SIGN_UP_TEXTS.bioStep.officePhoneLabel}
            <span className="text-destructive">*</span>
          </Label>
          <div className="group border-input bg-background focus-within:border-ring focus-within:ring-primary/50 flex h-12 items-stretch overflow-hidden rounded-lg border shadow-sm transition-all duration-200 focus-within:ring">
            <div className="border-border bg-muted/40 pointer-events-none flex shrink-0 items-center gap-1.5 border-r px-2 sm:px-3">
              <Image
                src={SIGN_UP_TEXTS.bioStep.ghanaFlagSrc}
                alt=""
                width={24}
                height={16}
                className="rounded-sm object-cover"
                aria-hidden
              />
              <span className="text-foreground text-sm font-medium tabular-nums">
                {SIGN_UP_TEXTS.bioStep.countryCode}
              </span>
            </div>
            <div className="relative min-w-0 flex-1">
              <Input
                id="office-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder={SIGN_UP_TEXTS.bioStep.officePhonePlaceholder}
                maxLength={10}
                className="h-full rounded-none border-0 pr-12 pl-2 text-base shadow-none focus-visible:ring-0 sm:pr-16 sm:pl-3 sm:text-lg"
              />
              {/* <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground bg-muted px-1.5 sm:px-2 py-1 rounded-md">
                  {10 - phoneNumber.length} left
                </span>
              </div> */}
            </div>
          </div>
          {fieldError?.("phone") && (
            <p className="text-destructive text-sm font-medium">
              {fieldError("phone")}
            </p>
          )}
          <p className="text-muted-foreground text-sm">
            {SIGN_UP_TEXTS.bioStep.privateInfo}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Label className="shrink-0">{SIGN_UP_TEXTS.bioStep.status}</Label>
            <span
              className={`shrink-0 rounded-md px-1.5 py-1 text-[10px] font-medium whitespace-nowrap sm:px-2 sm:text-xs ${
                140 - bio.length < 10
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {140 - bio.length} characters left
            </span>
          </div>
          <div className="relative">
            <Textarea
              value={bio}
              onChange={handleBioChange}
              onBlur={handleBioBlur}
              placeholder={SIGN_UP_TEXTS.bioStep.bioPlaceholder}
              maxLength={140}
              className="border-input bg-background focus-visible:ring-primary/50 min-h-40 resize-none p-4 shadow-sm transition-all duration-200"
            />
            {fieldError?.("slogan") && (
              <p className="text-destructive mt-2 text-sm font-medium">
                {fieldError("slogan")}
              </p>
            )}
            <p className="text-muted-foreground mt-2 text-sm">
              {SIGN_UP_TEXTS.bioStep.bioDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioStep;
