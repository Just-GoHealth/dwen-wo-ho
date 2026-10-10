"use client";

import { Suspense } from "react";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { CreativeStudiosFlowProvider } from "@/components/curator/create/creative-studios/flow-provider";
import { useCreativeStudiosFlowContext } from "@/hooks/components/curator/create/use-creative-studios-flow-context";
import { PreviewPanel } from "@/components/curator/create/creative-studios/preview-panel";
import { BackButton } from "@/components/curator/create/creative-studios/shared/back-button";
import { HomeButton } from "@/components/curator/create/creative-studios/shared/home-button";
import type {
  CreativeStudiosFlowColumnProps,
  CreativeStudiosWizardPreviewProps,
  CreativeStudiosWizardShellProps,
} from "@/lib/types/components/curator/create/creative-studios";
import { ROUTES } from "@/lib/constants/infra/routes";
import { useCreativeStudiosNavigation } from "@/hooks/components/curator/create/use-creative-studios-navigation";

function WizardPreview({ type }: CreativeStudiosWizardPreviewProps) {
  const { preview } = useCreativeStudiosFlowContext();
  const searchParams = useSearchParams();
  const step = Number(searchParams.get("step") ?? "1");
  const showLogo = step === 2 && (type === "campus" || type === "provider");

  return <PreviewPanel {...preview} showLogo={showLogo} />;
}

function WizardPreviewColumn({ type }: CreativeStudiosWizardPreviewProps) {
  const router = useRouter();

  return (
    <div className="relative h-full">
      <HomeButton
        onClick={() => router.push(ROUTES.curator.dashboard as Route)}
      />
      <WizardPreviewBoundary type={type} />
    </div>
  );
}

function WizardPreviewBoundary({ type }: CreativeStudiosWizardPreviewProps) {
  return (
    <Suspense
      fallback={<div className="relative h-full min-h-0 overflow-hidden" />}
    >
      <WizardPreview type={type} />
    </Suspense>
  );
}

function CreativeStudiosFlowColumn({
  type,
  children,
}: CreativeStudiosFlowColumnProps) {
  const { goBack } = useCreativeStudiosNavigation(type);

  return (
    <div className="relative flex min-h-full min-w-0 flex-col overflow-x-hidden overflow-y-auto p-4 md:p-8">
      <BackButton onClick={goBack} />
      <div className="mx-auto flex w-full max-w-md min-w-0 flex-1 flex-col justify-center pt-10 md:pt-12">
        {children}
      </div>
    </div>
  );
}

function CreativeStudiosFlowColumnBoundary({
  type,
  children,
}: CreativeStudiosFlowColumnProps) {
  return (
    <Suspense fallback={null}>
      <CreativeStudiosFlowColumn type={type}>
        {children}
      </CreativeStudiosFlowColumn>
    </Suspense>
  );
}

export function CreativeStudiosWizardShell({
  type,
  children,
}: CreativeStudiosWizardShellProps) {
  return (
    // key={type}: switching studio type must start from fresh drafts, not
    // whatever a previous wizard left in the provider's state (LOG-03).
    <CreativeStudiosFlowProvider key={type} type={type}>
      <div className="grid h-full min-h-0 w-full grid-cols-1 overflow-hidden md:grid-cols-2">
        <div className="hidden h-full min-h-0 md:block">
          <WizardPreviewColumn type={type} />
        </div>
        <CreativeStudiosFlowColumnBoundary type={type}>
          {children}
        </CreativeStudiosFlowColumnBoundary>
      </div>
    </CreativeStudiosFlowProvider>
  );
}
