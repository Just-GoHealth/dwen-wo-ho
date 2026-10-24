import { describe, expect, it } from "vitest";
import type { PatientCase } from "@/lib/types/api/patient-results";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";
import {
  buildProviderTopSuggestions,
  countProviderPatientsForChip,
  filterProviderDashboardPatients,
} from "./patient-filters";

const statusNewFilter: FilterOption = {
  id: "status-new",
  label: "New",
  filterKey: "status",
  filterValue: "new",
  filterType: "exact",
};

const highScoreSort: FilterOption = {
  id: "high-score",
  label: "High Score",
  filterKey: "score",
  filterValue: "high",
  filterType: "score",
};

const lowScoreSort: FilterOption = {
  id: "low-score",
  label: "Low Score",
  filterKey: "score",
  filterValue: "low",
  filterType: "score",
};

const patients: PatientCase[] = [
  {
    patientId: "1",
    patientName: "Ada Lovelace",
    schoolName: "North High",
    schoolId: "10",
    status: "new",
    score: 8,
  } as PatientCase,
  {
    patientId: "2",
    patientName: "Grace Hopper",
    schoolName: "South High",
    schoolId: "20",
    status: "follow-up",
    score: 3,
  } as PatientCase,
];

describe("buildProviderTopSuggestions", () => {
  it("sorts by score when high-score is active without filtering low scores out", () => {
    const suggestions = buildProviderTopSuggestions(patients, "", [
      highScoreSort,
    ]);

    expect(suggestions.map((patient) => patient.patientId)).toEqual(["1", "2"]);
  });

  it("sorts ascending for low-score", () => {
    const suggestions = buildProviderTopSuggestions(patients, "", [
      lowScoreSort,
    ]);

    expect(suggestions.map((patient) => patient.patientId)).toEqual(["2", "1"]);
  });

  it("filters by query and status together", () => {
    const suggestions = buildProviderTopSuggestions(patients, "ada", [
      statusNewFilter,
    ]);

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]?.patientName).toBe("Ada Lovelace");
  });

  it("does not treat score sort chips as threshold filters", () => {
    const suggestions = buildProviderTopSuggestions(patients, "", [
      highScoreSort,
      statusNewFilter,
    ]);

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0]?.patientName).toBe("Ada Lovelace");
  });
});

describe("filterProviderDashboardPatients", () => {
  it("filters by school, status, search, and chips", () => {
    const filtered = filterProviderDashboardPatients({
      patients,
      activeSchool: "all",
      activeStatus: "new",
      appliedSearchQuery: "ada",
      localActiveFilters: [],
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.patientName).toBe("Ada Lovelace");
  });

  it("filters by school id and search text", () => {
    const filtered = filterProviderDashboardPatients({
      patients,
      activeSchool: "20",
      activeStatus: "all",
      appliedSearchQuery: "south",
      localActiveFilters: [],
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.patientName).toBe("Grace Hopper");
  });

  it("applies quick-filter chips", () => {
    const filtered = filterProviderDashboardPatients({
      patients,
      activeSchool: "all",
      activeStatus: "all",
      appliedSearchQuery: "",
      localActiveFilters: [statusNewFilter],
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.status).toBe("new");
  });
});

describe("countProviderPatientsForChip", () => {
  it("counts patients for a status chip", () => {
    expect(
      countProviderPatientsForChip({
        patients,
        activeSchool: "all",
        appliedSearchQuery: "",
        chipId: "new",
      }),
    ).toBe(1);
  });
});
