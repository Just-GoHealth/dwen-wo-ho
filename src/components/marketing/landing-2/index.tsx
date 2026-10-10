"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import type { Route } from "next";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  LANDING_2_ACHIEVEMENT_SLOTS,
  LANDING_2_CONTENT,
  LANDING_2_TIMING_SCALE,
} from "@/lib/marketing/landing-2";
import { useLanding2Sequence } from "@/hooks/marketing/landing-2/use-sequence";
import {
  buildPatientAppUrl,
  getLanding2LockInReferral,
} from "@/lib/utils/marketing/landing-2-referral";
import { Landing2AchievementCard } from "./achievement-card";
import { Landing2HeroSection } from "./hero-section";
import { Landing2InfluencerBadge } from "./influencer-badge";
import { Landing2StageControls } from "./stage-controls";

const L2_SHELL_STYLE = {
  "--l2-timing-scale": LANDING_2_TIMING_SCALE,
} as CSSProperties;

export function Landing2() {
  useLanding2Sequence();
  const { navigation, links, intro, assets } = LANDING_2_CONTENT;

  return (
    <div
      className="l2-shell bg-background text-foreground fixed inset-0 overflow-hidden overscroll-none antialiased"
      id="landing2Shell"
      style={L2_SHELL_STYLE}
    >
      <nav
        className="border-border bg-background/90 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-md"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto grid h-14 max-w-[1920px] grid-cols-3 items-center px-7 max-[480px]:px-4 sm:h-16">
          <div className="flex min-w-0 items-center justify-start">
            <Link
              className="l2-nav-item group text-foreground inline-flex min-w-0 flex-col items-center gap-1 text-[17px] font-bold no-underline max-[480px]:text-sm"
              href={links.pledge as Route}
              id="l2-nav-pledge"
            >
              <span className="truncate">{navigation.pledgeLabel}</span>
              <span
                className="bg-foreground h-[3px] w-full rounded-sm"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <div className="l2-nav-item shrink-0" id="l2-nav-logo">
              <Logo withLink href={links.home as Route} variant="auto" />
            </div>
          </div>

          <div className="l2-nav-item flex min-w-0 items-center justify-end gap-1.5">
            <Link
              className="border-primary hover:bg-primary/10 flex shrink-0 items-center justify-center gap-1 rounded-full border-2 px-4 py-2 font-bold whitespace-nowrap no-underline transition-colors"
              href={links.providers as Route}
              id="l2-nav-providers"
            >
              {navigation.providersLabel} <ArrowUpRight className="size-4" />
            </Link>
            <ThemeToggle className="shrink-0" />
          </div>
        </div>
      </nav>

      <div className="fixed inset-0 z-1 flex h-full w-full items-center justify-center overflow-hidden overscroll-none">
        <div
          className="l2-stage bg-background relative h-[1080px] w-[1960px] shrink-0 transition-opacity duration-400 ease-out will-change-transform"
          id="stage"
        >
          <h1
            className="l2-headline text-landing-2-highlight-header text-[156px] leading-none font-extrabold whitespace-nowrap"
            id="l2-headline"
          >
            <span id="typed" />
            <span className="l2-cursor hidden" id="cursor">
              |
            </span>
          </h1>

          <div
            className="l2-banner flex items-center justify-center transition-[opacity,transform] duration-700 ease-out"
            id="l2-banner"
            aria-live="polite"
          >
            <div className="text-landing-2-highlight text-[90px] leading-none font-extrabold whitespace-nowrap">
              {intro.bannerText}{" "}
              <span
                className="l2-wave -ml-2 inline-block origin-[75%_75%] align-bottom leading-none transition-[opacity,transform] duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                id="l2-wave"
              >
                <Image
                  className="block size-[1em] object-contain"
                  src={assets.wave}
                  alt=""
                  width={90}
                  height={90}
                  unoptimized
                />
              </span>
            </div>
          </div>

          <p
            className="l2-stat-line text-foreground text-[48px] leading-none font-semibold whitespace-nowrap transition-[opacity,transform] duration-700 ease-out"
            id="statLine"
          />

          <Landing2HeroSection />

          <Landing2InfluencerBadge />

          {LANDING_2_ACHIEVEMENT_SLOTS.map((slot) => (
            <Landing2AchievementCard key={slot.id} slot={slot} />
          ))}

          <Landing2StageControls />

          <button
            className="l2-lock-in-btn bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/10 rounded-full text-2xl font-extrabold shadow-2xs transition-[opacity,transform,width,background,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            id="l2-lock-in-btn"
            type="button"
            aria-label="Lock In - Get started now"
            onClick={() => {
              const url = buildPatientAppUrl(getLanding2LockInReferral());
              if (url) window.location.assign(url);
            }}
          >
            <Lock className="size-6" />
            <span className="inline-block overflow-hidden align-middle">
              <span
                className="l2-lock-in-btn-text inline-block transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                id="l2-lock-in-btn-text"
              >
                {intro.lockInDefault}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
