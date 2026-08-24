import { describe, expect, it } from "vitest";
import type { SchoolPatientRecord } from "@/lib/types/components/curator/school-details/school-details";
import type { SchoolIcon } from "@/lib/types/entities/school";
import type { SchoolProvider } from "@/lib/types/entities/provider";
import type { FilterOption } from "@/lib/types/components/shared/search-dropdown";
import { buildCuratorSchoolTabSuggestions } from "./search-suggestions";

const newPatientFilter: FilterOption = {
  id: "new",
  label: "New",
  filterKey: "visibilityStatus",
  filterValue: "NEW",
  filterType: "exact",
};

const patient = {
  id: 1,
  patientId: 1,
  lockinId: 10,
  schoolId: 2,
  schoolName: "North High",
  schoolNickname: "North",
  patientName: "Jane Doe",
  lockinScore: 4,
  visibilityStatus: "NEW",
  createdAt: "2024-01-01T00:00:00.000Z",
  comment: "Needs follow-up",
  treatingProviders: [],
  patientLevel: "SHS",
} satisfies SchoolPatientRecord;

const seenPatient = {
  ...patient,
  id: 2,
  patientId: 2,
  patientName: "John Smith",
  visibilityStatus: "SEEN",
} satisfies SchoolPatientRecord;

const icon = {
  id: "10",
  name: "Science Club",
  type: "club",
  rank: 2,
  lockIns: ["1"],
  slogan: "Explore",
  photo: "",
  photoPreview: "",
  schoolId: 2,
} satisfies SchoolIcon;

const provider = {
  id: "provider-1",
  email: "dr@example.com",
  providerName: "Ada",
  providerTitle: "Dr.",
  applicationStatus: "APPROVED",
  specialty: "Psychiatry",
  officePhoneNumber: "555-0100",
  profilePhotoURL: "",
  isAssociated: true,
} satisfies SchoolProvider;

describe("buildCuratorSchoolTabSuggestions", () => {
  it("builds patient suggestions with status derivation", () => {
    const withProviders = {
      ...patient,
      treatingProviders: ["provider-1"],
    } satisfies SchoolPatientRecord;

    const results = buildCuratorSchoolTabSuggestions({
      activeTab: "patients",
      query: "",
      activeFilters: [],
      patients: [withProviders, seenPatient],
      schoolIcons: [],
      providers: [],
      limit: 5,
    });

    expect(results[0]).toMatchObject({
      name: "Jane Doe",
      score: 4,
      status: "action",
      preview: "Needs follow-up",
    });
    expect(results[1]?.status).toBe("follow-up");
  });

  it("filters patients by active filters and query", () => {
    const results = buildCuratorSchoolTabSuggestions({
      activeTab: "patients",
      query: "jane",
      activeFilters: [newPatientFilter],
      patients: [patient, seenPatient],
      schoolIcons: [],
      providers: [],
      limit: 5,
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe("Jane Doe");
  });

  it("builds icon suggestions that match filters and query", () => {
    const hasItemsFilter: FilterOption = {
      id: "ready",
      label: "Locked In",
      filterKey: "lockIns",
      filterValue: "hasItems",
      filterType: "contains",
    };

    const results = buildCuratorSchoolTabSuggestions({
      activeTab: "icons",
      query: "science",
      activeFilters: [hasItemsFilter],
      patients: [],
      schoolIcons: [icon],
      providers: [],
      limit: 5,
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe("Science Club");
  });

  it("builds provider suggestions for approved providers", () => {
    const approvedFilter: FilterOption = {
      id: "approved",
      label: "Approved",
      filterKey: "applicationStatus",
      filterValue: "APPROVED",
      filterType: "exact",
    };

    const results = buildCuratorSchoolTabSuggestions({
      activeTab: "providers",
      query: "ada",
      activeFilters: [approvedFilter],
      patients: [],
      schoolIcons: [],
      providers: [provider],
      limit: 5,
    });

    expect(results).toHaveLength(1);
    expect(results[0]?.name).toBe("Dr. Ada");
  });
});
