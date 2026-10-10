import { describe, expect, it } from "vitest";
import {
  buildPatientAppUrl,
  parseReferralFromLockInLabel,
} from "@/lib/utils/marketing/landing-2-referral";

describe("buildPatientAppUrl", () => {
  const base = "https://patient.example.com";

  it("returns null when the patient app URL is not configured", () => {
    expect(buildPatientAppUrl("Setornam", null)).toBeNull();
  });

  it("links to the patient app entry page", () => {
    expect(buildPatientAppUrl(null, base)).toBe(`${base}/`);
  });

  it("forwards the referral handle as ?ref=", () => {
    expect(buildPatientAppUrl("Setornam", base)).toBe(`${base}/?ref=Setornam`);
  });

  it("trims the handle and ignores a blank one", () => {
    expect(buildPatientAppUrl("  Setornam  ", base)).toBe(
      `${base}/?ref=Setornam`,
    );
    expect(buildPatientAppUrl("   ", base)).toBe(`${base}/`);
  });

  it("encodes unsafe characters", () => {
    expect(buildPatientAppUrl("a b&c", base)).toBe(`${base}/?ref=a+b%26c`);
  });
});

describe("parseReferralFromLockInLabel", () => {
  it("reads the handle from 'Lock In with @handle'", () => {
    expect(
      parseReferralFromLockInLabel("Lock In with @Setornam", "Lock In Now"),
    ).toBe("Setornam");
  });

  it("returns null for the default label", () => {
    expect(
      parseReferralFromLockInLabel("Lock In Now", "Lock In Now"),
    ).toBeNull();
  });

  it("returns null for anything else", () => {
    expect(
      parseReferralFromLockInLabel("Something else", "Lock In Now"),
    ).toBeNull();
    expect(
      parseReferralFromLockInLabel("Lock In with @", "Lock In Now"),
    ).toBeNull();
  });
});
