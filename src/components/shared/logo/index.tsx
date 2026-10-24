import Link from "next/link";
import { Logo as UiLogo } from "@just-gohealth/ui";
import { cn } from "@/lib/utils";
import { LogoProps } from "@/lib/types/components/shared/logo";
import { ROUTES } from "@/lib/constants/infra/routes";
import { Route } from "next";

const VARIANT_MAP = {
  purple: "purple",
  black: "dark",
  white: "light",
  auto: "auto",
} as const;

/**
 * The package Logo sizes itself `h-8 sm:h-10`. When a caller sizes the logo,
 * reset that to the app's previous `h-auto w-auto` base and carry the
 * caller's own base height up to `sm` so the package's `sm:h-10` can't win.
 */
// Literal class names so Tailwind generates them.
const SM_HEIGHT: Record<string, string> = {
  "h-auto": "sm:h-auto",
  "h-6": "sm:h-6",
  "h-7": "sm:h-7",
  "h-8": "sm:h-8",
  "h-10": "sm:h-10",
};

function sizingClasses(className?: string) {
  if (!className) return undefined;
  const baseHeight =
    className.split(/\s+/).find((token) => /^h-/.test(token)) ?? "h-auto";
  return cn("h-auto w-auto", SM_HEIGHT[baseHeight] ?? "sm:h-auto", className);
}

/** JustGo wordmark — backed by `@just-gohealth/ui`'s Logo, optionally linked. */
export const Logo = ({
  variant = "purple",
  className,
  withLink = true,
  href = ROUTES.public.landing as Route,
}: LogoProps) => {
  const content = (
    <UiLogo
      variant={VARIANT_MAP[variant]}
      className={cn(
        "-ml-0.5 bg-contain transition-all duration-300 ease-in-out hover:scale-95",
        sizingClasses(className),
      )}
    />
  );

  if (withLink) {
    return (
      <Link href={href as Route} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
};
