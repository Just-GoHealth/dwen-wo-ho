import { Logo } from "@/components/shared/logo";
import { useHydrated } from "@/hooks/shared/use-hydrated";
import { LoadingButton } from "@/components/ui/loading-button";
import { ProviderEmailFormData } from "@/lib/schemas/provider-auth-schema";
import { useProviderCheckEmail } from "@/hooks/provider/check-email/use-check-email";
import { CheckEmailProps } from "@/lib/types/components/provider/auth";
import { CHECK_EMAIL_TEXTS } from "@/lib/constants/components/provider/auth/auth-copy";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

const CheckEmail = ({ onEmailSubmit }: CheckEmailProps) => {
  const { checkEmailExists, isLoading, form } = useProviderCheckEmail({
    onEmailSubmit,
  });
  const { register, handleSubmit, errors } = form;

  const onSubmit = (values: ProviderEmailFormData) => {
    checkEmailExists(values.email);
  };
  const { theme } = useTheme();
  const mounted = useHydrated();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 flex h-full min-h-screen flex-col justify-between py-4 duration-700 sm:py-8">
      <div className="relative z-10 flex w-full items-center justify-between px-4 sm:px-8">
        <div className="transform transition-transform duration-300 hover:scale-105">
          <Logo
            variant={mounted && theme === "light" ? "black" : "white"}
            className="h-auto w-32 sm:w-auto"
          />
        </div>
        <span
          aria-disabled="true"
          title="Not available right now"
          className="text-muted-foreground/40 cursor-not-allowed rounded-full py-2 text-sm font-medium sm:px-4"
        >
          {CHECK_EMAIL_TEXTS.header.switchToPatients}
        </span>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-4 sm:px-8 md:px-12">
        <div className="w-full space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-2xl leading-tight font-extrabold tracking-tight sm:text-3xl md:text-4xl">
              {CHECK_EMAIL_TEXTS.form.titlePart1}{" "}
              <span className="text-primary">
                {CHECK_EMAIL_TEXTS.form.signIn}
              </span>{" "}
              {CHECK_EMAIL_TEXTS.form.or}{" "}
              <span className="text-primary">
                {CHECK_EMAIL_TEXTS.form.signUp}
              </span>
              <br />
              <span className="text-muted-foreground text-xl font-bold sm:text-2xl md:text-3xl">
                {CHECK_EMAIL_TEXTS.form.titlePart2}
              </span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              {CHECK_EMAIL_TEXTS.welcome.description}
            </p>
          </div>

          <form
            id="email-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label className="pl-1 text-sm font-medium sm:text-base">
                {CHECK_EMAIL_TEXTS.form.emailLabel}
              </Label>
              <div className="relative">
                <Input
                  {...register("email")}
                  placeholder={CHECK_EMAIL_TEXTS.form.emailPlaceholder}
                  className={`h-14 pr-16 pl-4 text-base transition-all duration-200 sm:text-lg ${
                    errors?.email &&
                    "border-destructive focus-visible:ring-destructive/30"
                  }`}
                  disabled={isLoading}
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  maxLength={255}
                  minLength={3}
                  required
                  autoSave="on"
                  autoFocus
                />
                <LoadingButton
                  type="submit"
                  size="icon"
                  loading={isLoading}
                  disabled={!!errors?.email}
                  className={`absolute top-2 right-2 h-10 w-10 rounded-lg transition-all duration-300 ${
                    !errors?.email && !isLoading
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </LoadingButton>
              </div>
              {errors?.email && (
                <p className="text-destructive pl-1 text-sm font-medium">
                  {errors.email.message as string}
                </p>
              )}
            </div>
          </form>

          <div className="pt-8 text-center">
            <h2 className="text-primary text-xl font-bold">
              {CHECK_EMAIL_TEXTS.welcome.title}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmail;
