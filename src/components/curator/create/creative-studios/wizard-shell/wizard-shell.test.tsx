// @vitest-environment happy-dom

import { describe, expect, it, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { useEffect, useState } from "react";

// Records each mounted provider instance and the drafts it starts with.
const mounts: { type: string; instance: number }[] = [];
let instanceCounter = 0;

vi.mock("@/components/curator/create/creative-studios/flow-provider", () => ({
  CreativeStudiosFlowProvider: ({ type }: { type: string }) => {
    const [instance] = useState(() => ++instanceCounter);
    useEffect(() => {
      mounts.push({ type, instance });
    }, [type, instance]);
    return null;
  },
}));

const { CreativeStudiosWizardShell } = await import("./index");

describe("CreativeStudiosWizardShell (LOG-03)", () => {
  beforeEach(() => {
    mounts.length = 0;
    instanceCounter = 0;
  });

  it("remounts the flow provider when the studio type changes", () => {
    const { rerender } = render(
      <CreativeStudiosWizardShell type="campus">
        <div />
      </CreativeStudiosWizardShell>,
    );
    rerender(
      <CreativeStudiosWizardShell type="provider">
        <div />
      </CreativeStudiosWizardShell>,
    );

    expect(mounts.map((m) => m.type)).toEqual(["campus", "provider"]);
    // A new instance means fresh state, so no drafts carry over.
    expect(mounts[0].instance).not.toBe(mounts[1].instance);
  });

  it("keeps the same provider while the type stays the same", () => {
    const { rerender } = render(
      <CreativeStudiosWizardShell type="campus">
        <div />
      </CreativeStudiosWizardShell>,
    );
    rerender(
      <CreativeStudiosWizardShell type="campus">
        <span />
      </CreativeStudiosWizardShell>,
    );

    expect(mounts).toHaveLength(1);
  });
});
