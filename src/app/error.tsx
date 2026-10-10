"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Home, RefreshCcw } from "lucide-react";
import { m } from "motion/react";
import { ROUTES } from "@/lib/constants/infra/routes";
import { PATIENT_APP_URL } from "@/configs/config";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="bg-destructive/5 flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        {/* Logo */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <Logo />
        </m.div>

        {/* Animated Error */}
        <m.div
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="relative mb-8"
        >
          <h1 className="text-destructive text-[8rem] leading-none font-bold tracking-tighter drop-shadow-sm select-none md:text-[12rem]">
            Error
          </h1>
        </m.div>

        {/* Main Message */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="mb-5 text-3xl font-extrabold tracking-tight md:text-5xl">
            Something went wrong
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed font-medium md:text-xl">
            We apologize for the inconvenience. Our team has been notified and
            is looking into the issue.
          </p>
        </m.div>

        {/* Action Buttons */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center justify-center gap-5 sm:flex-row"
        >
          <Button
            onClick={() => reset()}
            size="lg"
            className="group bg-destructive hover:bg-destructive/5 relative z-20 h-14 w-full overflow-hidden rounded-full px-8 text-base font-semibold text-white shadow-[0_8px_30px_rgb(239,68,68,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgb(239,68,68,0.4)] sm:w-auto"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <RefreshCcw className="h-5 w-5 text-white transition-transform duration-500 group-hover:rotate-180" />
              Try Again
            </span>
          </Button>
          <Button
            onClick={() => router.push("/")}
            size="lg"
            variant="outline"
            className="group border-border bg-background/50 hover:bg-background/5 h-14 w-full rounded-full border-2 px-8 text-base font-semibold shadow-xs backdrop-blur-sm transition-all duration-300 hover:shadow-md sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              <Home className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
              Return Home
            </span>
          </Button>
        </m.div>

        {/* Helpful Links */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="border-border mt-16 border-t pt-8"
        >
          <p className="text-muted-foreground mb-5 text-sm font-medium tracking-wider uppercase">
            You might be looking for
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-medium md:gap-6">
            <Button
              variant={"link"}
              onClick={() => router.push(ROUTES.public.landing)}
              className="text-muted-foreground hover:text-destructive/50 transition-all duration-300 hover:-translate-y-0.5"
            >
              Home
            </Button>
            <span className="text-muted-foreground">•</span>
            {PATIENT_APP_URL && (
              <>
                <Button
                  variant={"link"}
                  asChild
                  className="text-muted-foreground hover:text-destructive/50 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <a href={PATIENT_APP_URL}>Patient Lock-In</a>
                </Button>
                <span className="text-muted-foreground">•</span>
              </>
            )}
            <Button
              variant={"link"}
              onClick={() => router.push(ROUTES.provider.auth)}
              className="text-muted-foreground hover:text-destructive/50 transition-all duration-300 hover:-translate-y-0.5"
            >
              Provider Login
            </Button>
          </div>
        </m.div>
      </div>
    </div>
  );
}
